import React, { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import { theme } from '../../theme';
import { useCategories, useProducts } from '../../hooks/useProducts';
import { ROUTES } from '../../navigation/routes';
import { formatResultCount } from '../../utils/format';
import { groupByKind } from '../../utils/products';
import BookCard from '../../components/BookCard';
import CategoryChip from '../../components/CategoryChip';
import EmptyState from '../../components/EmptyState';
import Header from '../../components/Header';
import KitCard from '../../components/KitCard';
import SearchBar from '../../components/SearchBar';

const { colors, fonts, fontSizes, layout, spacing } = theme;

const ALL = null; // "nenhuma categoria selecionada"

// Resultados por categoria e/ou busca. Parâmetros da rota: { category?, search? }.
// A tela guarda só o estado dos filtros; a filtragem em si é feita pelo
// serviço de produtos (backend), e aqui só separamos kits de livros.
export default function CategoryResultsScreen({ navigation, route }) {
  const params = route.params ?? {};
  const [category, setCategory] = useState(params.category ?? ALL);
  const [searchText, setSearchText] = useState(params.search ?? ''); // o que está digitado
  const [appliedSearch, setAppliedSearch] = useState(params.search ?? ''); // o que foi confirmado

  const categories = useCategories();
  const results = useProducts({ category: category ?? undefined, search: appliedSearch });

  // Separa kits e livros só quando os dados mudam. Custo: O(n).
  const { books, kits } = useMemo(
    () => groupByKind(results.data?.items ?? []),
    [results.data]
  );
  const total = results.data?.total ?? 0;

  const handleChangeText = (text) => {
    setSearchText(text);
    if (!text) setAppliedSearch(''); // apagar o texto remove o filtro de busca
  };
  const handleSubmit = () => setAppliedSearch(searchText.trim());
  const clearFilters = () => {
    setCategory(ALL);
    setSearchText('');
    setAppliedSearch('');
  };

  const renderBook = ({ item }) => (
    <View style={styles.gridItem}>
      <BookCard
        title={item.title}
        author={item.author}
        category={item.category}
        price={item.price}
        imageUri={item.imageUri}
        onPress={() => navigation.navigate(ROUTES.BOOK_DETAIL, { productId: item.id })}
      />
    </View>
  );

  // Kits vão no topo da lista, em formato compacto.
  const renderKits = () =>
    kits.length ? (
      <View style={styles.kitsBlock}>
        <Text style={styles.sectionTitle}>Kits surpresa</Text>
        {kits.map((kit) => (
          <KitCard
            key={kit.id}
            variant="list"
            title={kit.title}
            category={kit.category}
            bookCount={kit.bookCount}
            price={kit.price}
            imageUri={kit.imageUri}
            onPress={() => navigation.navigate(ROUTES.KIT_DETAIL, { productId: kit.id })}
          />
        ))}
        {books.length ? <Text style={styles.sectionTitle}>Livros</Text> : null}
      </View>
    ) : null;

  const renderBody = () => {
    if (results.loading) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }

    if (results.error) {
      return (
        <EmptyState
          icon="cloud-offline-outline"
          title="Não foi possível carregar"
          message={results.error}
          actionLabel="Tentar novamente"
          onAction={results.reload}
        />
      );
    }

    if (total === 0) {
      return (
        <EmptyState
          icon="search-outline"
          title="Nada encontrado"
          message="Tente outra categoria ou outro termo de busca."
          actionLabel="Limpar filtros"
          onAction={clearFilters}
        />
      );
    }

    return (
      <FlatList
        data={books}
        renderItem={renderBook}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={styles.row}
        ListHeaderComponent={
          <>
            <Text style={styles.count}>{formatResultCount(total)}</Text>
            {renderKits()}
          </>
        }
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
      />
    );
  };

  return (
    <View style={styles.screen}>
      <Header title={category ?? 'Resultados'} onBack={() => navigation.goBack()} />

      <View style={styles.search}>
        <SearchBar
          value={searchText}
          onChangeText={handleChangeText}
          onSubmitEditing={handleSubmit}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipsScroll}
        contentContainerStyle={styles.chips}
        keyboardShouldPersistTaps="handled"
      >
        <CategoryChip label="Todas" selected={category === ALL} onPress={() => setCategory(ALL)} />
        {(categories.data ?? []).map((name) => (
          <CategoryChip
            key={name}
            label={name}
            selected={category === name}
            onPress={() => setCategory(name)}
          />
        ))}
      </ScrollView>

      {renderBody()}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  search: {
    paddingHorizontal: layout.screenPadding,
  },
  chipsScroll: {
    flexGrow: 0, // sem isso, a lista horizontal ocuparia a altura da tela
  },
  chips: {
    paddingHorizontal: layout.screenPadding,
    paddingVertical: spacing.lg,
    gap: spacing.sm,
  },
  centered: {
    paddingVertical: spacing.xxl,
    alignItems: 'center',
  },
  list: {
    paddingHorizontal: layout.screenPadding,
    paddingBottom: spacing.xxl,
  },
  row: {
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  gridItem: {
    flex: 1,
    maxWidth: '50%', // um livro sozinho na última linha não estica
  },
  count: {
    fontFamily: fonts.body,
    fontSize: fontSizes.body,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  kitsBlock: {
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontFamily: fonts.title,
    fontSize: fontSizes.subtitle,
    color: colors.text,
  },
});
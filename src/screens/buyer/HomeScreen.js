import React, { useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../../theme';
import { useAuth } from '../../hooks/useAuth';
import { useCategories, useProducts } from '../../hooks/useProducts';
import { ROUTES } from '../../navigation/routes';
import { getFirstName } from '../../utils/format';
import { groupByKind } from '../../utils/products';
import BookCard from '../../components/BookCard';
import CategoryChip from '../../components/CategoryChip';
import EmptyState from '../../components/EmptyState';
import KitCard from '../../components/KitCard';
import SearchBar from '../../components/SearchBar';
import Shelf from '../../components/Shelf';

const { colors, fonts, fontSizes, layout, spacing } = theme;

const FEATURED_COUNT = 6; // livros mostrados em destaque
const KIT_CARD_WIDTH = 260;
const BOOK_CARD_WIDTH = 160;

// Tela Início do comprador. Só monta a tela e navega: os dados vêm dos hooks e
// o desenho dos cards vem dos componentes (responsabilidade única).
export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const products = useProducts();
  const categories = useCategories();

  // Separa livros e kits só quando os dados mudam. Custo: O(n).
  const { books, kits } = useMemo(
    () => groupByKind(products.data?.items ?? []),
    [products.data]
  );
  const featuredBooks = useMemo(() => books.slice(0, FEATURED_COUNT), [books]);

  const openResults = (params) => navigation.navigate(ROUTES.CATEGORY_RESULTS, params);

  const handleSearch = () => {
    const term = search.trim();
    if (term) openResults({ search: term });
  };

  const renderKit = ({ item }) => (
    <KitCard
      title={item.title}
      category={item.category}
      bookCount={item.bookCount}
      price={item.price}
      imageUri={item.imageUri}
      style={{ width: KIT_CARD_WIDTH }}
      onPress={() => navigation.navigate(ROUTES.KIT_DETAIL, { productId: item.id })}
    />
  );

  const renderBook = ({ item }) => (
    <BookCard
      title={item.title}
      author={item.author}
      category={item.category}
      price={item.price}
      imageUri={item.imageUri}
      style={{ width: BOOK_CARD_WIDTH }}
      onPress={() => navigation.navigate(ROUTES.BOOK_DETAIL, { productId: item.id })}
    />
  );

  const renderContent = () => {
    if (products.loading) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }

    if (products.error) {
      return (
        <EmptyState
          icon="cloud-offline-outline"
          title="Não foi possível carregar"
          message={products.error}
          actionLabel="Tentar novamente"
          onAction={products.reload}
        />
      );
    }

    if (!kits.length && !featuredBooks.length) {
      return (
        <EmptyState
          title="Nenhum livro por aqui ainda"
          message="Volte em breve: novos livros e kits estão a caminho."
        />
      );
    }

    return (
      <>
        <Shelf title="Kits surpresa" data={kits} renderItem={renderKit} />
        <Shelf title="Livros em destaque" data={featuredBooks} renderItem={renderBook} />
      </>
    );
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ paddingTop: insets.top + spacing.lg, paddingBottom: spacing.xxl }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.padded}>
        <Text style={styles.greeting}>Olá, {getFirstName(user?.name)}</Text>
        <Text style={styles.title}>O que vamos ler hoje?</Text>

        <SearchBar
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={handleSearch}
          style={styles.search}
        />
      </View>

      {categories.data ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
        >
          {categories.data.map((category) => (
            <CategoryChip
              key={category}
              label={category}
              onPress={() => openResults({ category })}
            />
          ))}
        </ScrollView>
      ) : null}

      {renderContent()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  padded: {
    paddingHorizontal: layout.screenPadding,
  },
  greeting: {
    fontFamily: fonts.body,
    fontSize: fontSizes.bodyLarge,
    color: colors.textMuted,
  },
  title: {
    fontFamily: fonts.title,
    fontSize: fontSizes.headline,
    color: colors.text,
    marginTop: spacing.xs,
  },
  search: {
    marginTop: spacing.lg,
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
});
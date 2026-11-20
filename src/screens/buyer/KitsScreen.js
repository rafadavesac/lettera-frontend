import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { theme } from '../../theme';
import { useProducts } from '../../hooks/useProducts';
import { ROUTES } from '../../navigation/routes';
import EmptyState from '../../components/EmptyState';
import Header from '../../components/Header';
import KitCard from '../../components/KitCard';

const { colors, fonts, fontSizes, layout, spacing } = theme;

const Separator = () => <View style={styles.separator} />;

// Aba Kits: lista de todos os kits surpresa. O filtro por tipo é feito pelo
// serviço de produtos; a tela só mostra o resultado e navega para o detalhe.
// Custo: a FlatList desenha só os itens visíveis, O(v) por tela.
export default function KitsScreen({ navigation }) {
  const { data, loading, error, reload } = useProducts({ type: 'KIT' });
  const kits = data?.items ?? [];

  const renderKit = ({ item }) => (
    <KitCard
      variant="list"
      title={item.title}
      category={item.category}
      bookCount={item.bookCount}
      price={item.price}
      imageUri={item.imageUri}
      onPress={() => navigation.navigate(ROUTES.KIT_DETAIL, { productId: item.id })}
    />
  );

  const renderBody = () => {
    if (loading) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }

    if (error) {
      return (
        <EmptyState
          icon="cloud-offline-outline"
          title="Não foi possível carregar"
          message={error}
          actionLabel="Tentar novamente"
          onAction={reload}
        />
      );
    }

    if (!kits.length) {
      return (
        <EmptyState
          icon="gift-outline"
          title="Nenhum kit disponível"
          message="Novos kits surpresa chegam em breve."
        />
      );
    }

    return (
      <FlatList
        data={kits}
        renderItem={renderKit}
        keyExtractor={(item) => String(item.id)}
        ItemSeparatorComponent={Separator}
        ListHeaderComponent={
          <Text style={styles.intro}>
            Não sabe o que ler? Escolha um gênero e receba livros surpresa, revelados só
            depois da compra.
          </Text>
        }
        contentContainerStyle={styles.list}
      />
    );
  };

  return (
    <View style={styles.screen}>
      <Header title="Kits surpresa" />
      {renderBody()}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    paddingHorizontal: layout.screenPadding,
    paddingVertical: spacing.md,
  },
  intro: {
    fontFamily: fonts.body,
    fontSize: fontSizes.bodyLarge,
    color: colors.textMuted,
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  separator: {
    height: spacing.md,
  },
});
import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { theme } from '../../theme';
import { useProduct } from '../../hooks/useProducts';
import CoverImage from '../../components/CoverImage';
import DetailScaffold from '../../components/DetailScaffold';
import Tag from '../../components/Tag';

const { colors, fonts, fontSizes, spacing } = theme;

// Detalhe do livro. Parâmetro da rota: { productId }. O produto é buscado
// pelo id, então a tela sempre mostra o dado atual e trata carregamento e erro.
export default function BookDetailScreen({ navigation, route }) {
  const { productId } = route.params;
  const { data: book, loading, error, reload } = useProduct(productId);

  // Provisório: o carrinho será criado no próximo chat.
  // Lá, trocar este Alert por addItem(book).
  const handleAddToCart = () => Alert.alert('Carrinho', 'O carrinho chega no próximo passo.');

  return (
    <DetailScaffold
      title="Detalhe do livro"
      onBack={() => navigation.goBack()}
      loading={loading}
      error={error}
      onRetry={reload}
      price={book?.price}
      actionLabel="Adicionar ao carrinho"
      onAction={handleAddToCart}
    >
      {book ? (
        <View style={styles.content}>
          <CoverImage uri={book.imageUri} style={styles.cover} />

          <Tag label={book.category} style={styles.tag} />
          <Text style={styles.title}>{book.title}</Text>
          {book.author ? <Text style={styles.author}>{book.author}</Text> : null}

          <Text style={styles.sectionTitle}>Sobre o livro</Text>
          <Text style={styles.description}>
            {book.description || 'Este livro ainda não tem descrição.'}
          </Text>
        </View>
      ) : null}
    </DetailScaffold>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: spacing.sm,
  },
  cover: {
    width: 180,
    aspectRatio: 2 / 3,
    alignSelf: 'center',
  },
  tag: {
    marginTop: spacing.xl,
  },
  title: {
    fontFamily: fonts.title,
    fontSize: fontSizes.headline,
    color: colors.text,
    marginTop: spacing.sm,
  },
  author: {
    fontFamily: fonts.body,
    fontSize: fontSizes.bodyLarge,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  sectionTitle: {
    fontFamily: fonts.title,
    fontSize: fontSizes.subtitle,
    color: colors.text,
    marginTop: spacing.xl,
  },
  description: {
    fontFamily: fonts.body,
    fontSize: fontSizes.bodyLarge,
    color: colors.text,
    lineHeight: 24,
    marginTop: spacing.sm,
  },
});
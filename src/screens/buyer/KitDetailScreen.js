import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { useProduct } from '../../hooks/useProducts';
import { formatBookCount } from '../../utils/format';
import CoverImage from '../../components/CoverImage';
import DetailScaffold from '../../components/DetailScaffold';
import Tag from '../../components/Tag';

const { colors, fonts, fontSizes, radius, spacing } = theme;

// Detalhe do kit surpresa. Parâmetro da rota: { productId }.
// A "caixa fechada" é a capa do kit (ou o presente dourado, sem imagem):
// os livros só são sorteados e revelados depois da compra.
export default function KitDetailScreen({ navigation, route }) {
  const { productId } = route.params;
  const { data: kit, loading, error, reload } = useProduct(productId);

  // Provisório: o carrinho será criado no próximo chat.
  // Lá, trocar este Alert por addItem(kit).
  const handleAddToCart = () => Alert.alert('Carrinho', 'O carrinho chega no próximo passo.');

  return (
    <DetailScaffold
      title="Detalhe do kit"
      onBack={() => navigation.goBack()}
      loading={loading}
      error={error}
      onRetry={reload}
      price={kit?.price}
      actionLabel="Adicionar ao carrinho"
      onAction={handleAddToCart}
    >
      {kit ? (
        <View style={styles.content}>
          <CoverImage uri={kit.imageUri} placeholderIcon="gift" style={styles.cover} />

          <View style={styles.tags}>
            <Tag label={kit.category} />
            <Tag label={formatBookCount(kit.bookCount)} variant="primary" />
          </View>
          <Text style={styles.title}>{kit.title}</Text>

          <View style={styles.callout}>
            <Ionicons name="sparkles-outline" size={22} color={colors.primaryDark} />
            <Text style={styles.calloutText}>
              Os livros de {kit.category} são sorteados para você e revelados só depois da
              compra.
            </Text>
          </View>

          <Text style={styles.sectionTitle}>Sobre o kit</Text>
          <Text style={styles.description}>
            {kit.description || 'Este kit ainda não tem descrição.'}
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
    width: '100%',
    aspectRatio: 16 / 10,
  },
  tags: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xl,
  },
  title: {
    fontFamily: fonts.title,
    fontSize: fontSizes.headline,
    color: colors.text,
    marginTop: spacing.sm,
  },
  callout: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.lg,
    padding: spacing.lg,
    borderRadius: radius.card,
    backgroundColor: colors.accentGoldLight,
  },
  calloutText: {
    flex: 1,
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.body,
    color: colors.primaryDark,
    lineHeight: 20,
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
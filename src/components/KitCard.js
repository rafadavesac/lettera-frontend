import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';
import { formatBookCount, formatPrice } from '../utils/format';
import CoverImage from './CoverImage';
import Tag from './Tag';

const { colors, fonts, fontSizes, radius, shadows, spacing } = theme;

// Card de kit surpresa, com duas disposições:
// - "large": vertical, para destaque na tela Início;
// - "list": horizontal e compacto, para a tela Kits.
// Como o BookCard, recebe valores simples (não o objeto da API) e reaproveita
// CoverImage e Tag. O placeholder da capa é um presente, para diferenciar de livro.
// Custo de renderização: O(1) por card; uma lista de n cards custa O(n).
export default function KitCard({
  title,
  category,
  bookCount,
  price,
  imageUri,
  onPress,
  variant = 'large',
  style,
}) {
  const isList = variant === 'list';

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${formatBookCount(bookCount)}, ${formatPrice(price)}`}
      style={({ pressed }) => [
        styles.card,
        isList ? styles.cardList : styles.cardLarge,
        pressed && styles.pressed,
        style,
      ]}
    >
      <CoverImage
        uri={imageUri}
        placeholderIcon="gift"
        style={isList ? styles.coverList : styles.coverLarge}
      />

      <View style={isList ? styles.infoList : styles.infoLarge}>
        {category ? <Tag label={category} /> : null}
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.count}>{formatBookCount(bookCount)}</Text>
        <Text style={styles.price}>{formatPrice(price)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: spacing.md,
    gap: spacing.md,
    ...shadows.soft,
  },
  cardLarge: {
    // vertical (padrão do View)
  },
  cardList: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.85,
  },
  coverLarge: {
    width: '100%',
    aspectRatio: 16 / 10,
  },
  coverList: {
    width: 88,
    height: 88,
  },
  infoLarge: {
    gap: spacing.xs,
  },
  infoList: {
    flex: 1, // ocupa o resto da linha, ao lado da capa
    gap: spacing.xs,
  },
  title: {
    fontFamily: fonts.title,
    fontSize: fontSizes.subtitle,
    color: colors.text,
  },
  count: {
    fontFamily: fonts.body,
    fontSize: fontSizes.body,
    color: colors.textMuted,
  },
  price: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSizes.bodyLarge,
    color: colors.primary,
    marginTop: spacing.xs,
  },
});
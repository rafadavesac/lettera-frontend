import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';
import { formatPrice } from '../utils/format';
import CoverImage from './CoverImage';
import Tag from './Tag';

const { colors, fonts, fontSizes, radius, shadows, spacing } = theme;

// Card de livro para listas e vitrines. Recebe valores simples (não o objeto
// inteiro da API), então não depende do formato do backend: quem usa faz o
// mapeamento. Reaproveita CoverImage e Tag (reutilização, responsabilidade única).
// A largura vem do pai via `style` (ex.: width fixa na vitrine horizontal).
// Custo de renderização: O(1) por card; uma lista de n cards custa O(n).
export default function BookCard({
  title,
  author,
  category,
  price,
  imageUri,
  onPress,
  style,
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}, de ${author}, ${formatPrice(price)}`}
      style={({ pressed }) => [styles.card, pressed && styles.pressed, style]}
    >
      <CoverImage uri={imageUri} style={styles.cover} />

      <View style={styles.info}>
        {category ? <Tag label={category} /> : null}
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.author} numberOfLines={1}>
          {author}
        </Text>
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
  pressed: {
    opacity: 0.85,
  },
  cover: {
    width: '100%',
    aspectRatio: 2 / 3, // proporção de capa de livro
  },
  info: {
    gap: spacing.xs,
  },
  title: {
    fontFamily: fonts.title,
    fontSize: fontSizes.bodyLarge,
    color: colors.text,
  },
  author: {
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
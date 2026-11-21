import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';
import CoverImage from './CoverImage';
import Tag from './Tag';

const { colors, fonts, fontSizes, radius, shadows, spacing } = theme;

// Livro sorteado de um kit: capa, título, autor e categoria. Usado na
// revelação, na confirmação e no detalhe do pedido (reutilização).
// Custo de renderização: O(1) por linha.
export default function DrawnBookRow({ title, author, category, imageUri, style }) {
  return (
    <View style={[styles.row, style]}>
      <CoverImage uri={imageUri} style={styles.cover} />

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        {author ? (
          <Text style={styles.author} numberOfLines={1}>
            {author}
          </Text>
        ) : null}
        <Tag label={category} style={styles.tag} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    ...shadows.soft,
  },
  cover: {
    width: 56,
    height: 80,
  },
  info: {
    flex: 1,
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
  tag: {
    marginTop: spacing.xs,
  },
});
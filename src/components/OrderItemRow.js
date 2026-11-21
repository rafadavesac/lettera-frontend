import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';
import { formatPrice } from '../utils/format';
import CoverImage from './CoverImage';

const { colors, fonts, fontSizes, radius, shadows, spacing } = theme;

// Linha de item sem edição: capa, título, subtítulo, "quantidade × preço" e
// subtotal. Serve ao resumo do pedido, à confirmação e ao detalhe do pedido
// (reutilização). Custo de renderização: O(1) por linha.
export default function OrderItemRow({
  title,
  subtitle,
  quantity,
  unitPrice,
  subtotal,
  imageUri,
  isKit = false,
  style,
}) {
  return (
    <View style={[styles.row, style]}>
      <CoverImage
        uri={imageUri}
        placeholderIcon={isKit ? 'gift' : 'book'}
        style={styles.cover}
      />

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
        <Text style={styles.meta}>{`${quantity} × ${formatPrice(unitPrice)}`}</Text>
      </View>

      <Text style={styles.subtotal}>{formatPrice(subtotal)}</Text>
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
    width: 48,
    height: 68,
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
  subtitle: {
    fontFamily: fonts.body,
    fontSize: fontSizes.body,
    color: colors.textMuted,
  },
  meta: {
    fontFamily: fonts.body,
    fontSize: fontSizes.caption,
    color: colors.textMuted,
  },
  subtotal: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSizes.bodyLarge,
    color: colors.primary,
  },
});
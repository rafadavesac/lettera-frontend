import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { formatPrice } from '../utils/format';
import CoverImage from './CoverImage';
import QuantityStepper from './QuantityStepper';

const { colors, fonts, fontSizes, radius, shadows, spacing } = theme;

// Linha do carrinho: capa, título, subtítulo (autor ou "2 livros surpresa"),
// quantidade e botão de remover. `isKit` só troca o ícone do placeholder.
// Mostra o subtotal da linha (preço x quantidade): O(1) por linha; o total
// do carrinho, somando n linhas, será O(n) e fica no contexto do carrinho.
export default function CartItemRow({
  title,
  subtitle,
  price,
  quantity,
  imageUri,
  isKit = false,
  onChangeQuantity,
  onRemove,
  maxQuantity,
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

        <View style={styles.footer}>
          <QuantityStepper value={quantity} onChange={onChangeQuantity} max={maxQuantity} />
          <Text style={styles.price}>{formatPrice(price * quantity)}</Text>
        </View>
      </View>

      <Pressable
        onPress={onRemove}
        accessibilityRole="button"
        accessibilityLabel={`Remover ${title} do carrinho`}
        hitSlop={8}
        style={styles.remove}
      >
        <Ionicons name="trash-outline" size={20} color={colors.error} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    ...shadows.soft,
  },
  cover: {
    width: 72,
    height: 104,
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
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 'auto', // empurra para a base da linha
  },
  price: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSizes.bodyLarge,
    color: colors.primary,
  },
  remove: {
    alignSelf: 'flex-start',
  },
});
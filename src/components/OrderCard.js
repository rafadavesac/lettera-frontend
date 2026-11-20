import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { formatDate, formatPrice } from '../utils/format';

const { colors, fonts, fontSizes, radius, shadows, spacing } = theme;

// Resumo de um pedido no histórico: número, data, quantidade de itens e total.
// Serve ao comprador (histórico de compras) e, com outro texto, a outras listas
// (o `label` troca "Pedido" por, por exemplo, "Venda").
// Custo de renderização: O(1) por card; uma lista de n pedidos custa O(n).
export default function OrderCard({
  orderId,
  date,
  itemCount,
  total,
  label = 'Pedido',
  onPress,
  style,
}) {
  const itemsText = `${itemCount} ${itemCount === 1 ? 'item' : 'itens'}`;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${label} ${orderId}, ${formatDate(date)}, ${itemsText}, ${formatPrice(total)}`}
      style={({ pressed }) => [styles.card, pressed && styles.pressed, style]}
    >
      <View style={styles.info}>
        <Text style={styles.title}>{`${label} #${orderId}`}</Text>
        <Text style={styles.meta}>{`${formatDate(date)} · ${itemsText}`}</Text>
        <Text style={styles.total}>{formatPrice(total)}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    ...shadows.soft,
  },
  pressed: {
    opacity: 0.85,
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
  meta: {
    fontFamily: fonts.body,
    fontSize: fontSizes.body,
    color: colors.textMuted,
  },
  total: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSizes.bodyLarge,
    color: colors.primary,
  },
});
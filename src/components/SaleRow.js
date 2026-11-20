import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';
import { formatDate, formatPrice } from '../utils/format';

const { colors, fonts, fontSizes, radius, shadows, spacing } = theme;

// Linha do histórico de vendas do vendedor: um item vendido, com data,
// quantidade e valor. Não é tocável (só consulta).
// Custo de renderização: O(1) por linha; somar o total das n vendas é O(n)
// e fica na tela (ou no serviço), não aqui.
export default function SaleRow({ title, date, quantity, total, style }) {
  return (
    <View style={[styles.row, style]}>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.meta}>{`${formatDate(date)} · Qtd. ${quantity}`}</Text>
      </View>
      <Text style={styles.total}>{formatPrice(total)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    ...shadows.soft,
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
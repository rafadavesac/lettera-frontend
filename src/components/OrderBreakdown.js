import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';
import { flattenDraws } from '../utils/draws';
import { formatPrice } from '../utils/format';
import { getItemSubtitle } from '../utils/products';
import DrawnBookRow from './DrawnBookRow';
import OrderItemRow from './OrderItemRow';

const { colors, fonts, fontSizes, spacing } = theme;

// Corpo de um pedido: itens, livros sorteados (se houver kits) e total.
// Usado na confirmação e no detalhe do pedido, para as duas mostrarem
// exatamente o mesmo conteúdo (reutilização, sem duplicar código).
// Custo: O(i + d + b), com i itens, d sorteios e b livros sorteados.
export default function OrderBreakdown({ order }) {
  const boxes = useMemo(() => flattenDraws(order), [order]);

  return (
    <View>
      <Text style={styles.sectionTitle}>Itens do pedido</Text>
      <View style={styles.list}>
        {order.items.map((item) => (
          <OrderItemRow
            key={item.productId}
            title={item.title}
            subtitle={getItemSubtitle(item)}
            quantity={item.quantity}
            unitPrice={item.unitPrice}
            subtotal={item.subtotal}
            imageUri={item.imageUri}
            isKit={item.isKit}
          />
        ))}
      </View>

      {boxes.length > 0 ? (
        <>
          <Text style={[styles.sectionTitle, styles.drawsTitle]}>Seus livros sorteados</Text>
          {boxes.map((box) => (
            <View key={box.key} style={styles.box}>
              <Text style={styles.boxLabel}>{box.label}</Text>
              <View style={styles.list}>
                  {box.books.map((book, i) => (
                  <DrawnBookRow
                    key={`${box.key}-${i}`}
                    title={book.title}
                    author={book.author}
                    category={book.category}
                    imageUri={book.imageUri}
                  />
                ))}
              </View>
            </View>
          ))}
        </>
      ) : null}

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.total}>{formatPrice(order.total)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontFamily: fonts.title,
    fontSize: fontSizes.subtitle,
    color: colors.text,
    marginBottom: spacing.md,
  },
  drawsTitle: {
    marginTop: spacing.xl,
  },
  list: {
    gap: spacing.md,
  },
  box: {
    marginBottom: spacing.lg,
  },
  boxLabel: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSizes.body,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  totalLabel: {
    fontFamily: fonts.body,
    fontSize: fontSizes.bodyLarge,
    color: colors.textMuted,
  },
  total: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSizes.title,
    color: colors.primary,
  },
});

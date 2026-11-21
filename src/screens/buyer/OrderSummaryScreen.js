import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { useCart } from '../../hooks/useCart';
import { useCreateOrder } from '../../hooks/useOrders';
import { ROUTES } from '../../navigation/routes';
import { formatPrice } from '../../utils/format';
import { getItemSubtitle } from '../../utils/products';
import Button from '../../components/Button';
import ErrorBanner from '../../components/ErrorBanner';
import Header from '../../components/Header';
import OrderItemRow from '../../components/OrderItemRow';

const { colors, fonts, fontSizes, layout, radius, spacing } = theme;

// Resumo do pedido: revisão final antes de confirmar. Ao confirmar, chama
// POST /orders (via useCreateOrder); se der certo, abre a confirmação e
// esvazia o carrinho; se falhar, mostra o erro e mantém o carrinho.
// Custo: O(n) para desenhar os n itens (poucos, então sem FlatList).
export default function OrderSummaryScreen({ navigation }) {
  const { items, total, itemCount, clear } = useCart();
  const { submit, submitting, error } = useCreateOrder();
  const hasKit = items.some((item) => item.isKit); // O(n)

  const handleConfirm = async () => {
    const order = await submit(items);
    if (!order) return; // o erro aparece no banner

    // `replace` tira o resumo da pilha: voltar não refaz o pedido.
    navigation.replace(ROUTES.ORDER_CONFIRMED, { order });
    clear();
  };

  return (
    <View style={styles.screen}>
      <Header title="Resumo do pedido" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>
          {`Itens do pedido (${itemCount})`}
        </Text>

        <View style={styles.list}>
          {items.map((item) => (
            <OrderItemRow
              key={item.productId}
              title={item.title}
              subtitle={getItemSubtitle(item)}
              quantity={item.quantity}
              unitPrice={item.price}
              subtotal={item.price * item.quantity}
              imageUri={item.imageUri}
              isKit={item.isKit}
            />
          ))}
        </View>

        {hasKit ? (
          <View style={styles.callout}>
            <Ionicons name="sparkles-outline" size={22} color={colors.primaryDark} />
            <Text style={styles.calloutText}>
              Os livros dos kits são sorteados quando você confirma o pedido e revelados em
              seguida.
            </Text>
          </View>
        ) : null}
      </ScrollView>

      <View style={styles.footer}>
        <ErrorBanner message={error} style={styles.error} />
        <View style={styles.footerRow}>
          <View>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.total}>{formatPrice(total)}</Text>
          </View>
          <Button
            title="Confirmar pedido"
            onPress={handleConfirm}
            loading={submitting}
            style={styles.action}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: layout.screenPadding,
    paddingBottom: spacing.xl,
  },
  sectionTitle: {
    fontFamily: fonts.title,
    fontSize: fontSizes.subtitle,
    color: colors.text,
    marginBottom: spacing.md,
  },
  list: {
    gap: spacing.md,
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
  footer: {
    paddingHorizontal: layout.screenPadding,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  error: {
    marginBottom: spacing.md,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  totalLabel: {
    fontFamily: fonts.body,
    fontSize: fontSizes.caption,
    color: colors.textMuted,
  },
  total: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSizes.title,
    color: colors.primary,
  },
  action: {
    flex: 1,
  },
});
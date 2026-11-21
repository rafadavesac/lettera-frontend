import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { flattenDraws } from '../../utils/draws';
import { formatDate, formatPrice } from '../../utils/format';
import { getItemSubtitle } from '../../utils/products';
import Button from '../../components/Button';
import DrawnBookRow from '../../components/DrawnBookRow';
import Header from '../../components/Header';
import KitReveal from '../../components/KitReveal';
import OrderItemRow from '../../components/OrderItemRow';

const { colors, fonts, fontSizes, layout, spacing } = theme;

// Pedido confirmado. Parâmetro da rota: { order } (o pedido que o POST /orders
// devolveu, então não precisa de nova chamada). Se o pedido tem kits, começa
// pela revelação dos livros sorteados e só depois mostra o resumo. Sem botão
// de voltar: o pedido já foi feito. Custo: O(i + d + b) para montar a tela.
export default function OrderConfirmedScreen({ navigation, route }) {
  const { order } = route.params;
  const boxes = useMemo(() => flattenDraws(order), [order]);
  const [revealed, setRevealed] = useState(boxes.length === 0);

  if (!revealed) {
    return <KitReveal boxes={boxes} onFinish={() => setRevealed(true)} />;
  }

  // Volta a pilha do Carrinho ao início (vazio) antes de trocar de aba; assim,
  // tocar depois na aba Carrinho não mostra esta tela de novo.
  const goToTab = (tab) => {
    navigation.popToTop();
    navigation.navigate(tab);
  };

  return (
    <View style={styles.screen}>
      <Header title="Pedido confirmado" />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Ionicons name="checkmark-circle" size={72} color={colors.success} />
          <Text style={styles.heroTitle}>Compra realizada!</Text>
          <Text style={styles.heroMeta}>
            {`Pedido #${order.id} · ${formatDate(order.createdAt)}`}
          </Text>
        </View>

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
                  {box.books.map((book) => (
                    <DrawnBookRow
                      key={`${box.key}-${book.id}`}
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
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Ver meus pedidos" onPress={() => goToTab('Orders')} />
        <Button
          title="Continuar comprando"
          variant="secondary"
          onPress={() => goToTab('Home')}
        />
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
  hero: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xl,
  },
  heroTitle: {
    fontFamily: fonts.title,
    fontSize: fontSizes.headline,
    color: colors.text,
  },
  heroMeta: {
    fontFamily: fonts.body,
    fontSize: fontSizes.bodyLarge,
    color: colors.textMuted,
  },
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
  footer: {
    gap: spacing.md,
    paddingHorizontal: layout.screenPadding,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
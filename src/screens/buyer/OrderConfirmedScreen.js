import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { flattenDraws } from '../../utils/draws';
import { formatDate } from '../../utils/format';
import Button from '../../components/Button';
import Header from '../../components/Header';
import KitReveal from '../../components/KitReveal';
import OrderBreakdown from '../../components/OrderBreakdown';

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

        <OrderBreakdown order={order} />
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
  footer: {
    gap: spacing.md,
    paddingHorizontal: layout.screenPadding,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
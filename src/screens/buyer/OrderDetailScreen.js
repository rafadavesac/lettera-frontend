import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { theme } from '../../theme';
import { formatDate } from '../../utils/format';
import Header from '../../components/Header';
import OrderBreakdown from '../../components/OrderBreakdown';

const { colors, fonts, fontSizes, layout, spacing } = theme;

// Detalhe de um pedido do histórico. Parâmetro da rota: { order } (o pedido
// já veio na lista, então não precisa de nova chamada: acesso O(1)).
// Mostra os livros sorteados de cada kit, como na confirmação.
export default function OrderDetailScreen({ navigation, route }) {
  const { order } = route.params;

  return (
    <View style={styles.screen}>
      <Header title={`Pedido #${order.id}`} onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.date}>{`Realizado em ${formatDate(order.createdAt)}`}</Text>
        <OrderBreakdown order={order} />
      </ScrollView>
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
  date: {
    fontFamily: fonts.body,
    fontSize: fontSizes.bodyLarge,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
});
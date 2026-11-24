import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { theme } from '../../theme';
import { useOrder } from '../../hooks/useOrders';
import { formatDate } from '../../utils/format';
import EmptyState from '../../components/EmptyState';
import Header from '../../components/Header';
import OrderBreakdown from '../../components/OrderBreakdown';

const { colors, fonts, fontSizes, layout, spacing } = theme;

// Detalhe de um pedido do histórico. Parâmetro da rota: { orderId }. Busca o
// pedido completo (GET /orders/{id}), com os livros sorteados de cada kit.
// Estados: carregando, erro (com "tentar novamente") e pedido.
export default function OrderDetailScreen({ navigation, route }) {
  const { orderId } = route.params;
  const { data: order, loading, error, reload } = useOrder(orderId);

  const renderBody = () => {
    if (loading && !order) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }

    if (error || !order) {
      return (
        <EmptyState
          icon="cloud-offline-outline"
          title="Não foi possível carregar"
          message={error ?? 'Pedido não encontrado.'}
          actionLabel="Tentar novamente"
          onAction={reload}
        />
      );
    }

    return (
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.date}>{`Realizado em ${formatDate(order.createdAt)}`}</Text>
        <OrderBreakdown order={order} />
      </ScrollView>
    );
  };

  return (
    <View style={styles.screen}>
      <Header title={`Pedido #${orderId}`} onBack={() => navigation.goBack()} />
      {renderBody()}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
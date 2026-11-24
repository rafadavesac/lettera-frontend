import React, { useCallback, useRef } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { theme } from '../../theme';
import { useSales } from '../../hooks/useSales';
import { formatPrice } from '../../utils/format';
import EmptyState from '../../components/EmptyState';
import Header from '../../components/Header';
import SaleRow from '../../components/SaleRow';

const { colors, fonts, fontSizes, layout, radius, shadows, spacing } = theme;

const Separator = () => <View style={styles.separator} />;

const formatSaleCount = (count) => `${count} ${count === 1 ? 'venda' : 'vendas'}`;

// Histórico de vendas do vendedor (GET /ws/orders/sales): total no topo e,
// abaixo, uma linha por item vendido, da mais recente à mais antiga.
// Recarrega ao voltar à aba (foco) e ao puxar a lista.
// Custo: a FlatList desenha só os itens visíveis, O(v) por tela.
export default function SalesScreen() {
  const { data, loading, error, reload } = useSales();
  const sales = data?.items ?? [];

  // Pula o primeiro foco: a primeira busca já acontece ao abrir a tela.
  const isFirstFocus = useRef(true);
  useFocusEffect(
    useCallback(() => {
      if (isFirstFocus.current) {
        isFirstFocus.current = false;
        return;
      }
      reload();
    }, [reload])
  );

  const renderSale = ({ item }) => (
    <SaleRow title={item.title} date={item.date} quantity={item.quantity} total={item.total} />
  );

  const renderSummary = () => (
    <View style={styles.summary}>
      <Text style={styles.summaryLabel}>Total vendido</Text>
      <Text style={styles.summaryValue}>{formatPrice(data.totalRevenue)}</Text>
      <Text style={styles.summaryCount}>{formatSaleCount(sales.length)}</Text>
    </View>
  );

  const renderBody = () => {
    // Spinner de tela cheia só na primeira carga; depois a lista fica visível.
    if (loading && !data) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }

    if (error) {
      return (
        <EmptyState
          icon="cloud-offline-outline"
          title="Não foi possível carregar"
          message={error}
          actionLabel="Tentar novamente"
          onAction={reload}
        />
      );
    }

    if (!sales.length) {
      return (
        <EmptyState
          icon="cash-outline"
          title="Nenhuma venda ainda"
          message="Quando alguém comprar um dos seus produtos, a venda aparece aqui."
        />
      );
    }

    return (
      <FlatList
        data={sales}
        renderItem={renderSale}
        keyExtractor={(item, index) => `${item.orderId}-${index}`} // um pedido pode ter vários itens
        ItemSeparatorComponent={Separator}
        ListHeaderComponent={renderSummary}
        refreshing={loading}
        onRefresh={reload}
        contentContainerStyle={styles.list}
      />
    );
  };

  return (
    <View style={styles.screen}>
      <Header title="Vendas" />
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
  list: {
    paddingHorizontal: layout.screenPadding,
    paddingVertical: spacing.md,
  },
  separator: {
    height: spacing.md,
  },
  summary: {
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.lg,
    padding: spacing.xl,
    borderRadius: radius.card,
    backgroundColor: colors.surface,
    ...shadows.soft,
  },
  summaryLabel: {
    fontFamily: fonts.body,
    fontSize: fontSizes.body,
    color: colors.textMuted,
  },
  summaryValue: {
    fontFamily: fonts.title,
    fontSize: fontSizes.headline,
    color: colors.primary,
  },
  summaryCount: {
    fontFamily: fonts.body,
    fontSize: fontSizes.body,
    color: colors.textMuted,
  },
});
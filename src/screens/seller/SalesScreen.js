import React, { useCallback, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { theme } from '../../theme';
import { useSales } from '../../hooks/useSales';
import { formatPrice } from '../../utils/format';
import { formatPeriod, lastPeriods, toPeriod } from '../../utils/period';
import CategoryChip from '../../components/CategoryChip';
import EmptyState from '../../components/EmptyState';
import Header from '../../components/Header';
import SaleRow from '../../components/SaleRow';

const { colors, fonts, fontSizes, layout, radius, shadows, spacing } = theme;

const PERIOD_COUNT = 12; // meses disponíveis no seletor

const Separator = () => <View style={styles.separator} />;

const formatSaleCount = (count) => `${count} ${count === 1 ? 'venda' : 'vendas'}`;

// Histórico de vendas do vendedor (GET /ws/orders/sales?period=AAAA-MM): seletor
// de mês no topo, total vendido e, abaixo, uma linha por item vendido, da mais
// recente à mais antiga. Recarrega ao voltar à aba (foco) e ao puxar a lista.
// Custo: a FlatList desenha só os itens visíveis, O(v) por tela.
export default function SalesScreen() {
  const periods = useMemo(() => lastPeriods(PERIOD_COUNT), []);
  const [period, setPeriod] = useState(() => toPeriod(new Date()));
  const { data, loading, error, reload } = useSales(period);
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
      <Text style={styles.summaryLabel}>{`Total vendido em ${formatPeriod(period)}`}</Text>
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
          title="Nenhuma venda neste mês"
          message={`Não há vendas em ${formatPeriod(period)}. Escolha outro mês acima.`}
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

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipsScroll}
        contentContainerStyle={styles.chips}
      >
        {periods.map((value) => (
          <CategoryChip
            key={value}
            label={formatPeriod(value)}
            selected={value === period}
            onPress={() => setPeriod(value)}
          />
        ))}
      </ScrollView>

      {renderBody()}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  chipsScroll: {
    flexGrow: 0, // sem isso, a lista horizontal ocuparia a altura da tela
  },
  chips: {
    paddingHorizontal: layout.screenPadding,
    paddingVertical: spacing.md,
    gap: spacing.sm,
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
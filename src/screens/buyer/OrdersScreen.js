import React, { useCallback, useRef } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { theme } from '../../theme';
import { useMyOrders } from '../../hooks/useOrders';
import { ROUTES } from '../../navigation/routes';
import EmptyState from '../../components/EmptyState';
import Header from '../../components/Header';
import OrderCard from '../../components/OrderCard';

const { colors, layout, spacing } = theme;

const Separator = () => <View style={styles.separator} />;

// Histórico de compras do comprador (GET /orders/me), do mais recente ao mais
// antigo. Recarrega sempre que a aba volta ao foco, para mostrar um pedido
// recém-feito sem o usuário precisar puxar a lista.
// Custo: a FlatList desenha só os itens visíveis, O(v) por tela.
export default function OrdersScreen({ navigation }) {
  const { data, loading, error, reload } = useMyOrders();
  const orders = data?.items ?? [];

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

  const renderOrder = ({ item }) => (
    <OrderCard
      orderId={item.id}
      date={item.createdAt}
      itemCount={item.itemCount}
      total={item.total}
      onPress={() => navigation.navigate(ROUTES.ORDER_DETAIL, { order: item })}
    />
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

    if (!orders.length) {
      return (
        <EmptyState
          icon="receipt-outline"
          title="Nenhum pedido ainda"
          message="Quando você comprar, seus pedidos aparecem aqui."
          actionLabel="Ver kits surpresa"
          onAction={() => navigation.navigate('Kits')}
        />
      );
    }

    return (
      <FlatList
        data={orders}
        renderItem={renderOrder}
        keyExtractor={(item) => String(item.id)}
        ItemSeparatorComponent={Separator}
        refreshing={loading}
        onRefresh={reload}
        contentContainerStyle={styles.list}
      />
    );
  };

  return (
    <View style={styles.screen}>
      <Header title="Meus pedidos" />
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
});
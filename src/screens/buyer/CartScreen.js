import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { theme } from '../../theme';
import { useCart } from '../../hooks/useCart';
import { MAX_QUANTITY_PER_ITEM } from '../../context/cartReducer';
import { formatBookCount, formatPrice } from '../../utils/format';
import CartItemRow from '../../components/CartItemRow';
import EmptyState from '../../components/EmptyState';
import Header from '../../components/Header';

const { colors, fonts, fontSizes, layout, spacing } = theme;

const Separator = () => <View style={styles.separator} />;

// Aba Carrinho: lista os itens com quantidade e remoção, e mostra o total.
// Custo: a FlatList desenha só os itens visíveis, O(v) por tela; o total já
// vem calculado do contexto (O(n) só quando o carrinho muda).
export default function CartScreen({ navigation }) {
  const { items, total, itemCount, setQuantity, removeItem } = useCart();

  const renderItem = ({ item }) => (
    <CartItemRow
      title={item.title}
      subtitle={item.isKit ? formatBookCount(item.bookCount) : item.author}
      price={item.price}
      quantity={item.quantity}
      imageUri={item.imageUri}
      isKit={item.isKit}
      maxQuantity={MAX_QUANTITY_PER_ITEM}
      onChangeQuantity={(quantity) => setQuantity(item.productId, quantity)}
      onRemove={() => removeItem(item.productId)}
    />
  );

  return (
    <View style={styles.screen}>
      <Header title="Carrinho" />

      {items.length === 0 ? (
        <EmptyState
          icon="cart-outline"
          title="Seu carrinho está vazio"
          message="Escolha um livro ou um kit surpresa para começar."
          actionLabel="Ver kits surpresa"
          onAction={() => navigation.navigate('Kits')}
        />
      ) : (
        <>
          <FlatList
            data={items}
            renderItem={renderItem}
            keyExtractor={(item) => String(item.productId)}
            ItemSeparatorComponent={Separator}
            contentContainerStyle={styles.list}
          />

          <View style={styles.footer}>
            <Text style={styles.totalLabel}>
              {`Total (${itemCount} ${itemCount === 1 ? 'item' : 'itens'})`}
            </Text>
            <Text style={styles.total}>{formatPrice(total)}</Text>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    paddingHorizontal: layout.screenPadding,
    paddingVertical: spacing.md,
  },
  separator: {
    height: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenPadding,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalLabel: {
    fontFamily: fonts.body,
    fontSize: fontSizes.body,
    color: colors.textMuted,
  },
  total: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSizes.title,
    color: colors.primary,
  },
});
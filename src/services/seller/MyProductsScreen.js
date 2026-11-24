import React, { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { theme } from '../../theme';
import { useProducts } from '../../hooks/useProducts';
import { useDeleteProduct } from '../../hooks/useSellerProducts';
import { ROUTES } from '../../navigation/routes';
import { getItemSubtitle } from '../../utils/products';
import ConfirmDialog from '../../components/ConfirmDialog';
import EmptyState from '../../components/EmptyState';
import ErrorBanner from '../../components/ErrorBanner';
import Header from '../../components/Header';
import SearchBar from '../../components/SearchBar';
import SellerProductRow from '../../components/SellerProductRow';

const { colors, layout, spacing } = theme;

const Separator = () => <View style={styles.separator} />;

// Meus produtos do vendedor: o mesmo GET /products do comprador, com busca,
// botão "+" para cadastrar, toque para editar e lixeira com confirmação.
// Recarrega ao voltar do formulário (foco), para mostrar o que mudou.
// Custo: a FlatList desenha só os itens visíveis, O(v) por tela.
export default function MyProductsScreen({ navigation }) {
  const [searchText, setSearchText] = useState(''); // o que está digitado
  const [appliedSearch, setAppliedSearch] = useState(''); // o que foi confirmado
  const [pendingDelete, setPendingDelete] = useState(null); // produto aguardando confirmação

  const { data, loading, error, reload } = useProducts({ search: appliedSearch });
  const { remove, deleting, error: deleteError, clearError } = useDeleteProduct();
  const products = data?.items ?? [];

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

  const handleChangeText = (text) => {
    setSearchText(text);
    if (!text) setAppliedSearch(''); // apagar o texto remove o filtro
  };
  const handleSubmit = () => setAppliedSearch(searchText.trim());
  const clearSearch = () => {
    setSearchText('');
    setAppliedSearch('');
  };

  const goToForm = (productId) => navigation.navigate(ROUTES.PRODUCT_FORM, { productId });

  const askDelete = (product) => {
    clearError();
    setPendingDelete(product);
  };
  const confirmDelete = async () => {
    const { ok } = await remove(pendingDelete.id);
    setPendingDelete(null);
    if (ok) reload(); // em caso de erro, a faixa vermelha mostra a mensagem
  };

  const renderProduct = ({ item }) => (
    <SellerProductRow
      title={item.title}
      subtitle={getItemSubtitle(item)}
      price={item.price}
      imageUri={item.imageUri}
      isKit={item.isKit}
      onPress={() => goToForm(item.id)}
      onDelete={() => askDelete(item)}
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

    if (!products.length) {
      return appliedSearch ? (
        <EmptyState
          icon="search-outline"
          title="Nada encontrado"
          message="Tente outro título ou autor."
          actionLabel="Limpar busca"
          onAction={clearSearch}
        />
      ) : (
        <EmptyState
          icon="library-outline"
          title="Nenhum produto ainda"
          message="Cadastre seu primeiro livro ou kit."
          actionLabel="Cadastrar produto"
          onAction={() => goToForm(undefined)}
        />
      );
    }

    return (
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => String(item.id)}
        ItemSeparatorComponent={Separator}
        refreshing={loading}
        onRefresh={reload}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
      />
    );
  };

  return (
    <View style={styles.screen}>
      <Header
        title="Meus produtos"
        right={
          <Pressable
            onPress={() => goToForm(undefined)}
            accessibilityRole="button"
            accessibilityLabel="Cadastrar produto"
            hitSlop={12}
          >
            <Ionicons name="add-circle" size={30} color={colors.primary} />
          </Pressable>
        }
      />

      <View style={styles.search}>
        <SearchBar
          value={searchText}
          onChangeText={handleChangeText}
          onSubmitEditing={handleSubmit}
        />
      </View>

      <ErrorBanner message={deleteError} style={styles.banner} />

      {renderBody()}

      <ConfirmDialog
        visible={pendingDelete !== null}
        title="Excluir produto?"
        message={pendingDelete ? `"${pendingDelete.title}" será removido do catálogo.` : ''}
        confirmLabel="Excluir"
        destructive
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  search: {
    paddingHorizontal: layout.screenPadding,
    paddingBottom: spacing.md,
  },
  banner: {
    marginHorizontal: layout.screenPadding,
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
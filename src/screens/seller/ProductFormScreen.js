import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { theme } from '../../theme';
import { useCategories, useProduct } from '../../hooks/useProducts';
import { useSaveProduct } from '../../hooks/useSellerProducts';
import { PRODUCT_TYPES } from '../../services/products/productMapper';
import {
  EMPTY_FORM,
  MAX_KIT_BOOKS,
  MAX_LENGTH,
  toFormValues,
  validateProductForm,
} from '../../utils/productForm';
import Button from '../../components/Button';
import CategoryChip from '../../components/CategoryChip';
import EmptyState from '../../components/EmptyState';
import ErrorBanner from '../../components/ErrorBanner';
import Header from '../../components/Header';
import QuantityStepper from '../../components/QuantityStepper';
import SegmentedControl from '../../components/SegmentedControl';
import TextField from '../../components/TextField';

const { colors, fonts, fontSizes, layout, spacing } = theme;

const TYPE_OPTIONS = [
  { value: PRODUCT_TYPES.BOOK, label: 'Livro' },
  { value: PRODUCT_TYPES.KIT, label: 'Kit' },
];

// Formulário de produto do vendedor. Parâmetros da rota: { productId? }.
// Sem productId = novo produto (POST); com productId = editar (PUT), e então
// a tela carrega o produto antes de mostrar os campos.
export default function ProductFormScreen({ navigation, route }) {
  const productId = route.params?.productId ?? null;
  const goBack = () => navigation.goBack();

  if (productId) {
    return <EditProduct productId={productId} onBack={goBack} />;
  }

  return (
    <ProductForm
      key="new"
      title="Novo produto"
      productId={null}
      initialValues={EMPTY_FORM}
      onBack={goBack}
      onDone={goBack}
    />
  );
}

// Busca o produto (mesmo GET /products/{id} do comprador) e só então monta o
// formulário, já preenchido. Tem estados de carregamento e de erro.
function EditProduct({ productId, onBack }) {
  const { data, loading, error, reload } = useProduct(productId);

  if (loading || error || !data) {
    return (
      <View style={styles.screen}>
        <Header title="Editar produto" onBack={onBack} />
        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <EmptyState
            icon="cloud-offline-outline"
            title="Não foi possível carregar"
            message={error ?? 'Produto não encontrado.'}
            actionLabel="Tentar novamente"
            onAction={reload}
          />
        )}
      </View>
    );
  }

  return (
    <ProductForm
      key={data.id}
      title="Editar produto"
      productId={productId}
      initialValues={toFormValues(data)}
      onBack={onBack}
      onDone={onBack}
    />
  );
}

// Custo: O(1) por campo; a validação roda uma vez ao salvar.
function ProductForm({ title, productId, initialValues, onBack, onDone }) {
  const categories = useCategories();
  const { save, saving, error: saveError, clearError } = useSaveProduct();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({}); // { campo: mensagem }
  const [savedId, setSavedId] = useState(productId); // vira o id do produto criado, para não duplicar ao tentar de novo

  const isKit = values.type === PRODUCT_TYPES.KIT;

  // Atualiza um campo e limpa o erro dele (e a faixa de erro do envio).
  const setField = (field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
    clearError();
  };

  const handleSubmit = async () => {
    const found = validateProductForm(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return; // erros por campo já aparecem na tela

    const { ok, data } = await save(savedId, values);
    if (!ok) return; // a mensagem fica na faixa de erro
    setSavedId(data.id);
    onDone();
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Header title={title} onBack={onBack} />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <ErrorBanner message={saveError} />

        <SegmentedControl
          options={TYPE_OPTIONS}
          value={values.type}
          onChange={(type) => setField('type', type)}
        />

        <TextField
          label="Título"
          value={values.title}
          onChangeText={(text) => setField('title', text)}
          error={errors.title}
          maxLength={MAX_LENGTH.title}
          autoCapitalize="sentences"
        />

        {isKit ? null : (
          <TextField
            label="Autor"
            value={values.author}
            onChangeText={(text) => setField('author', text)}
            error={errors.author}
            maxLength={MAX_LENGTH.author}
            autoCapitalize="words"
          />
        )}

        <TextField
          label="Descrição"
          value={values.description}
          onChangeText={(text) => setField('description', text)}
          error={errors.description}
          maxLength={MAX_LENGTH.description}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          style={styles.description}
        />

        <View style={styles.group}>
          <Text style={styles.label}>Categoria</Text>
          <View style={styles.chips}>
            {(categories.data ?? []).map((name) => (
              <CategoryChip
                key={name}
                label={name}
                selected={values.category === name}
                onPress={() => setField('category', name)}
              />
            ))}
          </View>
          {errors.category ? <Text style={styles.error}>{errors.category}</Text> : null}
        </View>

        <TextField
          label="Preço (R$)"
          value={values.price}
          onChangeText={(text) => setField('price', text)}
          error={errors.price}
          placeholder="29,90"
          keyboardType="decimal-pad"
        />

        {isKit ? (
          <View style={styles.group}>
            <Text style={styles.label}>Livros no kit</Text>
            <QuantityStepper
              value={values.bookCount}
              onChange={(count) => setField('bookCount', count)}
              min={1}
              max={MAX_KIT_BOOKS}
            />
            {errors.bookCount ? <Text style={styles.error}>{errors.bookCount}</Text> : null}
          </View>
        ) : null}

        <Button
          title={productId ? 'Salvar alterações' : 'Salvar produto'}
          onPress={handleSubmit}
          loading={saving}
          style={styles.submit}
        />
      </ScrollView>
    </KeyboardAvoidingView>
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
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  description: {
    minHeight: 120,
  },
  group: {
    gap: spacing.xs,
  },
  label: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.body,
    color: colors.text,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  error: {
    fontFamily: fonts.body,
    fontSize: fontSizes.caption,
    color: colors.error,
  },
  submit: {
    marginTop: spacing.sm,
  },
});
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
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { useCategories, useProduct } from '../../hooks/useProducts';
import { useSaveProduct, useUploadProductImage } from '../../hooks/useSellerProducts';
import { PRODUCT_TYPES } from '../../services/products/productMapper';
import { pickProductImage } from '../../utils/imagePicker';
import {
  EMPTY_FORM,
  KIT_BOOK_COUNT,
  MAX_LENGTH,
  toFormValues,
  validateProductForm,
} from '../../utils/productForm';
import Button from '../../components/Button';
import CategoryChip from '../../components/CategoryChip';
import EmptyState from '../../components/EmptyState';
import ErrorBanner from '../../components/ErrorBanner';
import Header from '../../components/Header';
import ImageUploadBox from '../../components/ImageUploadBox';
import SegmentedControl from '../../components/SegmentedControl';
import TextField from '../../components/TextField';

const { colors, fonts, fontSizes, layout, radius, spacing } = theme;

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
      imageUri={data.imageUri}
      onBack={onBack}
      onDone={onBack}
    />
  );
}

// Monta o que vai para a API. O back-end define sozinho o título do kit
// ("Kit <categoria>") e fixa 3 livros, então o app já envia esses valores e a
// tela não precisa pedi-los ao vendedor. Custo: O(1).
function buildPayload(values) {
  if (values.type !== PRODUCT_TYPES.KIT) return values;
  return {
    ...values,
    title: `Kit ${values.category}`,
    author: '',
    bookCount: KIT_BOOK_COUNT,
  };
}

// Custo: O(1) por campo; a validação roda uma vez ao salvar.
function ProductForm({ title, productId, initialValues, imageUri, onBack, onDone }) {
  const categories = useCategories();
  const { save, saving, error: saveError, clearError } = useSaveProduct();
  const { upload, uploading, error: uploadError, clearError: clearUploadError } = useUploadProductImage();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({}); // { campo: mensagem }
  const [savedId, setSavedId] = useState(productId); // vira o id do produto criado, para não duplicar ao tentar de novo
  const [imageFile, setImageFile] = useState(null); // foto escolhida, ainda não enviada
  const [imageError, setImageError] = useState(null);

  const isKit = values.type === PRODUCT_TYPES.KIT;

  // Atualiza um campo e limpa o erro dele (e a faixa de erro do envio).
  const setField = (field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
    clearError();
  };

  // Trocar livro/kit muda quais campos existem: limpa os erros antigos.
  const handleChangeType = (type) => {
    setField('type', type);
    setErrors({});
  };

  const handlePickImage = async () => {
    setImageError(null);
    clearUploadError();
    const picked = await pickProductImage();
    if (!picked) return; // cancelou
    if (picked.error) {
      setImageError(picked.error);
      return;
    }
    setImageFile(picked.file);
  };

  const handleSubmit = async () => {
    const found = validateProductForm(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return; // erros por campo já aparecem na tela

    const { ok, data } = await save(savedId, buildPayload(values));
    if (!ok) return; // a mensagem fica na faixa de erro
    setSavedId(data.id);

    // A imagem precisa do id do produto: primeiro salva, depois envia. Se o
    // envio falhar, o produto já existe (savedId): tentar de novo só edita
    // e reenvia a imagem, sem criar duplicado.
    if (imageFile) {
      const uploaded = await upload(data.id, imageFile);
      if (!uploaded.ok) return;
    }
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
        <ErrorBanner
          message={uploadError ? `O produto foi salvo, mas a imagem não foi enviada. ${uploadError}` : null}
        />

        <SegmentedControl
          options={TYPE_OPTIONS}
          value={values.type}
          onChange={handleChangeType}
        />

        <ImageUploadBox
          uri={imageFile?.uri ?? imageUri}
          onPress={handlePickImage}
          error={imageError}
        />

        {isKit ? (
          <View style={styles.callout}>
            <Ionicons name="gift-outline" size={22} color={colors.primaryDark} />
            <Text style={styles.calloutText}>
              {`O título do kit é gerado pela categoria, e cada kit leva ${KIT_BOOK_COUNT} livros sorteados na compra.`}
            </Text>
          </View>
        ) : (
          <>
            <TextField
              label="Título"
              value={values.title}
              onChangeText={(text) => setField('title', text)}
              error={errors.title}
              maxLength={MAX_LENGTH.title}
              autoCapitalize="sentences"
            />

            <TextField
              label="Autor"
              value={values.author}
              onChangeText={(text) => setField('author', text)}
              error={errors.author}
              maxLength={MAX_LENGTH.author}
              autoCapitalize="words"
            />
          </>
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

        <Button
          title={productId ? 'Salvar alterações' : 'Salvar produto'}
          onPress={handleSubmit}
          loading={saving || uploading}
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
  callout: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.card,
    backgroundColor: colors.accentGoldLight,
  },
  calloutText: {
    flex: 1,
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.body,
    color: colors.primaryDark,
    lineHeight: 20,
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
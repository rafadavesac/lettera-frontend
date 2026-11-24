import { useAsyncAction } from './useAsyncAction';
import { sellerProductService } from '../services/seller';

// Criar (sem id) ou editar (com id), conforme o formulário.
// Função de módulo para ter identidade estável no useAsyncAction.
const saveProduct = (productId, values) =>
  productId
    ? sellerProductService.update(productId, values)
    : sellerProductService.create(values);

// Salvar produto: `save(productId | null, values)` -> { ok, data: produto }.
export function useSaveProduct() {
  const { run, loading, error, clearError } = useAsyncAction(saveProduct);
  return { save: run, saving: loading, error, clearError };
}

// Excluir produto: `remove(id)` -> { ok }.
export function useDeleteProduct() {
  const { run, loading, error, clearError } = useAsyncAction(sellerProductService.remove);
  return { remove: run, deleting: loading, error, clearError };
}

// Enviar a imagem: `upload(id, file)` -> { ok, data: produto atualizado }.
export function useUploadProductImage() {
  const { run, loading, error, clearError } = useAsyncAction(sellerProductService.uploadImage);
  return { upload: run, uploading: loading, error, clearError };
}
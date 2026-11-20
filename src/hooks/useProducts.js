import { useAsyncData } from './useAsyncData';
import { productService, categoryService } from '../services/products';

// Lista de produtos com filtros. data = { items, total }.
export function useProducts({ category, type, search } = {}) {
  return useAsyncData(
    () => productService.list({ category, type, search }),
    [category, type, search]
  );
}

// Um produto por id. data = produto.
export function useProduct(id) {
  return useAsyncData(() => productService.getById(id), [id]);
}

// Categorias. data = lista de textos.
export function useCategories() {
  return useAsyncData(() => categoryService.list(), []);
}
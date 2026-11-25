import { mockCatalogStore } from './mockCatalogStore';

// Fonte de exemplo: deriva as categorias dos produtos do store, então uma
// categoria usada por um produto criado no mock também aparece aqui.
// Custo: O(n + c log c), com n produtos e c categorias.
export const mockCategorySource = {
  async list() {
    const names = new Set(mockCatalogStore.all().map((product) => product.category));
    return [...names].sort((a, b) => a.localeCompare(b, 'pt-BR'));
  },
};
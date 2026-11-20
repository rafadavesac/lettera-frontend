import { toProduct } from './productMapper';

// Uma página de até 50 itens; sem rolagem infinita por enquanto.
export const DEFAULT_PAGE_SIZE = 50;

// Cria o serviço de produtos a partir de uma "fonte" (mock ou API).
// Depende da abstração (qualquer objeto com list e getById), não de uma
// implementação concreta (inversão de dependência), e só cuida de mapear.
export function createProductService(source) {
  return {
    // Custo: O(k), com k itens da página (mapeamento item a item).
    async list({ category, type, search } = {}) {
      const page = await source.list({ category, type, search, page: 0, size: DEFAULT_PAGE_SIZE });
      return { items: page.content.map(toProduct), total: page.totalElements };
    },

    async getById(id) {
      return toProduct(await source.getById(id));
    },
  };
}
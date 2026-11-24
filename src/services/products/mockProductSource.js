import { normalizeText } from '../../utils/text';
import { mockCatalogStore } from './mockCatalogStore';

// Fonte de dados de exemplo (leitura), no mesmo formato do contrato da API.
// Os dados vêm do store compartilhado com o mock do vendedor.
// Permite desenvolver as telas sem o backend de produtos.
const FAKE_LATENCY_MS = 400; // simula a rede, para ver os estados de carregamento

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockProductSource = {
  // Filtra e pagina como o backend fará. Custo: O(n * m), com n produtos e
  // m o tamanho do título + autor (busca por texto); sem busca, O(n).
  async list({ category, type, search, page = 0, size = 50 } = {}) {
    await delay(FAKE_LATENCY_MS);
    const term = normalizeText(search);

    const filtered = mockCatalogStore
      .all()
      .filter(
        (p) =>
          (!category || p.category === category) &&
          (!type || p.type === type) &&
          (!term || normalizeText(`${p.title} ${p.author ?? ''}`).includes(term))
      );

    const start = page * size;
    return {
      content: filtered.slice(start, start + size),
      totalElements: filtered.length,
      totalPages: Math.ceil(filtered.length / size),
      number: page,
    };
  },

  // Custo: O(n) (busca linear); na API real é uma consulta por chave primária.
  async getById(id) {
    await delay(FAKE_LATENCY_MS);
    const found = mockCatalogStore.find(id);
    if (!found) {
      // Mesmo formato de erro que o cliente HTTP devolve.
      throw { status: 404, isNetworkError: false, message: 'Produto não encontrado.' };
    }
    return found;
  },
};
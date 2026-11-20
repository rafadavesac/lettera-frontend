import api from '../api';

// Remove parâmetros vazios para não mandar "?category=&search=" ao backend.
// Custo: O(p), com p parâmetros (no máximo 5).
function cleanParams(params) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== '')
  );
}

// Fonte real: chama o gateway, seguindo o contrato do catálogo.
// Erros já chegam padronizados pelo interceptor do cliente HTTP.
export const apiProductSource = {
  async list(params = {}) {
    const { data } = await api.get('/products', { params: cleanParams(params) });
    return data;
  },

  async getById(id) {
    const { data } = await api.get(`/products/${id}`);
    return data;
  },
};
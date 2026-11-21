import api from '../api';

// Fonte real: chama o gateway, seguindo o contrato de pedidos.
// Erros (inclusive 401 e 403) chegam padronizados pelo interceptor do cliente HTTP.
export const apiOrderSource = {
  async create(request) {
    const { data } = await api.post('/orders', request);
    return data;
  },

  async listMine(params = {}) {
    const { data } = await api.get('/orders/me', { params });
    return data;
  },
};

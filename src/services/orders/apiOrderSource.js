import api from '../api';

// Fonte real: chama o gateway, seguindo o contrato oficial de pedidos.
// Erros (inclusive 401, 403 e 404) chegam padronizados pelo interceptor.
export const apiOrderSource = {
  async create(request) {
    const { data } = await api.post('/orders', request);
    return data;
  },

  async listMine() {
    const { data } = await api.get('/orders/me');
    return data;
  },

  async getById(id) {
    const { data } = await api.get(`/orders/${id}`);
    return data;
  },
};
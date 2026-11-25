import api from '../api';

// Fonte real do histórico de vendas do vendedor (exige JWT de vendedor).
// `period` no formato AAAA-MM; sem ele, o back usa o mês atual.
export const apiSalesSource = {
  async list({ period } = {}) {
    const { data } = await api.get('/ws/orders/sales', { params: { period } });
    return data;
  },
};
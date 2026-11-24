import api from '../api';

// Fonte real do histórico de vendas do vendedor (exige JWT de vendedor).
export const apiSalesSource = {
  async list() {
    const { data } = await api.get('/ws/orders/sales');
    return data;
  },
};
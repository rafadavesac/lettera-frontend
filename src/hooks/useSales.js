import { useAsyncData } from './useAsyncData';
import { salesService } from '../services/seller';

// Histórico de vendas do vendedor logado no período (AAAA-MM).
// data = { totalRevenue, items }.
export function useSales(period) {
  return useAsyncData(() => salesService.list({ period }), [period]);
}
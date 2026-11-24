import { useAsyncData } from './useAsyncData';
import { salesService } from '../services/seller';

// Histórico de vendas do vendedor logado. data = { totalRevenue, items }.
export function useSales() {
  return useAsyncData(() => salesService.list(), []);
}
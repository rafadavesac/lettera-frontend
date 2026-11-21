import { useCallback, useState } from 'react';
import { useAsyncData } from './useAsyncData';
import { orderService } from '../services/orders';

const DEFAULT_ERROR = 'Algo deu errado. Tente novamente.';

// Histórico de compras do comprador logado. data = { items, total }.
export function useMyOrders() {
  return useAsyncData(() => orderService.listMine(), []);
}

// Finalizar o pedido (ação, não leitura): `submit(items)` devolve o pedido
// criado, ou null se falhou (a mensagem fica em `error`).
export function useCreateOrder() {
  const [state, setState] = useState({ submitting: false, error: null });

  const submit = useCallback(async (items) => {
    setState({ submitting: true, error: null });
    try {
      const order = await orderService.create(items);
      setState({ submitting: false, error: null });
      return order;
    } catch (err) {
      setState({ submitting: false, error: err?.message ?? DEFAULT_ERROR });
      return null;
    }
  }, []);

  const clearError = useCallback(() => setState((prev) => ({ ...prev, error: null })), []);

  return { submit, clearError, ...state };
}
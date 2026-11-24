import { useCallback, useState } from 'react';

const DEFAULT_ERROR = 'Algo deu errado. Tente novamente.';

// Hook genérico para AÇÕES (escrever, excluir, enviar), o par do useAsyncData,
// que cuida de leituras. `run(...args)` chama a ação e devolve { ok, data }:
// ok = false se falhou (a mensagem fica em `error`). `action` deve ser uma
// função estável (por exemplo, um método de serviço). Custo: O(1) de overhead.
export function useAsyncAction(action) {
  const [state, setState] = useState({ loading: false, error: null });

  const run = useCallback(
    async (...args) => {
      setState({ loading: true, error: null });
      try {
        const data = await action(...args);
        setState({ loading: false, error: null });
        return { ok: true, data };
      } catch (err) {
        setState({ loading: false, error: err?.message ?? DEFAULT_ERROR });
        return { ok: false, data: null };
      }
    },
    [action]
  );

  const clearError = useCallback(() => setState((prev) => ({ ...prev, error: null })), []);

  return { run, clearError, ...state };
}
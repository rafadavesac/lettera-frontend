import { useCallback, useEffect, useState } from 'react';

// Hook genérico para buscar dados: devolve { data, loading, error, reload }.
// Ignora respostas de uma busca antiga (a tela mudou de filtro ou saiu) com a
// flag "cancelled". Custo: O(1) de overhead por busca.
export function useAsyncData(fetcher, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    // Marcar "carregando" ao trocar filtro ou recarregar é o objetivo deste effect:
    // os dados antigos continuam na tela enquanto a nova busca roda.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState((prev) => ({ ...prev, loading: true, error: null }));

    fetcher()
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null });
      })
      .catch((err) => {
        if (!cancelled) {
          setState({
            data: null,
            loading: false,
            error: err?.message ?? 'Algo deu errado. Tente novamente.',
          });
        }
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, reloadKey]);

  const reload = useCallback(() => setReloadKey((key) => key + 1), []);

  return { ...state, reload };
}
import { useCallback, useEffect, useRef, useState } from 'react';

// Flag que liga por um instante e desliga sozinha (ex.: botão "Adicionado!").
// Devolve [ativa, disparar]. Limpa o temporizador ao sair da tela.
// Custo: O(1).
export function useTransientFlag(durationMs = 1500) {
  const [active, setActive] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const trigger = useCallback(() => {
    clearTimeout(timer.current);
    setActive(true);
    timer.current = setTimeout(() => setActive(false), durationMs);
  }, [durationMs]);

  return [active, trigger];
}
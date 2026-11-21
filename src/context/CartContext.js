import React, { createContext, useCallback, useEffect, useMemo, useReducer } from 'react';
import { useAuth } from '../hooks/useAuth';
import {
  CART_ACTIONS,
  MAX_QUANTITY_PER_ITEM,
  calculateTotals,
  cartReducer,
} from './cartReducer';

export const CartContext = createContext(null);

// Carrinho do comprador. Vive só no app (estado do React): o backend recebe os
// itens apenas no checkout. Fica dentro do AuthProvider para saber quem é o usuário.
export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, dispatch] = useReducer(cartReducer, []);

  // O carrinho é de quem está logado: ao sair ou trocar de usuário, esvazia.
  useEffect(() => {
    dispatch({ type: CART_ACTIONS.CLEAR });
  }, [user?.id]);

  // Devolve false quando o item já está no limite (a tela avisa o usuário).
  const addItem = useCallback(
    (product) => {
      const current = items.find((item) => item.productId === product.id);
      if (current && current.quantity >= MAX_QUANTITY_PER_ITEM) return false;
      dispatch({ type: CART_ACTIONS.ADD, product });
      return true;
    },
    [items]
  );

  const setQuantity = useCallback(
    (productId, quantity) => dispatch({ type: CART_ACTIONS.SET_QUANTITY, productId, quantity }),
    []
  );
  const removeItem = useCallback(
    (productId) => dispatch({ type: CART_ACTIONS.REMOVE, productId }),
    []
  );
  const clear = useCallback(() => dispatch({ type: CART_ACTIONS.CLEAR }), []);

  // Os totais só são recalculados quando os itens mudam: O(n) por mudança.
  const value = useMemo(
    () => ({
      items,
      ...calculateTotals(items),
      addItem,
      setQuantity,
      removeItem,
      clear,
    }),
    [items, addItem, setQuantity, removeItem, clear]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
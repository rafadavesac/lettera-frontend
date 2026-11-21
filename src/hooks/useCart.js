import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

// Acesso ao carrinho: { items, total, itemCount, addItem, setQuantity, removeItem, clear }.
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart deve ser usado dentro de um CartProvider.');
  }
  return context;
}
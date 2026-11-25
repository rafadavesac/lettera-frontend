import { describe, expect, it } from '@jest/globals';
import {
  CART_ACTIONS,
  MAX_QUANTITY_PER_ITEM,
  calculateTotals,
  cartReducer,
} from '../cartReducer';

const book = {
  id: 1,
  type: 'BOOK',
  isKit: false,
  title: 'Drácula',
  author: 'Bram Stoker',
  category: 'Terror',
  bookCount: null,
  price: 29.9,
  imageUri: null,
};

describe('cartReducer', () => {
  it('adiciona um produto novo com quantidade 1', () => {
    const state = cartReducer([], { type: CART_ACTIONS.ADD, product: book });
    expect(state).toHaveLength(1);
    expect(state[0]).toMatchObject({ productId: 1, quantity: 1, title: 'Drácula' });
  });

  it('soma 1 ao adicionar um produto que já está no carrinho', () => {
    const once = cartReducer([], { type: CART_ACTIONS.ADD, product: book });
    const twice = cartReducer(once, { type: CART_ACTIONS.ADD, product: book });
    expect(twice).toHaveLength(1);
    expect(twice[0].quantity).toBe(2);
  });

  it('não passa do limite por item', () => {
    let state = cartReducer([], { type: CART_ACTIONS.ADD, product: book });
    state = cartReducer(state, { type: CART_ACTIONS.SET_QUANTITY, productId: 1, quantity: 999 });
    expect(state[0].quantity).toBe(MAX_QUANTITY_PER_ITEM);
  });

  it('não deixa a quantidade ficar abaixo de 1', () => {
    let state = cartReducer([], { type: CART_ACTIONS.ADD, product: book });
    state = cartReducer(state, { type: CART_ACTIONS.SET_QUANTITY, productId: 1, quantity: 0 });
    expect(state[0].quantity).toBe(1);
  });

  it('remove um item', () => {
    const state = cartReducer([], { type: CART_ACTIONS.ADD, product: book });
    expect(cartReducer(state, { type: CART_ACTIONS.REMOVE, productId: 1 })).toEqual([]);
  });

  it('limpar um carrinho vazio mantém o mesmo estado', () => {
    const empty = [];
    expect(cartReducer(empty, { type: CART_ACTIONS.CLEAR })).toBe(empty);
  });
});

describe('calculateTotals', () => {
  it('soma total e unidades', () => {
    const items = [
      { price: 29.9, quantity: 2 },
      { price: 10, quantity: 1 },
    ];
    expect(calculateTotals(items)).toEqual({ total: 69.8, itemCount: 3 });
  });

  it('carrinho vazio dá zero', () => {
    expect(calculateTotals([])).toEqual({ total: 0, itemCount: 0 });
  });
});
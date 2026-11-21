// Regras do carrinho, sem React: funções puras, fáceis de entender e de trocar
// (responsabilidade única). O CartContext só liga estas regras ao app.

// Limite por item, o mesmo do contrato de pedidos (POST /orders).
export const MAX_QUANTITY_PER_ITEM = 20;

export const CART_ACTIONS = {
  ADD: 'ADD',
  SET_QUANTITY: 'SET_QUANTITY',
  REMOVE: 'REMOVE',
  CLEAR: 'CLEAR',
};

// Guarda só o que o carrinho precisa mostrar (cópia do produto no momento em
// que foi adicionado). O preço final quem calcula é o backend, no pedido.
function toCartItem(product) {
  return {
    productId: product.id,
    type: product.type,
    isKit: product.isKit,
    title: product.title,
    author: product.author,
    category: product.category,
    bookCount: product.bookCount,
    price: product.price,
    imageUri: product.imageUri,
    quantity: 1,
  };
}

const clamp = (quantity) => Math.min(Math.max(quantity, 1), MAX_QUANTITY_PER_ITEM);

// Custo: ADD, O(n) (procura o item); SET_QUANTITY, REMOVE e CLEAR, O(n) ou O(1),
// com n itens diferentes no carrinho (poucos, então uma lista simples basta).
export function cartReducer(state, action) {
  switch (action.type) {
    case CART_ACTIONS.ADD: {
      const index = state.findIndex((item) => item.productId === action.product.id);
      if (index === -1) return [...state, toCartItem(action.product)];
      return state.map((item, i) =>
        i === index ? { ...item, quantity: clamp(item.quantity + 1) } : item
      );
    }
    case CART_ACTIONS.SET_QUANTITY:
      return state.map((item) =>
        item.productId === action.productId
          ? { ...item, quantity: clamp(action.quantity) }
          : item
      );
    case CART_ACTIONS.REMOVE:
      return state.filter((item) => item.productId !== action.productId);
    case CART_ACTIONS.CLEAR:
      return state.length ? [] : state; // já vazio: mantém o estado (sem nova renderização)
    default:
      return state;
  }
}

// Total em reais e quantidade de unidades, numa única passada.
// Custo: O(n), com n itens diferentes.
export function calculateTotals(items) {
  let total = 0;
  let itemCount = 0;
  for (const item of items) {
    total += item.price * item.quantity;
    itemCount += item.quantity;
  }
  return { total: Math.round(total * 100) / 100, itemCount }; // arredonda para centavos
}
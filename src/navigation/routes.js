// Nomes das rotas do comprador em um só lugar (sem strings soltas nas telas).
// Parâmetros:
//   CATEGORY_RESULTS -> { category?: string, search?: string }
//   BOOK_DETAIL      -> { productId: number }
//   KIT_DETAIL       -> { productId: number }
//   ORDER_CONFIRMED  -> { order: object }  (pedido devolvido pelo POST /orders)
//   ORDER_DETAIL     -> { orderId: number }  (a tela busca o pedido por GET /orders/{id})
export const ROUTES = {
  HOME: 'HomeMain',
  CATEGORY_RESULTS: 'CategoryResults',
  BOOK_DETAIL: 'BookDetail',
  KITS: 'KitsMain',
  KIT_DETAIL: 'KitDetail',
  CART: 'CartMain',
  ORDER_SUMMARY: 'OrderSummary',
  ORDER_CONFIRMED: 'OrderConfirmed',
  ORDERS: 'OrdersMain',
  ORDER_DETAIL: 'OrderDetail',
};
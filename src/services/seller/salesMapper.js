// Traduz a resposta de GET /ws/orders/sales para o formato das telas. É o único
// lugar que conhece os nomes dos campos do contrato de vendas.
//
// O back agrupa por pedido: sales[] = { orderId, date, items: [...] }, e o
// título, a quantidade e o valor ficam em cada item. A tela mostra uma linha
// por item vendido, então os pedidos são "achatados" (flatMap). Se um pedido
// vier sem `items` (formato antigo, uma venda por linha), ele próprio é a linha.
// Custo: O(p + i), com p pedidos e i itens vendidos.
export function toSalesReport(dto) {
  const orders = dto?.sales ?? [];
  const items = orders.flatMap((order) =>
    (order.items ?? [order]).map((item) => ({
      orderId: order.orderId,
      title: item.productTitle ?? item.title,
      date: order.date ?? order.createdAt ?? item.date,
      quantity: item.quantity,
      total: item.total ?? item.subtotal,
    }))
  );
  return {
    totalRevenue: dto?.totalRevenue ?? 0,
    items,
  };
}
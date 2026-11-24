// Traduz a resposta de GET /ws/orders/sales para o formato das telas. É o único
// lugar que conhece os nomes dos campos do contrato de vendas.
// Custo: O(n) no mapeamento.
export function toSalesReport(dto) {
  const sales = dto?.sales ?? [];
  return {
    totalRevenue: dto?.totalRevenue ?? 0,
    items: sales.map((sale) => ({
      orderId: sale.orderId,
      title: sale.productTitle,
      date: sale.date,
      quantity: sale.quantity,
      total: sale.total,
    })),
  };
}
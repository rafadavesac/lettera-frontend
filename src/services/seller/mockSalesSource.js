const FAKE_LATENCY_MS = 500;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const round2 = (value) => Math.round(value * 100) / 100;

// Vendas de exemplo, no formato do back: uma entrada por PEDIDO, com os itens
// vendidos dentro de `items` (GET /ws/orders/sales).
const SALES = [
  { orderId: 1048, date: '2026-11-23T18:42:00', items: [{ productTitle: 'Kit Terror', quantity: 1, total: 59.9 }] },
  { orderId: 1047, date: '2026-11-23T11:05:00', items: [{ productTitle: 'O Hobbit', quantity: 2, total: 89.8 }] },
  { orderId: 1045, date: '2026-11-22T20:10:00', items: [{ productTitle: 'Duna', quantity: 1, total: 59.9 }] },
  {
    orderId: 1044,
    date: '2026-11-21T16:30:00',
    items: [
      { productTitle: 'Kit Romance', quantity: 2, total: 109.8 },
      { productTitle: 'Drácula', quantity: 1, total: 34.9 },
    ],
  },
  { orderId: 1041, date: '2026-11-19T09:15:00', items: [{ productTitle: 'O Iluminado', quantity: 1, total: 49.9 }] },
  { orderId: 1038, date: '2026-11-17T14:50:00', items: [{ productTitle: 'Neuromancer', quantity: 3, total: 128.7 }] },
  { orderId: 1036, date: '2026-11-15T21:00:00', items: [{ productTitle: 'Jane Eyre', quantity: 1, total: 32.9 }] },
  { orderId: 1021, date: '2026-10-28T10:20:00', items: [{ productTitle: 'Kit Fantasia', quantity: 1, total: 39.9 }] },
  { orderId: 1015, date: '2026-10-09T15:45:00', items: [{ productTitle: 'Orgulho e Preconceito', quantity: 2, total: 59.8 }] },
];

// Fonte de dados de exemplo do histórico de vendas, fiel ao contrato:
// { totalRevenue, sales: [{ orderId, date, items: [{ productTitle, quantity, total }] }] }.
// Filtra pelo mês (`period` = AAAA-MM; as datas ISO começam por ele) e o total
// é a soma dos itens, como o backend calcula. Custo: O(p + i).
export const mockSalesSource = {
  async list({ period } = {}) {
    await delay(FAKE_LATENCY_MS);
    const sales = period ? SALES.filter((order) => order.date.startsWith(period)) : SALES;
    return {
      totalRevenue: round2(
        sales.reduce((sum, order) => sum + order.items.reduce((s, item) => s + item.total, 0), 0)
      ),
      sales,
    };
  },
};
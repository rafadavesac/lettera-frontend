const FAKE_LATENCY_MS = 500;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const round2 = (value) => Math.round(value * 100) / 100;

// Vendas de exemplo, no formato do contrato (GET /ws/orders/sales). O mesmo
// pedido pode aparecer em mais de uma linha (um item de cada vez).
const SALES = [
  { orderId: 1048, productTitle: 'Kit Terror', date: '2026-11-23T18:42:00', quantity: 1, total: 59.9 },
  { orderId: 1047, productTitle: 'O Hobbit', date: '2026-11-23T11:05:00', quantity: 2, total: 89.8 },
  { orderId: 1045, productTitle: 'Duna', date: '2026-11-22T20:10:00', quantity: 1, total: 59.9 },
  { orderId: 1044, productTitle: 'Kit Romance', date: '2026-11-21T16:30:00', quantity: 2, total: 109.8 },
  { orderId: 1044, productTitle: 'Drácula', date: '2026-11-21T16:30:00', quantity: 1, total: 34.9 },
  { orderId: 1041, productTitle: 'O Iluminado', date: '2026-11-19T09:15:00', quantity: 1, total: 49.9 },
  { orderId: 1038, productTitle: 'Neuromancer', date: '2026-11-17T14:50:00', quantity: 3, total: 128.7 },
  { orderId: 1036, productTitle: 'Jane Eyre', date: '2026-11-15T21:00:00', quantity: 1, total: 32.9 },
];

// Fonte de dados de exemplo do histórico de vendas, fiel ao contrato:
// { totalRevenue, sales: [{ orderId, productTitle, date, quantity, total }] }.
// O total é a soma das vendas, como o backend calculará. Custo: O(n).
export const mockSalesSource = {
  async list() {
    await delay(FAKE_LATENCY_MS);
    return {
      totalRevenue: round2(SALES.reduce((sum, sale) => sum + sale.total, 0)),
      sales: SALES,
    };
  },
};
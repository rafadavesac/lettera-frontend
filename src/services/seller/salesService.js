import { toSalesReport } from './salesMapper';

// Serviço do histórico de vendas, a partir de uma fonte (mock ou API) com `list`.
export function createSalesService(source) {
  return {
    // `period`: AAAA-MM (opcional). Do mais recente ao mais antigo (o contrato
    // não garante a ordem, então ordena aqui; datas ISO-8601 comparam como
    // texto). Custo: O(n log n).
    async list({ period } = {}) {
      const report = toSalesReport(await source.list({ period }));
      const items = [...report.items].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
      return { ...report, items };
    },
  };
}
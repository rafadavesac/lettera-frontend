import { toOrder, toOrderSummary } from './orderMapper';

// Cria o serviço de pedidos a partir de uma "fonte" (mock ou API): qualquer
// objeto com create, listMine e getById. Depende da abstração, não da
// implementação concreta, e só cuida de montar a requisição e mapear a resposta.
export function createOrderService(source) {
  return {
    // `items`: [{ productId, quantity }] (o carrinho pode passar mais campos;
    // só os do contrato seguem). Custo: O(n) na montagem + O(i + b) no mapeamento.
    async create(items) {
      const request = {
        items: items.map(({ productId, quantity }) => ({ productId, quantity })),
      };
      return toOrder(await source.create(request));
    },

    // Histórico do comprador logado: resumos, do mais recente ao mais antigo
    // (lista simples, sem paginação, como no contrato). Custo: O(k).
    async listMine() {
      const summaries = await source.listMine();
      const items = summaries.map(toOrderSummary);
      return { items, total: items.length };
    },

    // Pedido completo, com os livros sorteados (GET /orders/{id}).
    async getById(id) {
      return toOrder(await source.getById(id));
    },
  };
}
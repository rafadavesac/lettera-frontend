import { toOrder } from './orderMapper';

export const DEFAULT_ORDERS_PAGE_SIZE = 20;

// Cria o serviço de pedidos a partir de uma "fonte" (mock ou API): qualquer
// objeto com create e listMine. Depende da abstração, não da implementação
// concreta, e só cuida de montar a requisição e mapear a resposta.
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

    // Pedidos do comprador logado, do mais recente ao mais antigo.
    // Custo: O(k) pedidos da página (vezes o tamanho de cada um).
    async listMine({ page = 0, size = DEFAULT_ORDERS_PAGE_SIZE } = {}) {
      const result = await source.listMine({ page, size });
      return { items: result.content.map(toOrder), total: result.totalElements };
    },
  };
}
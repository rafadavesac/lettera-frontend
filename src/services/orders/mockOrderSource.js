import { PRODUCT_TYPES } from '../products/productMapper';

// Fonte de dados de exemplo, no mesmo formato do contrato oficial de pedidos,
// incluindo as regras de validação e o sorteio que o backend fará. Os pedidos
// ficam só em memória: somem ao recarregar o app.
const FAKE_LATENCY_MS = 600;
const MAX_QUANTITY_PER_ITEM = 20;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Mesmo formato de erro que o cliente HTTP devolve.
const fail = (status, message) => ({ status, isNetworkError: false, message });

const round2 = (value) => Math.round(value * 100) / 100;

// Estratégia de sorteio (Strategy): quem sorteia pode ser trocado sem mexer no
// resto. Embaralhamento parcial de Fisher-Yates: só os `count` primeiros
// lugares são sorteados. Custo: O(m + k), com m livros no conjunto (cópia) e
// k livros sorteados; os livros de um mesmo sorteio nunca se repetem.
export const randomDrawStrategy = {
  draw(pool, count) {
    const copy = [...pool];
    for (let i = 0; i < count; i += 1) {
      const j = i + Math.floor(Math.random() * (copy.length - i));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, count);
  },
};

// Regras do contrato para POST /orders (erro 400). Custo: O(n), com n itens.
function validateItems(items) {
  if (!Array.isArray(items) || items.length === 0) {
    throw fail(400, 'O pedido precisa ter ao menos um item.');
  }
  const seen = new Set();
  for (const { productId, quantity } of items) {
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY_PER_ITEM) {
      throw fail(400, `A quantidade de cada item deve ficar entre 1 e ${MAX_QUANTITY_PER_ITEM}.`);
    }
    if (seen.has(productId)) {
      throw fail(400, 'Há produtos repetidos no pedido.');
    }
    seen.add(productId);
  }
}

const toDrawnBookDto = (book) => ({
  title: book.title,
  author: book.author,
  image: book.imageUri,
});

const countUnits = (items) => items.reduce((sum, item) => sum + item.quantity, 0);

// `catalog` é o serviço de produtos (getById e list); no backend real, o
// order-api consulta o product-api do mesmo jeito.
export function createMockOrderSource({ catalog, drawStrategy = randomDrawStrategy }) {
  const orders = []; // mais recente primeiro
  let nextId = 1;

  // Uma busca de livros por categoria por pedido (a promessa fica em cache).
  function createPoolLoader() {
    const cache = new Map();
    return (category) => {
      if (!cache.has(category)) {
        cache.set(
          category,
          catalog.list({ category, type: PRODUCT_TYPES.BOOK }).then((result) => result.items)
        );
      }
      return cache.get(category);
    };
  }

  async function buildItem({ productId, quantity }, loadPool) {
    const product = await catalog.getById(productId); // 404 se não existir

    // Como no contrato: `drawnBooks` junta os livros de todas as unidades
    // (bookCount × quantity), os de cada unidade em sequência.
    const drawnBooks = [];
    if (product.isKit) {
      const pool = await loadPool(product.category);
      if (pool.length < product.bookCount) {
        throw fail(409, 'Não há livros suficientes para sortear este kit.');
      }
      for (let unit = 0; unit < quantity; unit += 1) {
        drawnBooks.push(...drawStrategy.draw(pool, product.bookCount).map(toDrawnBookDto));
      }
    }

    return {
      productId: product.id,
      title: product.title,
      type: product.type,
      unitPrice: product.price,
      quantity,
      subtotal: round2(product.price * quantity),
      drawnBooks,
    };
  }

  return {
    // Custo: O(n) na validação + O(n) itens, e cada kit custa O(m + q * k)
    // (m livros da categoria, q unidades, k livros por kit).
    async create(request) {
      await delay(FAKE_LATENCY_MS);
      validateItems(request.items);

      const loadPool = createPoolLoader();
      const items = await Promise.all(request.items.map((item) => buildItem(item, loadPool)));

      const order = {
        id: nextId,
        createdAt: new Date().toISOString(),
        total: round2(items.reduce((sum, item) => sum + item.subtotal, 0)),
        items,
      };
      nextId += 1;
      orders.unshift(order);
      return order;
    },

    // Resumos, do mais recente ao mais antigo. Custo: O(k * i), com k pedidos
    // e i itens por pedido (para somar as quantidades).
    async listMine() {
      await delay(FAKE_LATENCY_MS);
      return orders.map((order) => ({
        id: order.id,
        createdAt: order.createdAt,
        total: order.total,
        itemCount: countUnits(order.items),
      }));
    },

    // Custo: O(k) (busca linear); na API real é uma consulta por chave primária.
    async getById(id) {
      await delay(FAKE_LATENCY_MS);
      const order = orders.find((candidate) => candidate.id === Number(id));
      if (!order) throw fail(404, 'Pedido não encontrado.');
      return order;
    },
  };
}
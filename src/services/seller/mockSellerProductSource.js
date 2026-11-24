import { PRODUCT_TYPES } from '../products/productMapper';
import { getImageFileError } from './uploadConfig';

const FAKE_LATENCY_MS = 500;
const FAKE_UPLOAD_LATENCY_MS = 1000; // o envio de arquivo demora mais

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Mesmo formato de erro que o cliente HTTP devolve.
const fail = (status, message) => ({ status, isNetworkError: false, message });

// Regras que o backend aplicará ao receber um produto (400 se inválido).
// Custo: O(1).
function assertValidRequest(request) {
  const isKit = request.type === PRODUCT_TYPES.KIT;
  const valid =
    (request.type === PRODUCT_TYPES.BOOK || isKit) &&
    Boolean(request.title) &&
    Boolean(request.description) &&
    Boolean(request.category) &&
    typeof request.price === 'number' &&
    request.price > 0 &&
    (isKit ? Number.isInteger(request.bookCount) && request.bookCount >= 1 : Boolean(request.author));
  if (!valid) throw fail(400, 'Dados do produto inválidos.');
}

// Fonte de escrita de exemplo. Grava no MESMO store do mock do comprador,
// então o que o vendedor faz aparece na visão do comprador durante o teste.
// Custos: create O(1); update, remove e uploadImage O(n) (busca no store).
export function createMockSellerProductSource({ store }) {
  const requireExisting = (id) => {
    const found = store.find(id);
    if (!found) throw fail(404, 'Produto não encontrado.');
    return found;
  };

  return {
    async create(request) {
      await delay(FAKE_LATENCY_MS);
      assertValidRequest(request);
      return store.insert({ ...request, image: null });
    },

    // A imagem não muda no PUT: só pelo upload.
    async update(id, request) {
      await delay(FAKE_LATENCY_MS);
      requireExisting(id);
      assertValidRequest(request);
      return store.replace(id, request);
    },

    async remove(id) {
      await delay(FAKE_LATENCY_MS);
      requireExisting(id);
      store.remove(id);
    },

    // Guarda a URI local do arquivo como `image` (a API real devolverá um
    // caminho relativo). Aplica as mesmas regras de tipo e tamanho.
    async uploadImage(id, file) {
      await delay(FAKE_UPLOAD_LATENCY_MS);
      requireExisting(id);
      const message = getImageFileError(file);
      if (message) throw fail(400, message);
      return store.replace(id, { image: file.uri });
    },
  };
}
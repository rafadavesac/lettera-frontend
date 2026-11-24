import { PRODUCT_TYPES } from '../products/productMapper';
import { resolveImageUrl } from '../../utils/imageUrl';

// Livro sorteado, como o contrato manda: título, autor e imagem.
function toDrawnBook(dto) {
  return {
    title: dto.title,
    author: dto.author ?? null,
    imageUri: resolveImageUrl(dto.image),
  };
}

// O contrato manda `drawnBooks` numa lista só, com os livros de todas as
// unidades do kit (bookCount × quantity), os de cada unidade em sequência.
// Aqui viram um sorteio por unidade (lista de listas): cada sorteio tem
// total ÷ quantidade livros. Se a conta não fechar, tudo vai num sorteio só.
// Custo: O(b), com b livros sorteados.
export function groupDraws(drawnBooks, quantity) {
  if (drawnBooks.length === 0) return [];
  const perUnit = drawnBooks.length / quantity;
  if (!Number.isInteger(perUnit)) return [drawnBooks];

  const draws = [];
  for (let start = 0; start < drawnBooks.length; start += perUnit) {
    draws.push(drawnBooks.slice(start, start + perUnit));
  }
  return draws;
}

// O item do pedido não traz autor nem capa no contrato (só o título e o preço
// da época da compra), então esses campos ficam nulos.
function toOrderItem(dto) {
  const draws = groupDraws((dto.drawnBooks ?? []).map(toDrawnBook), dto.quantity);
  return {
    productId: dto.productId,
    type: dto.type,
    isKit: dto.type === PRODUCT_TYPES.KIT,
    title: dto.title,
    author: null,
    imageUri: null,
    unitPrice: dto.unitPrice,
    quantity: dto.quantity,
    subtotal: dto.subtotal,
    bookCount: draws[0]?.length ?? null, // livros por unidade do kit (vem do sorteio)
    draws,
  };
}

// Pedido completo (resposta do POST /orders e do GET /orders/{id}).
// Custo: O(i + b), com i itens e b livros sorteados.
export function toOrder(dto) {
  const items = dto.items.map(toOrderItem);
  return {
    id: dto.id,
    createdAt: dto.createdAt,
    total: dto.total,
    items,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    hasDraws: items.some((item) => item.draws.length > 0),
  };
}

// Linha do histórico (GET /orders/me): só o resumo. Custo: O(1).
export function toOrderSummary(dto) {
  return {
    id: dto.id,
    createdAt: dto.createdAt,
    total: dto.total,
    itemCount: dto.itemCount,
  };
}
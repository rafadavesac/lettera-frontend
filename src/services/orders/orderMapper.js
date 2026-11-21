import { PRODUCT_TYPES } from '../products/productMapper';

// Livro que saiu num sorteio de kit.
function toDrawnBook(dto) {
  return {
    id: dto.bookId,
    title: dto.title,
    author: dto.author ?? null,
    imageUri: dto.imageUrl ?? null,
    category: dto.category,
  };
}

// `draws` vira uma lista de listas de livros: um sorteio por unidade do kit
// (kit com quantidade 2 -> 2 sorteios). Livro avulso tem `draws` vazio.
function toOrderItem(dto) {
    const draws = (dto.draws ?? []).map((draw) => draw.books.map(toDrawnBook));
  return {
    productId: dto.productId,
    type: dto.type,
    isKit: dto.type === PRODUCT_TYPES.KIT,
    title: dto.title,
    author: dto.author ?? null,
    imageUri: dto.imageUrl ?? null,
    unitPrice: dto.unitPrice,
    quantity: dto.quantity,
    subtotal: dto.subtotal,
    bookCount: draws[0]?.length ?? null, // livros por unidade do kit (vem do sorteio)
draws,
  };
}

// Traduz o pedido do contrato para o formato das telas. Único lugar que
// conhece os nomes dos campos da API de pedidos.
// Custo: O(i + b), com i itens e b livros sorteados no pedido.
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
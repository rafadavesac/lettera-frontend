import { formatBookCount } from './format';
// Separa a lista em livros e kits numa única passada.
// Custo: O(n) em tempo e em espaço, com n produtos.
export function groupByKind(items) {
  const books = [];
  const kits = [];
  for (const item of items) {
    (item.isKit ? kits : books).push(item);
  }
  return { books, kits };
}


// Texto de apoio de uma linha de carrinho ou pedido: "2 livros surpresa" (kit)
// ou o autor (livro). Custo: O(1).
export function getItemSubtitle(item) {
  if (item.isKit) {
    return item.bookCount ? formatBookCount(item.bookCount) : 'Kit surpresa';
  }
  return item.author;
}
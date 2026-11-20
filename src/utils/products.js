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
// Une todos os sorteios de um pedido numa lista de "caixas" para a revelação:
// uma caixa por unidade de kit (kit com quantidade 2 -> 2 caixas, cada uma com
// seus livros). Livro avulso não gera caixa.
// Custo: O(i + d), com i itens e d sorteios (os livros não são copiados).
export function flattenDraws(order) {
  const boxes = [];
  for (const item of order.items) {
    item.draws.forEach((books, unitIndex) => {
      boxes.push({
        key: `${item.productId}-${unitIndex}`,
        label:
          item.quantity > 1
            ? `${item.title} · unidade ${unitIndex + 1} de ${item.quantity}`
            : item.title,
        books,
      });
    });
  }
  return boxes;
}
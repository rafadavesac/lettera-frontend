// Formata um número como moeda brasileira: 29.9 -> "R$ 29,90".
// Feito à mão (sem Intl) para dar o mesmo resultado em qualquer aparelho.
// Custo: O(n) no número de dígitos da parte inteira, na prática constante.
export function formatPrice(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 'R$ --';

  const [integer, decimals] = number.toFixed(2).split('.');
  const withThousands = integer.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `R$ ${withThousands},${decimals}`;
}

// Texto da quantidade de livros de um kit: 1 -> "1 livro surpresa", 2 -> "2 livros surpresa".
// Custo: O(1).
export function formatBookCount(count) {
  return `${count} ${count === 1 ? 'livro' : 'livros'} surpresa`;
}
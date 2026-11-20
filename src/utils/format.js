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

// Formata uma data ISO (ex.: "2026-11-20T14:30:00") como "20/11/2026".
// Custo: O(1).
export function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '--/--/----';

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}/${date.getFullYear()}`;
}

// Primeiro nome: "Maria Silva" -> "Maria". Sem nome, devolve "leitor(a)".
// Custo: O(n) no tamanho do nome.
export function getFirstName(name) {
  const first = String(name ?? '').trim().split(' ')[0];
  return first || 'leitor(a)';
}

// Texto da contagem de resultados: 1 -> "1 resultado", 3 -> "3 resultados".
// Custo: O(1).
export function formatResultCount(count) {
  return `${count} ${count === 1 ? 'resultado' : 'resultados'}`;
}
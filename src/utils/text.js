// Normaliza texto para busca: minúsculas e sem acento ("Ficção" -> "ficcao").
// Custo: O(n) no tamanho do texto.
export function normalizeText(value) {
  return String(value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}
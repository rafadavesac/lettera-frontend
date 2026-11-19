// src/utils/validators.js
// Funções puras de validação, sem dependência de tela ou rede.
// Complexidade: O(n) no tamanho da string, que aqui é sempre curta.

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email) {
  return EMAIL_REGEX.test(email.trim());
}
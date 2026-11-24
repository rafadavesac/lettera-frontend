// src/utils/validators.js
// Funções puras de validação, sem dependência de tela ou rede.
// Complexidade: O(n) no tamanho da string, que aqui é sempre curta.

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email) {
  return EMAIL_REGEX.test(email.trim());
}

export const MIN_PASSWORD_LENGTH = 8;

export function isValidPassword(password) {
  return password.length >= MIN_PASSWORD_LENGTH;
}
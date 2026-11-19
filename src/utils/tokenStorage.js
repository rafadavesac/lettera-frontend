// src/utils/tokenStorage.js
// Única responsabilidade: guardar, ler e apagar a sessão (token + usuário)
// no armazenamento seguro do aparelho. Não conhece rede nem telas.
//
// Complexidade: todas as operações são O(1) (uma chave lida ou escrita por vez).

import * as SecureStore from 'expo-secure-store';

// Chaves do SecureStore só aceitam letras, números, ".", "-" e "_".
const TOKEN_KEY = 'lettera.token';
const USER_KEY = 'lettera.user';

export async function saveSession(token, user) {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
  await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
}

export async function getToken() {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function getStoredUser() {
  const raw = await SecureStore.getItemAsync(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    // Dado corrompido: trata como se não houvesse sessão salva.
    return null;
  }
}

export async function clearSession() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
  await SecureStore.deleteItemAsync(USER_KEY);
}
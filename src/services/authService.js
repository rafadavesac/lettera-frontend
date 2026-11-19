// src/services/authService.js
// Única responsabilidade: conversar com os endpoints de autenticação do gateway.
// Não guarda token nem altera telas: quem persiste a sessão é o AuthContext.
//
// Complexidade: cada função faz uma requisição HTTP, O(1) no app.

import api from './api';

// POST /auth/signin  { email, password } -> { user: { id, name, email, type, ... }, token }
export async function signIn(email, password) {
  const { data } = await api.post('/auth/signin', {
    email: email.trim().toLowerCase(),
    password,
  });
  return data; // { user, token }
}

// POST /auth/signup  { name, email, password } -> { id, name, email, type: "Common", ... }
// O signup NÃO devolve token: depois de cadastrar, o app faz o signIn em seguida.
export async function signUp(name, email, password) {
  const { data } = await api.post('/auth/signup', {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password,
  });
  return data; // usuário criado
}
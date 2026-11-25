// src/services/api.js
// Cliente HTTP único do app. Responsabilidades:
//  1) apontar para o gateway (URL vinda de src/config/api.js);
//  2) anexar o token JWT em toda requisição, se houver sessão;
//  3) traduzir erros do axios em um formato simples para as telas.
// Não conhece telas nem contexto: quem reage ao 401 é registrado de fora (ver abaixo).

import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT_MS } from '../config/api';
import { getToken } from '../utils/tokenStorage';

// eslint-disable-next-line import/no-named-as-default-member
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT_MS,
  headers: { 'Content-Type': 'application/json' },
});

// Função chamada quando uma requisição AUTENTICADA volta 401 (token expirado/inválido).
// O AuthContext registra aqui o seu signOut. Assim, este arquivo não depende do contexto
// (evita import circular e respeita a inversão de dependência).
let onUnauthorized = null;
export function setUnauthorizedHandler(handler) {
  onUnauthorized = handler;
}

// Antes de cada requisição: anexa "Authorization: Bearer <token>" se houver token. O(1).
api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Extrai uma mensagem legível do corpo da resposta (o back às vezes devolve texto puro,
// às vezes um objeto com "message").
function extractMessage(data) {
  if (typeof data === 'string' && data.trim()) return data;
  if (data && typeof data.message === 'string') return data.message;
  return null;
}

// Depois de cada resposta: sucesso passa direto; erro vira { status, message, isNetworkError }.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const response = error.response;

    // Sem resposta: backend fora do ar, IP errado, Wi-Fi diferente ou timeout.
    if (!response) {
      return Promise.reject({
        status: null,
        isNetworkError: true,
        message: 'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.',
      });
    }

    // 401 numa requisição que levava token = sessão inválida. Avisa quem registrou o handler.
    // (Um 401 no login não tem token no header, então não dispara logout.)
    const hadToken = Boolean(error.config?.headers?.Authorization);
    if (response.status === 401 && hadToken && onUnauthorized) {
      onUnauthorized();
    }

    return Promise.reject({
      status: response.status,
      isNetworkError: false,
      message: extractMessage(response.data) ?? 'Algo deu errado. Tente novamente.',
    });
  }
);

export default api;
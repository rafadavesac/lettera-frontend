// src/config/api.js
// Único lugar que conhece o endereço do backend.
//
// O IP do PC que roda o Docker é descoberto sozinho: em desenvolvimento o
// Expo Go carrega o app de um servidor (Metro) que roda no PC, e o endereço
// desse servidor é o IP do PC na rede. O gateway roda no mesmo PC, na 8080.
// Ordem de escolha do endereço:
//   1) EXPO_PUBLIC_API_HOST (arquivo .env.local), para forçar outro IP;
//   2) o IP do servidor Expo (automático, modo LAN);
//   3) localhost (só funciona em emulador, não no celular).
// Use o passo 1 se o Docker rodar em OUTRO computador ou se usar o modo túnel do Expo.

import Constants from 'expo-constants';

const API_PORT = 8080; // porta do gateway-api
const FALLBACK_HOST = 'localhost';
const IPV4 = /^\d{1,3}(\.\d{1,3}){3}$/;

// "192.168.0.10:8081" -> "192.168.0.10". No modo túnel o host é um domínio do
// Expo (não um IP) e não aponta para o PC, então é ignorado. Custo: O(1).
function getHostFromExpoServer() {
  const host = Constants.expoConfig?.hostUri?.split(':')[0];
  return host && IPV4.test(host) ? host : null;
}

const API_HOST = process.env.EXPO_PUBLIC_API_HOST || getHostFromExpoServer() || FALLBACK_HOST;

export const API_BASE_URL = `http://${API_HOST}:${API_PORT}`;
export const API_TIMEOUT_MS = 10000; // 10 s: evita o app ficar travado se o backend não responder

// true = dados de exemplo (sem backend de produtos); false = API real via gateway.
// O login e o cadastro usam sempre o backend real, qualquer que seja o valor.
export const USE_MOCK_API = false;
// src/config/api.js
// Único lugar que conhece o endereço do backend.
// Se o IP do PC mudar (Wi-Fi novo, por exemplo), só este arquivo precisa ser editado.
// Descubra o IP com `ipconfig` (Endereço IPv4 do Wi-Fi).

const API_HOST = '192.168.0.216';
const API_PORT = 8080; // porta do gateway-api

export const API_BASE_URL = `http://${API_HOST}:${API_PORT}`;
export const API_TIMEOUT_MS = 10000; // 10 s: evita o app ficar travado se o backend não responder

// true = dados de exemplo (sem backend de produtos); false = API real via gateway.
// Trocar para false quando o product-api entregar o contrato do catálogo.
export const USE_MOCK_API = true;
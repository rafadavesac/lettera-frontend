import { API_BASE_URL } from '../config/api';

// O contrato devolve a imagem como caminho relativo (ex.: "/images/3f2a.jpg").
// Monta a URL completa com o endereço do gateway. URL absoluta (http, https) e
// URI local da foto escolhida no aparelho (file, content, data) passam como
// estão, e sem imagem devolve null (a capa mostra o placeholder). Custo: O(1).
export function resolveImageUrl(path) {
  if (!path) return null;
  if (/^(https?|file|content|data):/i.test(path)) return path;
  return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
}
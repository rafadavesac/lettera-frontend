// Regras do upload de imagem do produto, em UM só arquivo: quando o dev do
// backend confirmar o nome do campo multipart, os tipos e o tamanho máximo,
// só este arquivo muda (a fonte API, o mock, o seletor e o formulário leem daqui).
// VALORES ASSUMIDOS, A CONFIRMAR COM O DEV: nome "file", JPG/PNG/WebP, 5 MB.

export const IMAGE_FIELD_NAME = 'file'; // nome do campo multipart em POST /ws/products/{id}/image
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB
export const UPLOAD_TIMEOUT_MS = 30000; // envio de arquivo demora mais que um JSON comum

// Confere um arquivo { uri, name, type, size } e devolve a mensagem de erro,
// ou null se estiver ok. `size` pode vir nulo (o seletor nem sempre informa):
// nesse caso o tamanho fica por conta do servidor. Custo: O(t), com t tipos aceitos.
export function getImageFileError(file) {
  if (!file?.uri) return 'Escolha uma imagem.';
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) return 'Use uma imagem JPG, PNG ou WebP.';
  if (file.size && file.size > MAX_IMAGE_BYTES) {
    return `A imagem deve ter no máximo ${MAX_IMAGE_BYTES / (1024 * 1024)} MB.`;
  }
  return null;
}
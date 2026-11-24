import api from '../api';
import { IMAGE_FIELD_NAME, UPLOAD_TIMEOUT_MS } from './uploadConfig';

// Fonte real de escrita no catálogo: chama as rotas /ws/** do gateway
// (exigem JWT de vendedor; o cliente HTTP já anexa o token). Erros chegam
// padronizados pelo interceptor do cliente.
export const apiSellerProductSource = {
  async create(request) {
    const { data } = await api.post('/ws/products', request);
    return data;
  },

  async update(id, request) {
    const { data } = await api.put(`/ws/products/${id}`, request);
    return data;
  },

  async remove(id) {
    await api.delete(`/ws/products/${id}`);
  },

  // Multipart: no React Native, o arquivo entra no FormData como
  // { uri, name, type }. O nome do campo vem de uploadConfig.js.
  async uploadImage(id, file) {
    const body = new FormData();
    body.append(IMAGE_FIELD_NAME, { uri: file.uri, name: file.name, type: file.type });

    const { data } = await api.post(`/ws/products/${id}/image`, body, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: UPLOAD_TIMEOUT_MS,
    });
    return data;
  },
};
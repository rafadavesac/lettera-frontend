import api from '../api';

// Fonte real das categorias: GET /categories (público), devolve uma lista de textos.
export const apiCategorySource = {
  async list() {
    const { data } = await api.get('/categories');
    return data;
  },
};
// Lista fixa de categorias, por enquanto. Devolve Promise para ter a mesma
// forma de uma chamada de rede: quando a rota /products/categories existir,
// só este arquivo muda (as telas continuam iguais).
const CATEGORIES = ['Terror', 'Fantasia', 'Romance', 'Ficção científica', 'Suspense'];

export const categoryService = {
  async list() {
    return CATEGORIES;
  },
};
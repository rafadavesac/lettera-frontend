// Cria o serviço de categorias a partir de uma "fonte" (mock ou API): qualquer
// objeto com `list`. Mesmo padrão do serviço de produtos (inversão de dependência).
export function createCategoryService(source) {
  return {
    // Lista de textos. A ordenação vem da fonte. Custo: O(1) no app.
    async list() {
      return source.list();
    },
  };
}
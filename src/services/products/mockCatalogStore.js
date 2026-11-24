// Dados de exemplo do catálogo, no formato do contrato da API (image = caminho
// relativo ou URI local, ou null). É a ÚNICA cópia dos dados mock do catálogo:
// o mock do comprador (leitura) e o mock do vendedor (escrita) usam este store,
// então um produto criado, editado ou excluído aparece nas duas visões.
// Os dados ficam só em memória: voltam ao início ao recarregar o app.
const SEED = [
  { id: 1, type: 'BOOK', title: 'O Iluminado', author: 'Stephen King', description: 'Uma família isolada num hotel de montanha durante o inverno.', category: 'Terror', price: 49.9, image: null, bookCount: null },
  { id: 2, type: 'BOOK', title: 'Drácula', author: 'Bram Stoker', description: 'O clássico do vampiro, contado em cartas e diários.', category: 'Terror', price: 34.9, image: null, bookCount: null },
  { id: 3, type: 'BOOK', title: 'O Hobbit', author: 'J.R.R. Tolkien', description: 'A aventura de Bilbo Bolseiro rumo à Montanha Solitária.', category: 'Fantasia', price: 44.9, image: null, bookCount: null },
  { id: 4, type: 'BOOK', title: 'O Nome do Vento', author: 'Patrick Rothfuss', description: 'A história de Kvothe, contada por ele mesmo.', category: 'Fantasia', price: 59.9, image: null, bookCount: null },
  { id: 5, type: 'BOOK', title: 'Orgulho e Preconceito', author: 'Jane Austen', description: 'Elizabeth Bennet e o enigmático Sr. Darcy.', category: 'Romance', price: 29.9, image: null, bookCount: null },
  { id: 6, type: 'BOOK', title: 'Jane Eyre', author: 'Charlotte Brontë', description: 'Uma jovem governanta e os segredos de Thornfield Hall.', category: 'Romance', price: 32.9, image: null, bookCount: null },
  { id: 7, type: 'BOOK', title: 'Duna', author: 'Frank Herbert', description: 'Política, religião e especiaria num planeta desértico.', category: 'Ficção científica', price: 59.9, image: null, bookCount: null },
  { id: 8, type: 'BOOK', title: 'Neuromancer', author: 'William Gibson', description: 'O livro que inaugurou o cyberpunk.', category: 'Ficção científica', price: 42.9, image: null, bookCount: null },
  { id: 9, type: 'BOOK', title: 'Assassinato no Expresso do Oriente', author: 'Agatha Christie', description: 'Hercule Poirot e um crime num trem parado pela neve.', category: 'Suspense', price: 36.9, image: null, bookCount: null },
  { id: 10, type: 'BOOK', title: 'A Garota no Trem', author: 'Paula Hawkins', description: 'Uma testemunha pouco confiável e um desaparecimento.', category: 'Suspense', price: 39.9, image: null, bookCount: null },
  { id: 11, type: 'KIT', title: 'Kit Terror', author: null, description: 'Dois livros de terror sorteados para você. A surpresa é revelada após a compra.', category: 'Terror', price: 59.9, image: null, bookCount: 2 },
  { id: 12, type: 'KIT', title: 'Kit Fantasia', author: null, description: 'Um livro de fantasia sorteado para você. A surpresa é revelada após a compra.', category: 'Fantasia', price: 39.9, image: null, bookCount: 1 },
  { id: 13, type: 'KIT', title: 'Kit Romance', author: null, description: 'Dois livros de romance sorteados para você. A surpresa é revelada após a compra.', category: 'Romance', price: 54.9, image: null, bookCount: 2 },
  { id: 14, type: 'KIT', title: 'Kit Suspense', author: null, description: 'Dois livros de suspense sorteados para você. A surpresa é revelada após a compra.', category: 'Suspense', price: 57.9, image: null, bookCount: 2 },
];

// Cria um store em memória a partir de uma lista inicial (fábrica, para poder
// criar um store isolado se for preciso). Os ids novos nunca reaproveitam o de
// um produto excluído (contador crescente, como a sequência do banco).
// Custos: all O(1); find, replace e remove O(n); insert O(1).
export function createCatalogStore(seed) {
  let products = seed.map((product) => ({ ...product }));
  let nextId = products.reduce((max, product) => Math.max(max, product.id), 0) + 1;

  return {
    // Referência à lista atual (não modifique: use insert, replace e remove).
    all() {
      return products;
    },

    find(id) {
      return products.find((product) => product.id === Number(id)) ?? null;
    },

    insert(data) {
      const created = { ...data, id: nextId };
      nextId += 1;
      products = [...products, created];
      return created;
    },

    // Troca os campos de um produto existente; devolve o novo objeto ou null.
    replace(id, changes) {
      const current = this.find(id);
      if (!current) return null;
      const updated = { ...current, ...changes, id: current.id };
      products = products.map((product) => (product.id === current.id ? updated : product));
      return updated;
    },

    // Devolve true se removeu, false se o id não existia.
    remove(id) {
      const before = products.length;
      products = products.filter((product) => product.id !== Number(id));
      return products.length < before;
    },
  };
}

export const mockCatalogStore = createCatalogStore(SEED);
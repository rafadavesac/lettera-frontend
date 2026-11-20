import { normalizeText } from '../../utils/text';

// Fonte de dados de exemplo, no mesmo formato do contrato da API.
// Permite desenvolver as telas sem o backend de produtos.
const PRODUCTS = [
  { id: 1, type: 'BOOK', title: 'O Iluminado', author: 'Stephen King', description: 'Uma família isolada num hotel de montanha durante o inverno.', category: 'Terror', price: 49.9, imageUrl: null, bookCount: null },
  { id: 2, type: 'BOOK', title: 'Drácula', author: 'Bram Stoker', description: 'O clássico do vampiro, contado em cartas e diários.', category: 'Terror', price: 34.9, imageUrl: null, bookCount: null },
  { id: 3, type: 'BOOK', title: 'O Hobbit', author: 'J.R.R. Tolkien', description: 'A aventura de Bilbo Bolseiro rumo à Montanha Solitária.', category: 'Fantasia', price: 44.9, imageUrl: null, bookCount: null },
  { id: 4, type: 'BOOK', title: 'O Nome do Vento', author: 'Patrick Rothfuss', description: 'A história de Kvothe, contada por ele mesmo.', category: 'Fantasia', price: 59.9, imageUrl: null, bookCount: null },
  { id: 5, type: 'BOOK', title: 'Orgulho e Preconceito', author: 'Jane Austen', description: 'Elizabeth Bennet e o enigmático Sr. Darcy.', category: 'Romance', price: 29.9, imageUrl: null, bookCount: null },
  { id: 6, type: 'BOOK', title: 'Jane Eyre', author: 'Charlotte Brontë', description: 'Uma jovem governanta e os segredos de Thornfield Hall.', category: 'Romance', price: 32.9, imageUrl: null, bookCount: null },
  { id: 7, type: 'BOOK', title: 'Duna', author: 'Frank Herbert', description: 'Política, religião e especiaria num planeta desértico.', category: 'Ficção científica', price: 59.9, imageUrl: null, bookCount: null },
  { id: 8, type: 'BOOK', title: 'Neuromancer', author: 'William Gibson', description: 'O livro que inaugurou o cyberpunk.', category: 'Ficção científica', price: 42.9, imageUrl: null, bookCount: null },
  { id: 9, type: 'BOOK', title: 'Assassinato no Expresso do Oriente', author: 'Agatha Christie', description: 'Hercule Poirot e um crime num trem parado pela neve.', category: 'Suspense', price: 36.9, imageUrl: null, bookCount: null },
  { id: 10, type: 'BOOK', title: 'A Garota no Trem', author: 'Paula Hawkins', description: 'Uma testemunha pouco confiável e um desaparecimento.', category: 'Suspense', price: 39.9, imageUrl: null, bookCount: null },
  { id: 11, type: 'KIT', title: 'Kit Terror', author: null, description: 'Dois livros de terror sorteados para você. A surpresa é revelada após a compra.', category: 'Terror', price: 59.9, imageUrl: null, bookCount: 2 },
  { id: 12, type: 'KIT', title: 'Kit Fantasia', author: null, description: 'Um livro de fantasia sorteado para você. A surpresa é revelada após a compra.', category: 'Fantasia', price: 39.9, imageUrl: null, bookCount: 1 },
  { id: 13, type: 'KIT', title: 'Kit Romance', author: null, description: 'Dois livros de romance sorteados para você. A surpresa é revelada após a compra.', category: 'Romance', price: 54.9, imageUrl: null, bookCount: 2 },
  { id: 14, type: 'KIT', title: 'Kit Suspense', author: null, description: 'Dois livros de suspense sorteados para você. A surpresa é revelada após a compra.', category: 'Suspense', price: 57.9, imageUrl: null, bookCount: 2 },
];

const FAKE_LATENCY_MS = 400; // simula a rede, para ver os estados de carregamento

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockProductSource = {
  // Filtra e pagina como o backend fará. Custo: O(n * m), com n produtos e
  // m o tamanho do título + autor (busca por texto); sem busca, O(n).
  async list({ category, type, search, page = 0, size = 50 } = {}) {
    await delay(FAKE_LATENCY_MS);
    const term = normalizeText(search);

    const filtered = PRODUCTS.filter(
      (p) =>
        (!category || p.category === category) &&
        (!type || p.type === type) &&
        (!term || normalizeText(`${p.title} ${p.author ?? ''}`).includes(term))
    );

    const start = page * size;
    return {
      content: filtered.slice(start, start + size),
      totalElements: filtered.length,
      totalPages: Math.ceil(filtered.length / size),
      number: page,
    };
  },

  // Custo: O(n) (busca linear); na API real é uma consulta por chave primária.
  async getById(id) {
    await delay(FAKE_LATENCY_MS);
    const found = PRODUCTS.find((p) => p.id === Number(id));
    if (!found) {
      // Mesmo formato de erro que o cliente HTTP devolve.
      throw { status: 404, isNetworkError: false, message: 'Produto não encontrado.' };
    }
    return found;
  },
};
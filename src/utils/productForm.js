// Regras do formulário de produto do vendedor: valores iniciais, conversão
// entre produto e campos da tela, leitura do preço e validação local.
// Funções puras, sem tela nem rede. Custo: O(1) por campo (textos curtos).
import { PRODUCT_TYPES } from '../services/products/productMapper';

export const MAX_KIT_BOOKS = 5; // limite de livros por kit no formulário
export const MAX_LENGTH = { title: 120, author: 80, description: 500 };

// Valores de um formulário novo. O preço é texto porque o usuário digita ("29,90").
export const EMPTY_FORM = {
  type: PRODUCT_TYPES.BOOK,
  title: '',
  author: '',
  description: '',
  category: null,
  price: '',
  bookCount: 1,
};

// Lê "29,90", "29.90", "R$ 29,90" ou "30" e devolve o número, ou null se o
// texto não for um preço válido (até 4 dígitos inteiros e 2 decimais).
export function parsePrice(text) {
  const clean = String(text ?? '').replace(/R\$/gi, '').replace(/\s/g, '');
  if (!/^\d{1,4}([.,]\d{1,2})?$/.test(clean)) return null;
  return Number(clean.replace(',', '.'));
}

// 29.9 -> "29,90" (formato digitado no campo ao editar).
export function formatPriceInput(value) {
  return Number(value).toFixed(2).replace('.', ',');
}

// Produto (já mapeado) -> valores dos campos do formulário de edição.
export function toFormValues(product) {
  return {
    type: product.type,
    title: product.title,
    author: product.author ?? '',
    description: product.description ?? '',
    category: product.category,
    price: formatPriceInput(product.price),
    bookCount: product.bookCount ?? 1,
  };
}

// Valida todos os campos e devolve { campo: mensagem } só para os que têm
// erro (objeto vazio = formulário válido). Autor só vale para livro e
// quantidade de livros só para kit. Custo: O(1).
export function validateProductForm(values) {
  const errors = {};
  const isKit = values.type === PRODUCT_TYPES.KIT;
  const title = values.title.trim();
  const author = values.author.trim();
  const description = values.description.trim();

  if (!title) errors.title = 'Informe o título.';
  else if (title.length > MAX_LENGTH.title) errors.title = `Use no máximo ${MAX_LENGTH.title} caracteres.`;

  if (!isKit) {
    if (!author) errors.author = 'Informe o autor.';
    else if (author.length > MAX_LENGTH.author) errors.author = `Use no máximo ${MAX_LENGTH.author} caracteres.`;
  }

  if (!description) errors.description = 'Descreva o produto.';
  else if (description.length > MAX_LENGTH.description) errors.description = `Use no máximo ${MAX_LENGTH.description} caracteres.`;

  if (!values.category) errors.category = 'Escolha uma categoria.';

  const price = parsePrice(values.price);
  if (!values.price.trim()) errors.price = 'Informe o preço.';
  else if (price === null) errors.price = 'Use um valor como 29,90.';
  else if (price <= 0) errors.price = 'O preço deve ser maior que zero.';

  if (isKit && !(Number.isInteger(values.bookCount) && values.bookCount >= 1 && values.bookCount <= MAX_KIT_BOOKS)) {
    errors.bookCount = `Escolha de 1 a ${MAX_KIT_BOOKS} livros.`;
  }

  return errors;
}
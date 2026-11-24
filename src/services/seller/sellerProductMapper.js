import { parsePrice } from '../../utils/productForm';
import { PRODUCT_TYPES } from '../products/productMapper';

export const CURRENCY = 'BRL'; // o app só vende em reais

// Valores do formulário -> corpo de POST/PUT /ws/products (contrato da API).
// É o único lugar que conhece o formato da requisição de escrita: se o
// contrato mudar, só este arquivo muda. A imagem NÃO vai aqui (upload à parte).
// Custo: O(1).
export function toProductRequest(values) {
  const isKit = values.type === PRODUCT_TYPES.KIT;
  return {
    type: values.type,
    title: values.title.trim(),
    author: isKit ? null : values.author.trim(),
    description: values.description.trim(),
    category: values.category,
    price: parsePrice(values.price),
    currency: CURRENCY,
    bookCount: isKit ? values.bookCount : null,
  };
}
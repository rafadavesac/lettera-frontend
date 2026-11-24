import { resolveImageUrl } from '../../utils/imageUrl';

export const PRODUCT_TYPES = { BOOK: 'BOOK', KIT: 'KIT' };

// Traduz o JSON do contrato da API para o formato que as telas e os cards usam.
// É o único lugar que conhece os nomes dos campos da API (se o contrato mudar,
// só este arquivo muda). Custo: O(1) por produto.
export function toProduct(dto) {
  return {
    id: dto.id,
    type: dto.type,
    isKit: dto.type === PRODUCT_TYPES.KIT,
    title: dto.title,
    author: dto.author ?? null,
    description: dto.description ?? '',
    category: dto.category,
    price: dto.price,
    imageUri: resolveImageUrl(dto.image),
    bookCount: dto.bookCount ?? null,
  };
}
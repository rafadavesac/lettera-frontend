import { toProduct } from '../products/productMapper';
import { toProductRequest } from './sellerProductMapper';
import { getImageFileError } from './uploadConfig';

// Serviço de escrita no catálogo (perfil vendedor), a partir de uma "fonte"
// (mock ou API): qualquer objeto com create, update, remove e uploadImage.
// Depende da abstração (inversão de dependência) e só monta a requisição e
// mapeia a resposta, com o mesmo mapper de produto que o comprador usa.
export function createSellerProductService(source) {
  return {
    // `values`: campos do formulário. Devolve o produto criado. Custo: O(1).
    async create(values) {
      return toProduct(await source.create(toProductRequest(values)));
    },

    async update(id, values) {
      return toProduct(await source.update(id, toProductRequest(values)));
    },

    async remove(id) {
      await source.remove(id);
    },

    // `file`: { uri, name, type, size }. Confere o arquivo antes de gastar
    // rede. Devolve o produto atualizado (com a nova imagem).
    async uploadImage(id, file) {
      const message = getImageFileError(file);
      if (message) throw { status: 400, isNetworkError: false, message };
      return toProduct(await source.uploadImage(id, file));
    },
  };
}
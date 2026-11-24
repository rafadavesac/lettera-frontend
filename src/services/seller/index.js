import { USE_MOCK_API } from '../../config/api';
import { mockCatalogStore } from '../products/mockCatalogStore';
import { createMockSellerProductSource } from './mockSellerProductSource';
import { apiSellerProductSource } from './apiSellerProductSource';
import { createSellerProductService } from './sellerProductService';

// Único ponto que escolhe a fonte de escrita do vendedor (mesma flag do
// catálogo). No mock, escreve no store compartilhado com o comprador.
export const sellerProductService = createSellerProductService(
  USE_MOCK_API ? createMockSellerProductSource({ store: mockCatalogStore }) : apiSellerProductSource
);
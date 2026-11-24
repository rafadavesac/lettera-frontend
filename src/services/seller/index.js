import { USE_MOCK_API } from '../../config/api';
import { mockCatalogStore } from '../products/mockCatalogStore';
import { createMockSellerProductSource } from './mockSellerProductSource';
import { apiSellerProductSource } from './apiSellerProductSource';
import { createSellerProductService } from './sellerProductService';
import { mockSalesSource } from './mockSalesSource';
import { apiSalesSource } from './apiSalesSource';
import { createSalesService } from './salesService';

// Único ponto que escolhe a fonte de dados do vendedor (mesma flag do
// catálogo). No mock, a escrita usa o store compartilhado com o comprador.
export const sellerProductService = createSellerProductService(
  USE_MOCK_API ? createMockSellerProductSource({ store: mockCatalogStore }) : apiSellerProductSource
);

export const salesService = createSalesService(USE_MOCK_API ? mockSalesSource : apiSalesSource);
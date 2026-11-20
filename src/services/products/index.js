import { USE_MOCK_API } from '../../config/api';
import { mockProductSource } from './mockProductSource';
import { apiProductSource } from './apiProductSource';
import { createProductService } from './productService';

// Único ponto que escolhe a fonte de dados.
export const productService = createProductService(
  USE_MOCK_API ? mockProductSource : apiProductSource
);

export { categoryService } from './categoryService';
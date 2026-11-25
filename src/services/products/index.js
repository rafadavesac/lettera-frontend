import { USE_MOCK_API } from '../../config/api';
import { mockProductSource } from './mockProductSource';
import { apiProductSource } from './apiProductSource';
import { createProductService } from './productService';
import { mockCategorySource } from './mockCategorySource';
import { apiCategorySource } from './apiCategorySource';
import { createCategoryService } from './categoryService';

// Único ponto que escolhe a fonte de dados.
export const productService = createProductService(
  USE_MOCK_API ? mockProductSource : apiProductSource
);

export const categoryService = createCategoryService(
  USE_MOCK_API ? mockCategorySource : apiCategorySource
);
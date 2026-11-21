import { USE_MOCK_API } from '../../config/api';
import { productService } from '../products';
import { createMockOrderSource } from './mockOrderSource';
import { apiOrderSource } from './apiOrderSource';
import { createOrderService } from './orderService';

// Único ponto que escolhe a fonte de pedidos (mesma flag do catálogo).
export const orderService = createOrderService(
  USE_MOCK_API ? createMockOrderSource({ catalog: productService }) : apiOrderSource
);
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from './routes';
import OrdersScreen from '../screens/buyer/OrdersScreen';
import OrderDetailScreen from '../screens/buyer/OrderDetailScreen';

const Stack = createNativeStackNavigator();

// Pilha da aba Pedidos: histórico de compras -> Detalhe do pedido.
export default function OrdersStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ROUTES.ORDERS} component={OrdersScreen} />
      <Stack.Screen name={ROUTES.ORDER_DETAIL} component={OrderDetailScreen} />
    </Stack.Navigator>
  );
}
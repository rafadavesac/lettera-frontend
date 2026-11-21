import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from './routes';
import CartScreen from '../screens/buyer/CartScreen';
import OrderSummaryScreen from '../screens/buyer/OrderSummaryScreen';
import OrderConfirmedScreen from '../screens/buyer/OrderConfirmedScreen';

const Stack = createNativeStackNavigator();

// Pilha da aba Carrinho: Carrinho -> Resumo do pedido -> Pedido confirmado.
// Na confirmação o gesto de voltar fica desligado: o pedido já foi feito.
export default function CartStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ROUTES.CART} component={CartScreen} />
      <Stack.Screen name={ROUTES.ORDER_SUMMARY} component={OrderSummaryScreen} />
      <Stack.Screen
        name={ROUTES.ORDER_CONFIRMED}
        component={OrderConfirmedScreen}
        options={{ gestureEnabled: false }}
      />
    </Stack.Navigator>
  );
}
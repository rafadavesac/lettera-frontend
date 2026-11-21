import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from './routes';
import CartScreen from '../screens/buyer/CartScreen';

const Stack = createNativeStackNavigator();

// Pilha da aba Carrinho. Por enquanto só o Carrinho; o resumo do pedido e a
// confirmação entram nos próximos passos.
export default function CartStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ROUTES.CART} component={CartScreen} />
    </Stack.Navigator>
  );
}
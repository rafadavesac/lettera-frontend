import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from './routes';
import MyProductsScreen from '../screens/seller/MyProductsScreen';

const Stack = createNativeStackNavigator();

// Pilha da aba Meus produtos: lista -> Formulário de produto (passo seguinte).
export default function SellerProductsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ROUTES.MY_PRODUCTS} component={MyProductsScreen} />
    </Stack.Navigator>
  );
}
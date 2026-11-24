import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from './routes';
import MyProductsScreen from '../screens/seller/MyProductsScreen';
import ProductFormScreen from '../screens/seller/ProductFormScreen';

const Stack = createNativeStackNavigator();

// Pilha da aba Meus produtos: lista -> Formulário de produto (novo ou editar).
export default function SellerProductsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ROUTES.MY_PRODUCTS} component={MyProductsScreen} />
      <Stack.Screen name={ROUTES.PRODUCT_FORM} component={ProductFormScreen} />
    </Stack.Navigator>
  );
}
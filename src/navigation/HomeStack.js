import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from './routes';
import HomeScreen from '../screens/buyer/HomeScreen';
import CategoryResultsScreen from '../screens/buyer/CategoryResultsScreen';
import BookDetailScreen from '../screens/buyer/BookDetailScreen';
import KitDetailScreen from '../screens/buyer/KitDetailScreen';

const Stack = createNativeStackNavigator();

// Pilha da aba Início: Início -> Resultados por categoria -> Detalhe.
// Sem cabeçalho nativo: cada tela usa o componente Header (com botão de voltar).
export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ROUTES.HOME} component={HomeScreen} />
      <Stack.Screen name={ROUTES.CATEGORY_RESULTS} component={CategoryResultsScreen} />
      <Stack.Screen name={ROUTES.BOOK_DETAIL} component={BookDetailScreen} />
      <Stack.Screen name={ROUTES.KIT_DETAIL} component={KitDetailScreen} />
    </Stack.Navigator>
  );
}
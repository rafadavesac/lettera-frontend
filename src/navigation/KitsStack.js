import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from './routes';
import KitsScreen from '../screens/buyer/KitsScreen';
import KitDetailScreen from '../screens/buyer/KitDetailScreen';

const Stack = createNativeStackNavigator();

// Pilha da aba Kits: lista de kits -> Detalhe do kit.
export default function KitsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ROUTES.KITS} component={KitsScreen} />
      <Stack.Screen name={ROUTES.KIT_DETAIL} component={KitDetailScreen} />
    </Stack.Navigator>
  );
}
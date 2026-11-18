import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../hooks/useAuth';
import { isSeller } from '../utils/roles';
import LoginScreen from '../screens/auth/LoginScreen';
import BuyerTabs from './BuyerTabs';
import SellerTabs from './SellerTabs';

const Stack = createNativeStackNavigator();

// Escolhe o conjunto de telas pelo perfil do usuário. Custo O(1): é só uma comparação.
// Perfil novo = um novo ramo aqui, sem mexer nas abas existentes (aberto/fechado).
export default function RootNavigator() {
  const { user } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : isSeller(user) ? (
        <Stack.Screen name="SellerTabs" component={SellerTabs} />
      ) : (
        <Stack.Screen name="BuyerTabs" component={BuyerTabs} />
      )}
    </Stack.Navigator>
  );
}
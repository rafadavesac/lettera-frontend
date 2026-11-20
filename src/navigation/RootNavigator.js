import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../hooks/useAuth';
import { isSeller } from '../utils/roles';
import { theme } from '../theme';
import LoginScreen from '../screens/auth/LoginScreen';
import BuyerTabs from './BuyerTabs';
import SellerTabs from './SellerTabs';
import SignUpScreen from '../screens/auth/SignUpScreen';

const Stack = createNativeStackNavigator();

// Escolhe o conjunto de telas pelo perfil do usuário. Custo O(1): é só uma comparação.
// Perfil novo = um novo ramo aqui, sem mexer nas abas existentes (aberto/fechado).
export default function RootNavigator() {
  const { user, isLoading } = useAuth();

  // Enquanto o app confere se há sessão salva, mostra só um indicador de carregamento.
  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
        </>
      ) : isSeller(user) ? (
        <Stack.Screen name="SellerTabs" component={SellerTabs} />
      ) : (
        <Stack.Screen name="BuyerTabs" component={BuyerTabs} />
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
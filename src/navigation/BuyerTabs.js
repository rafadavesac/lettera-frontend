import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { baseTabOptions } from './tabOptions';
import HomeScreen from '../screens/buyer/HomeScreen';
import KitsScreen from '../screens/buyer/KitsScreen';
import CartScreen from '../screens/buyer/CartScreen';
import OrdersScreen from '../screens/buyer/OrdersScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const ICONS = {
  Home: 'home-outline',
  Kits: 'gift-outline',
  Cart: 'cart-outline',
  Orders: 'receipt-outline',
  Profile: 'person-outline',
};

export default function BuyerTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        ...baseTabOptions,
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={ICONS[route.name]} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Início' }} />
      <Tab.Screen name="Kits" component={KitsScreen} options={{ title: 'Kits' }} />
      <Tab.Screen name="Cart" component={CartScreen} options={{ title: 'Carrinho' }} />
      <Tab.Screen name="Orders" component={OrdersScreen} options={{ title: 'Pedidos' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Perfil' }} />
    </Tab.Navigator>
  );
}
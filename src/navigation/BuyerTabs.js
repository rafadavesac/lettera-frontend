import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { baseTabOptions } from './tabOptions';
import { useCart } from '../hooks/useCart';
import HomeStack from './HomeStack';
import KitsStack from './KitsStack';
import CartStack from './CartStack';
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
  const { itemCount } = useCart();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        ...baseTabOptions,
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={ICONS[route.name]} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} options={{ title: 'Início' }} />
      <Tab.Screen name="Kits" component={KitsStack} options={{ title: 'Kits' }} />
      <Tab.Screen
        name="Cart"
        component={CartStack}
        options={{ title: 'Carrinho', tabBarBadge: itemCount > 0 ? itemCount : undefined }}
      />
      <Tab.Screen name="Orders" component={OrdersScreen} options={{ title: 'Pedidos' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Perfil' }} />
    </Tab.Navigator>
  );
}
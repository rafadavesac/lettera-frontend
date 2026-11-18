import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { baseTabOptions } from './tabOptions';
import MyProductsScreen from '../screens/seller/MyProductsScreen';
import SalesScreen from '../screens/seller/SalesScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const ICONS = {
  MyProducts: 'library-outline',
  Sales: 'cash-outline',
  Profile: 'person-outline',
};

export default function SellerTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        ...baseTabOptions,
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={ICONS[route.name]} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="MyProducts" component={MyProductsScreen} options={{ title: 'Meus produtos' }} />
      <Tab.Screen name="Sales" component={SalesScreen} options={{ title: 'Vendas' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Perfil' }} />
    </Tab.Navigator>
  );
}
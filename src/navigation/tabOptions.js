import { theme } from '../theme';

// Estilo comum às abas do comprador e do vendedor.
export const baseTabOptions = {
  headerShown: false,
  tabBarActiveTintColor: theme.colors.primary,
  tabBarInactiveTintColor: theme.colors.textMuted,
  tabBarStyle: {
    backgroundColor: theme.colors.surface,
    borderTopColor: theme.colors.border,
  },
  tabBarLabelStyle: {
    fontFamily: theme.fonts.bodyMedium,
    fontSize: theme.fontSizes.caption,
  },
};
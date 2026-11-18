import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { USER_TYPES } from '../../utils/roles';
import { theme } from '../../theme';

// PROVISÓRIO: usuários de teste. Será removido quando o login real chegar (chat 2).
const MOCK_BUYER = { name: 'Leitora Teste', email: 'leitora@teste.dev', type: USER_TYPES.BUYER };
const MOCK_SELLER = { name: 'Vendedor Lettera', email: 'admin@admin.dev', type: USER_TYPES.SELLER };

export default function LoginScreen() {
  const { signIn } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lettera</Text>
      <Text style={styles.subtitle}>Login de teste (provisório)</Text>

      <Pressable style={styles.button} onPress={() => signIn(MOCK_BUYER)}>
        <Text style={styles.buttonText}>Entrar como comprador</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={() => signIn(MOCK_SELLER)}>
        <Text style={styles.buttonText}>Entrar como vendedor</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.layout.screenPadding,
  },
  title: {
    fontFamily: theme.fonts.title,
    fontSize: theme.fontSizes.headline,
    color: theme.colors.primary,
  },
  subtitle: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes.body,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xl,
  },
  button: {
    alignSelf: 'stretch',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.field,
    paddingVertical: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  buttonText: {
    fontFamily: theme.fonts.bodySemiBold,
    fontSize: theme.fontSizes.body,
    color: theme.colors.surface,
  },
});
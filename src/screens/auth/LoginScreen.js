import { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { isValidEmail } from '../../utils/validators';
import { theme } from '../../theme';
import Button from '../../components/Button';
import TextField from '../../components/TextField';
import ErrorBanner from '../../components/ErrorBanner';
import Logo from '../../components/Logo';

export default function LoginScreen({ navigation }) {
  const { signIn } = useAuth();
  const passwordRef = useRef(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Validação local antes de chamar a API: O(1).
  function validate() {
    if (!email.trim() || !password) return 'Preencha e-mail e senha.';
    if (!isValidEmail(email)) return 'Digite um e-mail válido.';
    return null;
  }

  async function handleSubmit() {
    if (submitting) return; // evita toque duplo enviar duas requisições

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      await signIn(email, password);
      // Sucesso: o RootNavigator troca de tela sozinho quando "user" muda.
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Logo width={240} style={styles.logo} />
        <Text style={styles.subtitle}>Entre na sua conta</Text>

        <ErrorBanner message={error} />

        <TextField
          label="E-mail"
          placeholder="voce@email.com"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
          editable={!submitting}
          style={styles.field}
        />
        <TextField
          ref={passwordRef}
          label="Senha"
          placeholder="Sua senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
          editable={!submitting}
          style={styles.field}
        />

        <Button
          title="Entrar"
          onPress={handleSubmit}
          loading={submitting}
          style={styles.submit}
        />

        <Pressable
          style={styles.link}
          onPress={() => navigation.navigate('SignUp')}
          disabled={submitting}
        >
          <Text style={styles.linkText}>Não tem conta? Cadastre-se</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.layout.screenPadding,
  },
  logo: {
    marginBottom: theme.spacing.lg,
  },
  subtitle: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes.body,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xl,
  },
  field: {
    marginBottom: theme.spacing.md,
  },
  submit: {
    marginTop: theme.spacing.sm,
  },
  link: {
    alignItems: 'center',
    marginTop: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },
  linkText: {
    fontFamily: theme.fonts.bodySemiBold,
    fontSize: theme.fontSizes.body,
    color: theme.colors.primary,
  },
});
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
import { isValidEmail, isValidPassword, MIN_PASSWORD_LENGTH } from '../../utils/validators';
import { theme } from '../../theme';
import Button from '../../components/Button';
import TextField from '../../components/TextField';
import ErrorBanner from '../../components/ErrorBanner';

export default function SignUpScreen({ navigation }) {
  const { signUp } = useAuth();
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmRef = useRef(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Validação local antes de chamar a API: O(1).
  function validate() {
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      return 'Preencha todos os campos.';
    }
    if (!isValidEmail(email)) return 'Digite um e-mail válido.';
    if (!isValidPassword(password)) {
      return `A senha deve ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`;
    }
    if (password !== confirmPassword) return 'As senhas não coincidem.';
    return null;
  }

  async function handleSubmit() {
    if (submitting) return;

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      await signUp(name, email, password);
      // Sucesso: o signUp já fez o login; o RootNavigator troca para as abas sozinho.
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
        <Text style={styles.title}>Criar conta</Text>
        <Text style={styles.subtitle}>Descubra seu próximo livro</Text>

        <ErrorBanner message={error} />

        <TextField
          label="Nome"
          placeholder="Seu nome"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          returnKeyType="next"
          onSubmitEditing={() => emailRef.current?.focus()}
          editable={!submitting}
          style={styles.field}
        />
        <TextField
          ref={emailRef}
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
          placeholder="Mínimo de caracteres exigido"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          returnKeyType="next"
          onSubmitEditing={() => confirmRef.current?.focus()}
          editable={!submitting}
          style={styles.field}
        />
        <TextField
          ref={confirmRef}
          label="Confirmar senha"
          placeholder="Repita a senha"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
          editable={!submitting}
          style={styles.field}
        />

        <Button
          title="Cadastrar"
          onPress={handleSubmit}
          loading={submitting}
          style={styles.submit}
        />

        <Pressable
          style={styles.link}
          onPress={() => navigation.goBack()}
          disabled={submitting}
        >
          <Text style={styles.linkText}>Já tem conta? Entrar</Text>
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
  title: {
    fontFamily: theme.fonts.title,
    fontSize: theme.fontSizes.headline,
    color: theme.colors.primary,
    textAlign: 'center',
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
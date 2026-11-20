import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';

const { colors, fonts, fontSizes, radius, spacing } = theme;

// Faixa de erro de formulário/tela. Sem mensagem, não renderiza nada,
// então quem usa não precisa do "{error && ...}" (responsabilidade única).
// Custo de renderização: O(1).
export default function ErrorBanner({ message, style }) {
  if (!message) return null;

  return (
    <View accessibilityRole="alert" style={[styles.box, style]}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: colors.surface,
    borderColor: colors.error,
    borderWidth: 1,
    borderRadius: radius.field,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  text: {
    fontFamily: fonts.body,
    fontSize: fontSizes.body,
    color: colors.error,
  },
});
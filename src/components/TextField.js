import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { theme } from '../theme';

const { colors, fonts, fontSizes, radius, spacing } = theme;

// Campo de texto com rótulo e mensagem de erro.
// Qualquer prop extra (secureTextEntry, keyboardType, autoCapitalize, placeholder...)
// é repassada ao TextInput via ...inputProps, então o componente não precisa
// conhecer cada caso de uso (Open/Closed).
// Custo de renderização: O(1).
export default function TextField({
  label,
  value,
  onChangeText,
  error,
  style,
  ...inputProps
}) {
  const [focused, setFocused] = useState(false);

  // Prioridade da cor da borda: erro > foco > padrão
  const borderColor = error
    ? colors.error
    : focused
      ? colors.primary
      : colors.border;

  return (
    <View style={[styles.container, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <TextInput
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholderTextColor={colors.textMuted}
        accessibilityLabel={label}
        style={[styles.input, { borderColor }]}
        {...inputProps}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  label: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.body,
    color: colors.text,
  },
  input: {
    minHeight: 48,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.field,
    borderWidth: 1.5,
    backgroundColor: colors.surface,
    fontFamily: fonts.body,
    fontSize: fontSizes.bodyLarge,
    color: colors.text,
  },
  error: {
    fontFamily: fonts.body,
    fontSize: fontSizes.caption,
    color: colors.error,
  },
});
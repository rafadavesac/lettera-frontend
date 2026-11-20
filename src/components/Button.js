import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { theme } from '../theme';

const { colors, fonts, fontSizes, radius, spacing } = theme;
// Cada variante é só dados (cores). Para criar uma nova (ex.: "danger"),
// basta adicionar uma entrada aqui, sem mexer na lógica do componente (Open/Closed).
const VARIANTS = {
  primary: {
    background: colors.primary,
    pressed: colors.primaryDark,
    text: colors.surface,
    border: colors.primary,
  },
  secondary: {
    background: 'transparent',
    pressed: colors.accentGoldLight,
    text: colors.primary,
    border: colors.primary,
  },
  danger: {
    background: colors.error,
    pressed: colors.errorDark,
    text: colors.surface,
    border: colors.error,
  },
};

// Custo de renderização: O(1), o componente não percorre listas.
export default function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
}) {
  const palette = VARIANTS[variant] ?? VARIANTS.primary;
  const isInactive = disabled || loading; // durante o carregamento, bloqueia toques repetidos

  return (
    <Pressable
      onPress={onPress}
      disabled={isInactive}
      accessibilityRole="button"
      accessibilityState={{ disabled: isInactive, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: pressed ? palette.pressed : palette.background,
          borderColor: palette.border,
        },
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={palette.text} />
      ) : (
        <Text style={[styles.label, { color: palette.text }]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.field,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSizes.bodyLarge,
  },
  disabled: {
    opacity: 0.4,
  },
});
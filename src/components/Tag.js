import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';

const { colors, fonts, fontSizes, radius, spacing } = theme;

// Cada variante é só dados (cores), como no Button: para criar outra
// (ex.: "success"), basta adicionar uma entrada aqui (Open/Closed).
const VARIANTS = {
  gold: {
    background: colors.accentGoldLight,
    text: colors.primaryDark,
  },
  primary: {
    background: colors.primary,
    text: colors.surface,
  },
  neutral: {
    background: colors.border,
    text: colors.textMuted,
  },
};

// Etiqueta de apenas exibição.
// Custo de renderização: O(1).
export default function Tag({ label, variant = 'gold', style }) {
  const palette = VARIANTS[variant] ?? VARIANTS.gold;

  return (
    <View style={[styles.base, { backgroundColor: palette.background }, style]}>
      <Text style={[styles.label, { color: palette.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start', // não estica na largura do pai
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
  label: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSizes.caption,
  },
});
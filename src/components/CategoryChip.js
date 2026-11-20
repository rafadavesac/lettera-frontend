import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { theme } from '../theme';

const { colors, fonts, fontSizes, radius, spacing } = theme;

// Chip de filtro. É "controlado": a tela passa `selected` e recebe o toque em
// `onPress`, então o componente não guarda estado próprio (responsabilidade única).
// Custo de renderização: O(1).
export default function CategoryChip({ label, selected = false, onPress, style }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={({ pressed }) => [
        styles.base,
        selected ? styles.selected : styles.unselected,
        pressed && styles.pressed,
        style,
      ]}
    >
      <Text style={[styles.label, selected ? styles.labelSelected : styles.labelUnselected]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 36,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  unselected: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  pressed: {
    opacity: 0.7,
  },
  label: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.body,
  },
  labelSelected: {
    color: colors.surface,
  },
  labelUnselected: {
    color: colors.text,
  },
});
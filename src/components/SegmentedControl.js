import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';

const { colors, fonts, fontSizes, radius, spacing } = theme;

// Alternador de opções exclusivas (ex.: Livro | Kit). Controlado: a tela
// guarda o valor. Recebe `options` como [{ value, label }], então serve para
// qualquer par ou trio de opções.
// Custo de renderização: O(n) no número de opções (aqui, 2 ou 3).
export default function SegmentedControl({ options, value, onChange, style }) {
  return (
    <View accessibilityRole="tablist" style={[styles.container, style]}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            style={[styles.segment, selected && styles.segmentSelected]}
          >
            <Text style={[styles.label, selected && styles.labelSelected]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: spacing.xs,
    borderRadius: radius.field,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  segment: {
    flex: 1,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.field - spacing.xs,
  },
  segmentSelected: {
    backgroundColor: colors.primary,
  },
  label: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.body,
    color: colors.text,
  },
  labelSelected: {
    color: colors.surface,
  },
});
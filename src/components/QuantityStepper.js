import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

const { colors, fonts, fontSizes, radius, spacing } = theme;

// Seletor de quantidade (- 1 +). Controlado: a tela guarda o valor.
// O "-" fica desabilitado no mínimo, e o "+" no máximo (se `max` for passado).
// Custo de renderização: O(1).
export default function QuantityStepper({ value, onChange, min = 1, max, style }) {
  const canDecrease = value > min;
  const canIncrease = max === undefined || value < max;

  return (
    <View style={[styles.container, style]}>
      <StepButton
        icon="remove"
        label="Diminuir quantidade"
        disabled={!canDecrease}
        onPress={() => onChange(value - 1)}
      />
      <Text style={styles.value} accessibilityLabel={`Quantidade: ${value}`}>
        {value}
      </Text>
      <StepButton
        icon="add"
        label="Aumentar quantidade"
        disabled={!canIncrease}
        onPress={() => onChange(value + 1)}
      />
    </View>
  );
}

// Botão interno, usado só aqui, para não repetir o Pressable duas vezes.
function StepButton({ icon, label, disabled, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      hitSlop={6}
      style={[styles.stepButton, disabled && styles.stepDisabled]}
    >
      <Ionicons name={icon} size={18} color={colors.primary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  stepButton: {
    width: 32,
    height: 32,
    borderRadius: radius.field,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDisabled: {
    opacity: 0.4,
  },
  value: {
    minWidth: 20,
    textAlign: 'center',
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSizes.bodyLarge,
    color: colors.text,
  },
});
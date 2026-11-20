import React from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

const { colors, fonts, fontSizes, radius, spacing } = theme;

// Campo de busca controlado. Props extras (autoFocus, onSubmitEditing...)
// vão direto ao TextInput via ...inputProps (Open/Closed).
// O botão de limpar só existe quando há texto.
// Custo de renderização: O(1).
export default function SearchBar({
  value,
  onChangeText,
  placeholder = 'Buscar livros ou autores',
  style,
  ...inputProps
}) {
  const hasText = value.length > 0;

  return (
    <View style={[styles.container, style]}>
      <Ionicons name="search-outline" size={20} color={colors.textMuted} />

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        accessibilityLabel={placeholder}
        returnKeyType="search"
        autoCorrect={false}
        style={styles.input}
        {...inputProps}
      />

      {hasText ? (
        <Pressable
          onPress={() => onChangeText('')}
          accessibilityRole="button"
          accessibilityLabel="Limpar busca"
          hitSlop={8}
        >
          <Ionicons name="close-circle" size={20} color={colors.textMuted} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    borderRadius: radius.field,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  input: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: fontSizes.bodyLarge,
    color: colors.text,
  },
});
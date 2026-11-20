import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../theme';

const { colors, fonts, fontSizes, layout, spacing } = theme;

// Cabeçalho de telas de detalhe. O botão voltar só aparece se `onBack` for
// passado, e `right` aceita qualquer elemento (ex.: botão de excluir).
// Não conhece a navegação: a tela decide o que "voltar" significa.
// Custo de renderização: O(1).
export default function Header({ title, onBack, right, style }) {
  const insets = useSafeAreaInsets(); // evita o título ficar sob o relógio/notch

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.sm }, style]}>
      <View style={styles.side}>
        {onBack ? (
          <Pressable
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            hitSlop={12}
          >
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
          </Pressable>
        ) : null}
      </View>

      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      <View style={[styles.side, styles.sideRight]}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: layout.screenPadding,
    paddingBottom: spacing.md,
    backgroundColor: colors.background,
  },
  side: {
    width: 40, // largura igual nos dois lados mantém o título centralizado
  },
  sideRight: {
    alignItems: 'flex-end',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontFamily: fonts.title,
    fontSize: fontSizes.subtitle,
    color: colors.text,
  },
});
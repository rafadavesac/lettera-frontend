import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import Button from './Button';

const { colors, fonts, fontSizes, spacing } = theme;

// Estado de lista/tela vazia. Ícone e ação são opcionais, então o mesmo
// componente serve para carrinho vazio, sem pedidos, busca sem resultado etc.
// Reaproveita o Button em vez de recriar um botão (reutilização).
// Custo de renderização: O(1).
export default function EmptyState({
  icon = 'book-outline',
  title,
  message,
  actionLabel,
  onAction,
  style,
}) {
  return (
    <View style={[styles.container, style]}>
      {icon ? (
        <Ionicons name={icon} size={56} color={colors.accentGold} />
      ) : null}

      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}

      {actionLabel && onAction ? (
        <Button
          title={actionLabel}
          onPress={onAction}
          style={styles.action}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.xxl,
    gap: spacing.sm,
  },
  title: {
    fontFamily: fonts.title,
    fontSize: fontSizes.subtitle,
    color: colors.text,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  message: {
    fontFamily: fonts.body,
    fontSize: fontSizes.body,
    color: colors.textMuted,
    textAlign: 'center',
  },
  action: {
    marginTop: spacing.lg,
    alignSelf: 'stretch',
  },
});
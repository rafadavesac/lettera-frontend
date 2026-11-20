import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';
import { formatPrice } from '../utils/format';
import Button from './Button';
import EmptyState from './EmptyState';
import Header from './Header';

const { colors, fonts, fontSizes, layout, spacing } = theme;

// Esqueleto das telas de detalhe de produto: cabeçalho com voltar, estados de
// carregamento e erro, conteúdo rolável (children) e rodapé fixo com preço e
// ação. Quem usa só informa o conteúdo; livro e kit compartilham o mesmo
// esqueleto (reutilização). Custo de renderização: O(1) além dos children.
export default function DetailScaffold({
  title,
  onBack,
  loading,
  error,
  onRetry,
  price,
  actionLabel,
  onAction,
  children,
}) {
  const renderBody = () => {
    if (loading) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }

    if (error) {
      return (
        <EmptyState
          icon="cloud-offline-outline"
          title="Não foi possível carregar"
          message={error}
          actionLabel="Tentar novamente"
          onAction={onRetry}
        />
      );
    }

    return (
      <>
        <ScrollView contentContainerStyle={styles.content}>{children}</ScrollView>

        <View style={styles.footer}>
          <View>
            <Text style={styles.priceLabel}>Preço</Text>
            <Text style={styles.price}>{formatPrice(price)}</Text>
          </View>
          <Button title={actionLabel} onPress={onAction} style={styles.action} />
        </View>
      </>
    );
  };

  return (
    <View style={styles.screen}>
      <Header title={title} onBack={onBack} />
      {renderBody()}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: layout.screenPadding,
    paddingBottom: spacing.xl,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    paddingHorizontal: layout.screenPadding,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  priceLabel: {
    fontFamily: fonts.body,
    fontSize: fontSizes.caption,
    color: colors.textMuted,
  },
  price: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSizes.title,
    color: colors.primary,
  },
  action: {
    flex: 1,
  },
});
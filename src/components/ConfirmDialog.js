import React from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';
import Button from './Button';

const { colors, fonts, fontSizes, radius, shadows, spacing } = theme;

// Diálogo de confirmação (ex.: excluir produto). Controlado por `visible`.
// `destructive` pinta o botão de confirmar de vermelho. Reaproveita o Button.
// O botão "voltar" do Android fecha o diálogo (onRequestClose = cancelar).
// Custo de renderização: O(1).
export default function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  destructive = false,
  loading = false,
  onConfirm,
  onCancel,
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <View style={styles.dialog}>
          <Text style={styles.title}>{title}</Text>
          {message ? <Text style={styles.message}>{message}</Text> : null}

          <View style={styles.actions}>
            <Button
              title={cancelLabel}
              variant="secondary"
              onPress={onCancel}
              disabled={loading}
              style={styles.action}
            />
            <Button
              title={confirmLabel}
              variant={destructive ? 'danger' : 'primary'}
              onPress={onConfirm}
              loading={loading}
              style={styles.action}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.xl,
    backgroundColor: 'rgba(22, 38, 79, 0.5)', // primaryDark translúcido
  },
  dialog: {
    gap: spacing.md,
    padding: spacing.xl,
    borderRadius: radius.card,
    backgroundColor: colors.surface,
    ...shadows.soft,
  },
  title: {
    fontFamily: fonts.title,
    fontSize: fontSizes.subtitle,
    color: colors.text,
  },
  message: {
    fontFamily: fonts.body,
    fontSize: fontSizes.body,
    color: colors.textMuted,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  action: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
});
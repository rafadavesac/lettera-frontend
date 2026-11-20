import React from 'react';
import { Image, Pressable, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

const { colors, fonts, fontSizes, radius, spacing } = theme;

// Caixa de imagem do formulário do vendedor. Só exibe (a imagem escolhida ou
// um convite para adicionar) e avisa o toque em `onPress`. Quem abre a galeria
// e envia o arquivo é a tela (responsabilidade única).
// Custo de renderização: O(1).
export default function ImageUploadBox({ uri, onPress, error, style }) {
  return (
    <>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={uri ? 'Trocar imagem' : 'Adicionar imagem'}
        style={[styles.box, error && styles.boxError, style]}
      >
        {uri ? (
          <Image source={{ uri }} style={styles.image} resizeMode="cover" />
        ) : (
          <>
            <Ionicons name="camera-outline" size={32} color={colors.accentGold} />
            <Text style={styles.hint}>Adicionar imagem</Text>
          </>
        )}
      </Pressable>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </>
  );
}

const styles = StyleSheet.create({
  box: {
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    overflow: 'hidden',
    borderRadius: radius.card,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  boxError: {
    borderColor: colors.error,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  hint: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.body,
    color: colors.textMuted,
  },
  error: {
    marginTop: spacing.xs,
    fontFamily: fonts.body,
    fontSize: fontSizes.caption,
    color: colors.error,
  },
});
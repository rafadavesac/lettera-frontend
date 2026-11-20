import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { formatPrice } from '../utils/format';
import CoverImage from './CoverImage';
import Tag from './Tag';

const { colors, fonts, fontSizes, radius, shadows, spacing } = theme;

// Linha da lista "Meus produtos" do vendedor. Tocar na linha edita; a lixeira
// pede a exclusão (a confirmação é do ConfirmDialog, na tela). A Tag diferencia
// livro de kit.
// Custo de renderização: O(1) por linha; uma lista de n produtos custa O(n).
export default function SellerProductRow({
  title,
  subtitle,
  price,
  imageUri,
  isKit = false,
  onPress,
  onDelete,
  style,
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Editar ${title}`}
      style={({ pressed }) => [styles.row, pressed && styles.pressed, style]}
    >
      <CoverImage
        uri={imageUri}
        placeholderIcon={isKit ? 'gift' : 'book'}
        style={styles.cover}
      />

      <View style={styles.info}>
        <Tag label={isKit ? 'Kit' : 'Livro'} variant="neutral" />
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
        <Text style={styles.price}>{formatPrice(price)}</Text>
      </View>

      <Pressable
        onPress={onDelete}
        accessibilityRole="button"
        accessibilityLabel={`Excluir ${title}`}
        hitSlop={8}
        style={styles.delete}
      >
        <Ionicons name="trash-outline" size={20} color={colors.error} />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    ...shadows.soft,
  },
  pressed: {
    opacity: 0.85,
  },
  cover: {
    width: 72,
    height: 104,
  },
  info: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    fontFamily: fonts.title,
    fontSize: fontSizes.bodyLarge,
    color: colors.text,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: fontSizes.body,
    color: colors.textMuted,
  },
  price: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSizes.bodyLarge,
    color: colors.primary,
    marginTop: 'auto',
  },
  delete: {
    alignSelf: 'flex-start',
  },
});
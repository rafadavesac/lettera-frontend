import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';

const { colors, fonts, fontSizes, layout, spacing } = theme;

const Separator = () => <View style={styles.separator} />;

// Seção com título e lista horizontal. Quem usa define como cada item aparece
// (renderItem), então serve para livros, kits ou qualquer outro card.
// Sem itens, não renderiza nada. Custo: a FlatList desenha só os itens
// visíveis, então O(v) por tela, com v itens visíveis.
export default function Shelf({ title, data, renderItem, style }) {
  if (!data.length) return null;

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>
      <FlatList
        horizontal
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.id)}
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={Separator}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.xl,
  },
  title: {
    fontFamily: fonts.title,
    fontSize: fontSizes.subtitle,
    color: colors.text,
    paddingHorizontal: layout.screenPadding,
    marginBottom: spacing.md,
  },
  list: {
    paddingHorizontal: layout.screenPadding,
    paddingVertical: spacing.xs, // folga para a sombra dos cards não ser cortada
  },
  separator: {
    width: spacing.md,
  },
});
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import Button from './Button';
import DrawnBookRow from './DrawnBookRow';
import FadeInView from './FadeInView';
import Header from './Header';

const { colors, fonts, fontSizes, layout, radius, spacing } = theme;

// Revelação dos livros sorteados, uma caixa por vez: caixa fechada -> toque
// -> livros aparecem em sequência -> próxima caixa. `boxes` vem de
// flattenDraws(order); `onFinish` é chamado ao terminar ou ao pular.
// Custo: O(k) por caixa, com k livros desenhados (poucos por kit).
export default function KitReveal({ boxes, onFinish }) {
  const [index, setIndex] = useState(0);
  const [opened, setOpened] = useState(false);

  const box = boxes[index];
  const isLast = index === boxes.length - 1;

  const handleNext = () => {
    if (isLast) {
      onFinish();
      return;
    }
    setIndex(index + 1);
    setOpened(false);
  };

  return (
    <View style={styles.screen}>
      <Header title="Sua surpresa" />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.progress}>{`Kit ${index + 1} de ${boxes.length}`}</Text>
        <Text style={styles.boxTitle}>{box.label}</Text>

        {!opened ? (
          <Pressable
            onPress={() => setOpened(true)}
            accessibilityRole="button"
            accessibilityLabel={`Abrir ${box.label}`}
            style={({ pressed }) => [styles.box, pressed && styles.boxPressed]}
          >
            <Ionicons name="gift" size={80} color={colors.accentGold} />
            <Text style={styles.boxHint}>Toque para abrir</Text>
          </Pressable>
        ) : (
          <View style={styles.books}>
            <Text style={styles.booksTitle}>Seus livros são:</Text>
            {box.books.map((book, i) => (
              <FadeInView key={`${box.key}-${book.id}`} delay={i * 300}>
                <DrawnBookRow
                  title={book.title}
                  author={book.author}
                  category={book.category}
                  imageUri={book.imageUri}
                />
              </FadeInView>
            ))}
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        {opened ? (
          <Button title={isLast ? 'Ver meu pedido' : 'Abrir próximo kit'} onPress={handleNext} />
        ) : (
          <Button title="Pular revelação" variant="secondary" onPress={onFinish} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: layout.screenPadding,
    paddingBottom: spacing.xl,
  },
  progress: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.body,
    color: colors.textMuted,
    textAlign: 'center',
  },
  boxTitle: {
    fontFamily: fonts.title,
    fontSize: fontSizes.title,
    color: colors.text,
    textAlign: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
  },
  box: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    paddingVertical: 64,
    borderRadius: radius.card,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.accentGold,
    backgroundColor: colors.accentGoldLight,
  },
  boxPressed: {
    opacity: 0.8,
  },
  boxHint: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSizes.bodyLarge,
    color: colors.primaryDark,
  },
  books: {
    gap: spacing.md,
  },
  booksTitle: {
    fontFamily: fonts.title,
    fontSize: fontSizes.subtitle,
    color: colors.text,
  },
  footer: {
    paddingHorizontal: layout.screenPadding,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
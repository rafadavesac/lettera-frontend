import { Image, StyleSheet } from 'react-native';

// Proporção da logo completa (545x381) e do emblema (250x189).
const SOURCES = {
  full: { source: require('../../assets/logo.png'), ratio: 545 / 381 },
  emblem: { source: require('../../assets/logo-emblem.png'), ratio: 250 / 189 },
};

// variant: 'full' (livro, nome e frase) ou 'emblem' (só livro e pena).
export default function Logo({ variant = 'full', width = 220, style }) {
  const { source, ratio } = SOURCES[variant];

  return (
    <Image
      source={source}
      style={[styles.image, { width, height: width / ratio }, style]}
      resizeMode="contain"
      accessibilityRole="image"
      accessibilityLabel="Lettera"
    />
  );
}

const styles = StyleSheet.create({
  image: {
    alignSelf: 'center',
  },
});
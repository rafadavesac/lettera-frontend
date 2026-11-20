import React, { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

const { colors, radius } = theme;

// Capa de livro/kit. Mostra a imagem quando há uri e ela carrega; caso contrário
// (sem uri ou erro de carregamento) mostra um placeholder com ícone.
// Quem usa define o tamanho via `style` (width/height), então o mesmo componente
// serve para card grande, linha de lista e detalhe (responsabilidade única).
// Custo de renderização: O(1).
export default function CoverImage({ uri, placeholderIcon = 'book', style }) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(uri) && !failed;

  return (
    <View style={[styles.container, style]}>
      {showImage ? (
        <Image
          source={{ uri }}
          style={styles.image}
          resizeMode="cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <Ionicons name={placeholderIcon} size={32} color={colors.accentGold} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden', // recorta a imagem no raio
    borderRadius: radius.field,
    backgroundColor: colors.accentGoldLight,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
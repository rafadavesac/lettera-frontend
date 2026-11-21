import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

// Faz o conteúdo aparecer com fade e leve subida. `delay` permite escalonar
// vários itens (um após o outro). Usa só o Animated do React Native, no
// driver nativo. Custo: O(1) por elemento animado.
export default function FadeInView({ delay = 0, duration = 450, style, children }) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration,
      delay,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [progress, delay, duration]);

  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [16, 0] });

  return (
    <Animated.View style={[{ opacity: progress, transform: [{ translateY }] }, style]}>
      {children}
    </Animated.View>
  );
}
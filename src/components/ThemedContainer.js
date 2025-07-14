/**
 * ThemedContainer.js - Conteneur avec thème adaptatif
 * 
 * Ce composant sert de wrapper pour tous les écrans afin de:
 * - Appliquer automatiquement le thème actuel (clair/sombre)
 * - Fournir une transition fluide lors du changement de thème
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

const ThemedContainer = ({ children, style }) => {
  // Récupération du thème actuel depuis le contexte
  const { isDarkMode, theme } = useTheme();

  return (
    <View style={[
      styles.container,
      { backgroundColor: theme.backgroundColor },
      style
    ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ThemedContainer;

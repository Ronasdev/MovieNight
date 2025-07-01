/**
 * App.js - Point d'entrée principal de l'application MovieNight
 * 
 * Ce fichier configure l'application et encapsule l'ensemble de l'interface utilisateur
 * dans les providers nécessaires:
 * - SafeAreaProvider: pour gérer les zones sûres (encoche, barre d'état)
 * - AppNavigator: notre système de navigation complet
 * 
 * C'est ici que tout commence!
 */

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LogBox } from 'react-native';

// Import des composants de navigation
import AppNavigator from './src/navigation/AppNavigator';

// Import des thèmes
import { COLORS } from './src/utils/theme';

// Ignorer certains avertissements qui ne sont pas critiques
LogBox.ignoreLogs([
  'Reanimated 2',
  'AsyncStorage has been extracted',
]);

/**
 * Composant principal de l'application
 */
export default function App() {
  return (
    <SafeAreaProvider>
      {/* Configuration de la barre de statut */}
      <StatusBar style="light" backgroundColor={COLORS.background} translucent />
      
      {/* Navigation principale de l'application */}
      <AppNavigator />
    </SafeAreaProvider>
  );
}

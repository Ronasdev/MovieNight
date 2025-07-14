/**
 * ThemeContext.js - Contexte pour gérer le thème de l'application
 * 
 * Ce fichier définit un contexte React qui permet de:
 * - Partager l'état du thème (clair/sombre) à travers toute l'application
 * - Fournir une fonction pour basculer entre les thèmes
 * - Charger les préférences utilisateur depuis AsyncStorage au démarrage
 */

import React, { createContext, useState, useEffect } from 'react';
import { getUserSettings, saveUserSettings } from '../services/storageService';

// Création du contexte
export const ThemeContext = createContext({
  isDarkMode: true,
  toggleTheme: () => {},
  theme: {}
});

// Provider du contexte
export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // Charger les préférences au démarrage
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const settings = await getUserSettings();
        if (settings && settings.darkMode !== undefined) {
          setIsDarkMode(settings.darkMode);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des préférences de thème:', error);
      }
    };
    
    loadThemePreference();
  }, []);
  
  // Fonction pour basculer entre les thèmes
  const toggleTheme = async (value) => {
    const newThemeValue = value !== undefined ? value : !isDarkMode;
    setIsDarkMode(newThemeValue);
    try {
      await saveUserSettings({ darkMode: newThemeValue });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des préférences de thème:', error);
    }
  };
  
  // Valeurs à fournir au contexte
  const contextValue = {
    isDarkMode,
    toggleTheme,
    // Définition des couleurs spécifiques au thème
    theme: isDarkMode ? {
      // Thème sombre
      backgroundColor: '#121212',
      textColor: '#FFFFFF',
      cardColor: '#1E1E1E',
      cardLightColor: '#2A2A2A',
      secondaryTextColor: '#888888'
    } : {
      // Thème clair avec meilleur contraste
      backgroundColor: '#F5F5F5',
      textColor: '#333333',   // Texte plus foncé pour meilleur contraste
      cardColor: '#FFFFFF',
      cardLightColor: '#EEEEEE',
      secondaryTextColor: '#666666' // Texte secondaire visible
    }
  };
  
  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte de thème
export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeProvider;

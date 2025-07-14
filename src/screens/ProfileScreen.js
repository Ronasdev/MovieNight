/**
 * ProfileScreen.js - Écran de profil utilisateur
 * 
 * Cet écran permet à l'utilisateur de:
 * - Voir ses statistiques (nombre de films vus, favoris, etc.)
 * - Gérer ses préférences (thème sombre/clair)
 * - Voir des informations sur l'application
 * 
 * Il démontre également l'utilisation d'AsyncStorage pour sauvegarder
 * les préférences utilisateur entre les sessions.
 */

import React, { useState, useEffect, useContext } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Composants personnalisés
import Header from '../components/Header';
import ThemedContainer from '../components/ThemedContainer';

// Import des services et utilitaires
import { COLORS, SIZES, FONTS } from '../utils/theme';

// Import du contexte de thème
import { useTheme } from '../contexts/ThemeContext';

// Services de stockage
import storageService, { getData, saveUserSettings, getUserSettings } from '../services/storageService';

const ProfileScreen = () => {
  // États pour les données de profil et préférences
  const [stats, setStats] = useState({
    watchedCount: 0,
    favoritesCount: 0,
    watchlistCount: 0
  });
  
  // Utilisation du contexte de thème
  const { isDarkMode, toggleTheme, theme } = useTheme();
  const insets = useSafeAreaInsets();
  
  // Générer les styles basés sur le thème actuel
  const styles = React.useMemo(() => createStyles(theme, isDarkMode), [theme, isDarkMode]);

  // Chargement initial des paramètres utilisateur
  useEffect(() => {
    loadUserSettings();
  }, []);
  
  // Mise à jour des données à chaque fois que l'écran devient actif
  useFocusEffect(
    React.useCallback(() => {
      // Rechargement des statistiques chaque fois que l'utilisateur revient sur l'écran
      loadUserData();
      return () => {};
    }, [])
  );

  /**
   * Chargement des données utilisateur depuis AsyncStorage
   */
  const loadUserData = async () => {
    try {
      // Récupération de toutes les listes
      const watched = await getData(storageService.STORAGE_KEYS.WATCHED_MOVIES) || [];
      const favorites = await getData(storageService.STORAGE_KEYS.FAVORITE_MOVIES) || [];
      const watchlist = await getData(storageService.STORAGE_KEYS.WATCHLIST) || [];
      
      // Mise à jour des statistiques
      setStats({
        watchedCount: watched.length,
        favoritesCount: favorites.length,
        watchlistCount: watchlist.length
      });
    } catch (error) {
      console.error('Erreur lors du chargement des données utilisateur:', error);
    }
  };
  
  /**
   * Chargement des préférences utilisateur
   * Note: Le chargement du thème est maintenant géré par ThemeContext
   */
  const loadUserSettings = async () => {
    // Plus besoin de charger les paramètres ici car c'est fait par ThemeContext
    // Les autres paramètres utilisateur peuvent être chargés ici si besoin
  };
  
  /**
   * Gestion du changement de thème
   */
  const handleThemeToggle = (value) => {
    // Utilise la fonction du contexte pour changer le thème
    toggleTheme(value);
    // La sauvegarde est maintenant gérée par ThemeContext
  };

  return (
    <ThemedContainer style={styles.container}>
      <Header title="Profil" />
      
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Section Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mes statistiques</Text>
          
          <View style={styles.statsContainer}>
            {/* Nombre de films vus */}
            <View style={styles.statItem}>
              <View style={[styles.statIconContainer, { backgroundColor: isDarkMode ? 'rgba(46, 91, 255, 0.15)' : 'rgba(46, 91, 255, 0.3)' }]}>
                <FontAwesome name="eye" size={20} color={COLORS.primary} />
              </View>
              <Text style={styles.statValue}>{stats.watchedCount}</Text>
              <Text style={styles.statLabel}>Films vus</Text>
            </View>
            
            {/* Nombre de favoris */}
            <View style={styles.statItem}>
              <View style={[styles.statIconContainer, { backgroundColor: isDarkMode ? 'rgba(255, 107, 107, 0.15)' : 'rgba(255, 107, 107, 0.3)' }]}>
                <FontAwesome name="heart" size={20} color={isDarkMode ? COLORS.secondary : '#ff6b6b'} />
              </View>
              <Text style={styles.statValue}>{stats.favoritesCount}</Text>
              <Text style={styles.statLabel}>Favoris</Text>
            </View>
            
            {/* Nombre dans la watchlist */}
            <View style={styles.statItem}>
              <View style={[styles.statIconContainer, { backgroundColor: isDarkMode ? 'rgba(255, 193, 7, 0.15)' : 'rgba(255, 193, 7, 0.3)' }]}>
                <FontAwesome name="bookmark" size={20} color={isDarkMode ? COLORS.warning : '#ffc107'} />
              </View>
              <Text style={styles.statValue}>{stats.watchlistCount}</Text>
              <Text style={styles.statLabel}>À voir</Text>
            </View>
          </View>
        </View>
        
        {/* Section Préférences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Préférences</Text>
          
          <View style={styles.preferenceItem}>
            <View style={styles.preferenceTextContainer}>
              <Text style={styles.preferenceTitle}>Mode sombre</Text>
              <Text style={styles.preferenceDescription}>Activer le thème sombre pour l'application</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={handleThemeToggle}
              trackColor={{ false: '#3e3e3e', true: 'rgba(46, 91, 255, 0.4)' }}
              thumbColor={isDarkMode ? COLORS.primary : '#f4f3f4'}
            />
          </View>
        </View>
        
        {/* Section À propos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>À propos</Text>
          
          <View style={styles.aboutContainer}>
            <Text style={styles.appName}>MovieNight</Text>
            <Text style={styles.appVersion}>Version 1.0.0</Text>
            <Text style={styles.appDescription}>
              Une application de gestion de films développée avec React Native et Expo.
              Cette application utilise AsyncStorage pour sauvegarder vos préférences et listes de films.
            </Text>
            <Text style={[styles.appAuthor, {color: isDarkMode ? COLORS.primary : '#2e5bff'}]}>
              Développé par RonasDev pour YouTube
            </Text>
          </View>
        </View>
      </ScrollView>
    </ThemedContainer>
  );
};

// Les styles sont générés dynamiquement en fonction du thème
const createStyles = (theme, isDarkMode) => {
  
  return StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor est maintenant géré par ThemedContainer
  },
  contentContainer: {
    paddingHorizontal: SIZES.medium,
    paddingBottom: 120,
  },
  section: {
    marginTop: SIZES.large,
  },
  sectionTitle: {
    ...FONTS.h3,
    color: isDarkMode ? COLORS.text : theme.textColor,
    marginBottom: SIZES.medium,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.medium,
  },
  statItem: {
    alignItems: 'center',
    width: '30%',
  },
  statIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.small,
    // Le fond reste inchangé car il a un style inline dans le rendu
  },
  statValue: {
    ...FONTS.h2,
    color: isDarkMode ? COLORS.text : theme.textColor,
    marginBottom: SIZES.base / 2,
  },
  statLabel: {
    ...FONTS.body,
    color: isDarkMode ? COLORS.textSecondary : theme.secondaryTextColor,
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: isDarkMode ? COLORS.card : theme.cardColor,
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.medium,
    borderRadius: SIZES.borderRadius.medium,
    marginBottom: SIZES.small,
  },
  preferenceTextContainer: {
    flex: 1,
  },
  preferenceTitle: {
    ...FONTS.subtitle,
    color: isDarkMode ? COLORS.text : theme.textColor,
  },
  preferenceDescription: {
    ...FONTS.body,
    color: isDarkMode ? COLORS.textSecondary : theme.secondaryTextColor,
    marginTop: 2,
  },
  aboutContainer: {
    backgroundColor: isDarkMode ? COLORS.card : theme.cardColor,
    padding: SIZES.medium,
    borderRadius: SIZES.borderRadius.medium,
    alignItems: 'center',
  },
  appName: {
    ...FONTS.h1,
    color: isDarkMode ? COLORS.text : theme.textColor,
    marginBottom: SIZES.base,
  },
  appVersion: {
    ...FONTS.body,
    color: isDarkMode ? COLORS.textSecondary : theme.secondaryTextColor,
    marginBottom: SIZES.medium,
  },
  appDescription: {
    ...FONTS.body,
    color: isDarkMode ? COLORS.text : theme.textColor,
    textAlign: 'center',
    marginBottom: SIZES.medium,
    lineHeight: 22,
  },
  appAuthor: {
    ...FONTS.subtitle,
    // La couleur est définie en inline dans le rendu pour s'adapter au thème
  },
});
};

export default ProfileScreen;

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

import React, { useState, useEffect } from 'react';
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

// Styles et utilitaires
import { COLORS, SIZES, FONTS } from '../utils/theme';

// Services de stockage
import { STORAGE_KEYS, getData, saveUserSettings, getUserSettings } from '../services/storageService';

const ProfileScreen = () => {
  // États pour les données de profil et préférences
  const [stats, setStats] = useState({
    watchedCount: 0,
    favoritesCount: 0,
    watchlistCount: 0
  });
  
  const [darkMode, setDarkMode] = useState(true);
  const insets = useSafeAreaInsets();

  // Chargement des données au montage du composant
  useEffect(() => {
    loadUserData();
    loadUserSettings();
  }, []);

  /**
   * Chargement des données utilisateur depuis AsyncStorage
   */
  const loadUserData = async () => {
    try {
      // Récupération de toutes les listes
      const watched = await getData(STORAGE_KEYS.WATCHED_MOVIES) || [];
      const favorites = await getData(STORAGE_KEYS.FAVORITE_MOVIES) || [];
      const watchlist = await getData(STORAGE_KEYS.WATCHLIST) || [];
      
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
   */
  const loadUserSettings = async () => {
    try {
      const settings = await getUserSettings();
      if (settings) {
        setDarkMode(settings.darkMode);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres:', error);
    }
  };
  
  /**
   * Gestion du changement de thème
   */
  const handleThemeToggle = async (value) => {
    setDarkMode(value);
    try {
      await saveUserSettings({ darkMode: value });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des paramètres:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Profil" />
      
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Section Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mes statistiques</Text>
          
          <View style={styles.statsContainer}>
            {/* Nombre de films vus */}
            <View style={styles.statItem}>
              <View style={[styles.statIconContainer, { backgroundColor: 'rgba(46, 91, 255, 0.15)' }]}>
                <FontAwesome name="eye" size={20} color={COLORS.primary} />
              </View>
              <Text style={styles.statValue}>{stats.watchedCount}</Text>
              <Text style={styles.statLabel}>Films vus</Text>
            </View>
            
            {/* Nombre de favoris */}
            <View style={styles.statItem}>
              <View style={[styles.statIconContainer, { backgroundColor: 'rgba(255, 107, 107, 0.15)' }]}>
                <FontAwesome name="heart" size={20} color={COLORS.secondary} />
              </View>
              <Text style={styles.statValue}>{stats.favoritesCount}</Text>
              <Text style={styles.statLabel}>Favoris</Text>
            </View>
            
            {/* Nombre dans la watchlist */}
            <View style={styles.statItem}>
              <View style={[styles.statIconContainer, { backgroundColor: 'rgba(255, 193, 7, 0.15)' }]}>
                <FontAwesome name="bookmark" size={20} color={COLORS.warning} />
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
              value={darkMode}
              onValueChange={handleThemeToggle}
              trackColor={{ false: '#3e3e3e', true: 'rgba(46, 91, 255, 0.4)' }}
              thumbColor={darkMode ? COLORS.primary : '#f4f3f4'}
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
            <Text style={styles.appAuthor}>
              Développé par RonasDev pour YouTube
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
    color: COLORS.text,
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
  },
  statValue: {
    ...FONTS.h2,
    color: COLORS.text,
    marginBottom: SIZES.base / 2,
  },
  statLabel: {
    ...FONTS.body,
    color: COLORS.textSecondary,
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
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
    color: COLORS.text,
  },
  preferenceDescription: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  aboutContainer: {
    backgroundColor: COLORS.card,
    padding: SIZES.medium,
    borderRadius: SIZES.borderRadius.medium,
    alignItems: 'center',
  },
  appName: {
    ...FONTS.h1,
    color: COLORS.text,
    marginBottom: SIZES.base,
  },
  appVersion: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    marginBottom: SIZES.medium,
  },
  appDescription: {
    ...FONTS.body,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SIZES.medium,
    lineHeight: 22,
  },
  appAuthor: {
    ...FONTS.subtitle,
    color: COLORS.primary,
  },
});

export default ProfileScreen;

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
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  ScrollView
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

// Composants personnalisés
import Header from '../components/Header';
import ThemedContainer from '../components/ThemedContainer';

// Import des services et utilitaires
import { SIZES, FONTS } from '../utils/theme';

// Import du contexte de thème
import { useTheme } from '../contexts/ThemeContext';

// Services de stockage
import storageService, { getData } from '../services/storageService';

const ProfileScreen = () => {
  // États pour les données de profil et préférences
  const [stats, setStats] = useState({
    watchedCount: 0,
    favoritesCount: 0,
    watchlistCount: 0
  });
  
  // Utilisation du contexte de thème pour le style et les actions
  const { isDarkMode, toggleTheme, theme } = useTheme();
  
  // Générer les styles basés sur le thème actuel. useMemo évite de recalculer à chaque rendu.
  const styles = React.useMemo(() => createStyles(theme, isDarkMode), [theme, isDarkMode]);

  // Mise à jour des données à chaque fois que l'écran devient actif
  useFocusEffect(
    React.useCallback(() => {
      // Rechargement des statistiques chaque fois que l'utilisateur revient sur l'écran
      loadUserData();
      return () => {};
    }, [])
  );

  /**
   * Chargement des données utilisateur (stats) depuis AsyncStorage
   */
  const loadUserData = async () => {
    try {
      // Récupération de toutes les listes en parallèle pour plus d'efficacité
      const [watched, favorites, watchlist] = await Promise.all([
        getData(storageService.STORAGE_KEYS.WATCHED_MOVIES) || [],
        getData(storageService.STORAGE_KEYS.FAVORITE_MOVIES) || [],
        getData(storageService.STORAGE_KEYS.WATCHLIST) || []
      ]);
      
      // Mise à jour des statistiques
      setStats({
        watchedCount: watched?.length || 0,
        favoritesCount: favorites?.length || 0,
        watchlistCount: watchlist?.length || 0
      });
    } catch (error) {
      console.error('Erreur lors du chargement des données utilisateur:', error);
    }
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
              <View style={[styles.statIconContainer, { backgroundColor: 'rgba(46, 91, 255, 0.2)' }]}>
                <FontAwesome name="eye" size={20} color={'#2e5bff'} />
              </View>
              <Text style={styles.statValue}>{stats.watchedCount}</Text>
              <Text style={styles.statLabel}>Films vus</Text>
            </View>
            
            {/* Nombre de favoris */}
            <View style={styles.statItem}>
              <View style={[styles.statIconContainer, { backgroundColor: 'rgba(255, 107, 107, 0.2)' }]}>
                <FontAwesome name="heart" size={20} color={'#ff6b6b'} />
              </View>
              <Text style={styles.statValue}>{stats.favoritesCount}</Text>
              <Text style={styles.statLabel}>Favoris</Text>
            </View>
            
            {/* Nombre de films à voir */}
            <View style={styles.statItem}>
              <View style={[styles.statIconContainer, { backgroundColor: 'rgba(255, 165, 0, 0.2)' }]}>
                <FontAwesome name="list" size={20} color={'#ffa500'} />
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
              onValueChange={toggleTheme} // On utilise directement la fonction du contexte
              trackColor={{ false: '#767577', true: 'rgba(46, 91, 255, 0.4)' }}
              thumbColor={isDarkMode ? '#2e5bff' : '#f4f3f4'}
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
              Application de découverte et de suivi de films.
            </Text>
            <Text style={styles.appAuthor}>
              Développé par RonasDev
            </Text>
          </View>
        </View>
      </ScrollView>
    </ThemedContainer>
  );
};

// Les styles sont générés dynamiquement en fonction du thème
const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
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
    color: theme.textColor,
    marginBottom: SIZES.medium,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    color: theme.textColor,
    marginBottom: SIZES.base / 2,
  },
  statLabel: {
    ...FONTS.body,
    color: theme.secondaryTextColor,
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.cardColor,
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
    color: theme.textColor,
  },
  preferenceDescription: {
    ...FONTS.body,
    color: theme.secondaryTextColor,
    marginTop: 2,
  },
  aboutContainer: {
    backgroundColor: theme.cardColor,
    padding: SIZES.medium,
    borderRadius: SIZES.borderRadius.medium,
    alignItems: 'center',
  },
  appName: {
    ...FONTS.h1,
    color: theme.textColor,
    marginBottom: SIZES.base,
  },
  appVersion: {
    ...FONTS.body,
    color: theme.secondaryTextColor,
    marginBottom: SIZES.medium,
  },
  appDescription: {
    ...FONTS.body,
    color: theme.textColor,
    textAlign: 'center',
    marginBottom: SIZES.medium,
    lineHeight: 22,
  },
  appAuthor: {
    ...FONTS.subtitle,
    color: '#2e5bff',
  },
});

export default ProfileScreen;

/**
 * WatchlistScreen.js - Écran de la liste "À voir"
 * 
 * Cet écran affiche les films que l'utilisateur a marqué "À voir".
 * Il permet de:
 * - Visualiser la liste des films à voir
 * - Marquer un film comme vu
 * - Voir les détails d'un film
 * - Retirer un film de la liste
 * 
 * Cet écran démontre l'utilisation d'AsyncStorage pour stocker des listes persistantes.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

// Composants personnalisés
import MovieCard from '../components/MovieCard';
import Header from '../components/Header';

// Styles et utilitaires
import { COLORS, SIZES, FONTS } from '../utils/theme';

// Service de stockage
import storageService, { getData, removeMovieFromList, addMovieToList } from '../services/storageService';

// Hook personnalisé pour AsyncStorage
import useAsyncStorage from '../hooks/useAsyncStorage';

const WatchlistScreen = ({ navigation }) => {
  // Utilisation de notre hook personnalisé pour gérer la liste des films à voir
  const [watchlist, setWatchlist, loading, error, refreshData] = 
    useAsyncStorage(storageService.STORAGE_KEYS.WATCHLIST, []);
  
  // État pour suivre les films déjà vus
  const [watchedMovies, setWatchedMovies] = useState([]);
  
  // Utilisation de useEffect pour charger les films vus une fois au montage du composant
  useEffect(() => {
    loadWatchedMovies();
  }, []);
  
  // Utilisation de useFocusEffect pour rafraîchir les données quand l'écran devient actif
  useFocusEffect(
    React.useCallback(() => {
      // On ne recharge pas automatiquement via refreshData() pour éviter la boucle infinie
      // Le hook useAsyncStorage se charge déjà de charger les données au montage
      return () => {
        // Fonction de nettoyage si nécessaire
      };
    }, [])
  );
  
  /**
   * Chargement de la liste des films déjà vus
   */
  const loadWatchedMovies = async () => {
    try {
      const watched = await getData(storageService.STORAGE_KEYS.WATCHED_MOVIES) || [];
      setWatchedMovies(watched);
    } catch (error) {
      console.error('Erreur lors du chargement des films vus:', error);
    }
  };
  
  /**
   * Retirer un film de la watchlist
   */
  const handleRemoveFromWatchlist = async (movieId) => {
    try {
      await removeMovieFromList(storageService.STORAGE_KEYS.WATCHLIST, movieId);
      // Mise à jour de l'état local
      setWatchlist(prevList => prevList.filter(movie => movie.id !== movieId));
    } catch (error) {
      console.error('Erreur lors du retrait de la watchlist:', error);
    }
  };
  
  /**
   * Marquer un film comme vu et le retirer de la watchlist
   */
  const handleMarkAsWatched = async (movie) => {
    try {
      // Ajout à la liste des films vus
      await addMovieToList(storageService.STORAGE_KEYS.WATCHED_MOVIES, movie);
      
      // Retrait de la watchlist
      await removeMovieFromList(storageService.STORAGE_KEYS.WATCHLIST, movie.id);
      
      // Mise à jour des états locaux
      setWatchedMovies(prev => [...prev, movie]);
      setWatchlist(prev => prev.filter(item => item.id !== movie.id));
    } catch (error) {
      console.error('Erreur lors du marquage comme vu:', error);
    }
  };
  
  /**
   * Naviguer vers les détails d'un film
   */
  const goToMovieDetails = (movie) => {
    navigation.navigate('MovieDetail', { movie });
  };

  // Rendu de l'écran vide si la watchlist est vide
  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <FontAwesome name="list" size={70} color={COLORS.textMuted} />
      <Text style={styles.emptyTitle}>Votre liste est vide</Text>
      <Text style={styles.emptySubtitle}>
        Ajoutez des films à votre liste en explorant les films disponibles
      </Text>
      <TouchableOpacity 
        style={styles.exploreButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.exploreButtonText}>Explorer les films</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="À voir" />
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Chargement de votre liste...</Text>
        </View>
      ) : (
        <FlatList
          data={watchlist}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={[
            styles.moviesGrid,
            watchlist.length === 0 && styles.emptyList
          ]}
          renderItem={({ item }) => {
            const isWatched = watchedMovies.some(movie => movie.id === item.id);
            
            return (
              <MovieCard
                movie={item}
                onPress={() => goToMovieDetails(item)}
                onFavoritePress={() => {/* Géré dans l'écran détail */}}
                onWatchedPress={() => handleMarkAsWatched(item)}
                isWatched={isWatched}
                style={styles.movieCard}
              />
            );
          }}
          ListEmptyComponent={renderEmptyComponent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    marginTop: SIZES.small,
  },
  moviesGrid: {
    paddingHorizontal: SIZES.small,
    paddingBottom: 100, // Espace pour la barre de navigation
  },
  emptyList: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.large,
    paddingBottom: 70, // Compensation pour la barre de navigation
  },
  emptyTitle: {
    ...FONTS.h2,
    color: COLORS.text,
    marginTop: SIZES.medium,
    marginBottom: SIZES.small,
    textAlign: 'center',
  },
  emptySubtitle: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SIZES.large,
  },
  exploreButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.large,
    paddingVertical: SIZES.medium,
    borderRadius: SIZES.borderRadius.medium,
  },
  exploreButtonText: {
    ...FONTS.subtitle,
    color: COLORS.text,
  },
  movieCard: {
    marginBottom: SIZES.medium,
  }
});

export default WatchlistScreen;

/**
 * FavoritesScreen.js - Écran des films favoris
 * 
 * Cet écran affiche tous les films que l'utilisateur a marqué comme favoris.
 * Il permet de:
 * - Visualiser la liste des films favoris
 * - Retirer un film des favoris
 * - Accéder aux détails d'un film
 * 
 * Cet écran utilise également AsyncStorage pour persister les données entre les sessions.
 */

import React from 'react';
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

// Hook personnalisé pour AsyncStorage
import useAsyncStorage from '../hooks/useAsyncStorage';

// Service de stockage
import storageService, { removeMovieFromList } from '../services/storageService';

const FavoritesScreen = ({ navigation }) => {
  // Utilisation de notre hook personnalisé pour gérer la liste des films favoris
  const [favorites, setFavorites, loading, error, refreshData] = 
    useAsyncStorage(storageService.STORAGE_KEYS.FAVORITE_MOVIES, []);
  
  // Utilisation de useFocusEffect pour rafraîchir les données quand l'écran devient actif
  useFocusEffect(
    React.useCallback(() => {
      // Rechargement des données à chaque fois que l'écran est affiché
      refreshData();
      
      return () => {
        // Fonction de nettoyage si nécessaire
      };
    }, [])
  );
  
  /**
   * Retirer un film des favoris
   */
  const handleRemoveFromFavorites = async (movieId) => {
    try {
      await removeMovieFromList(storageService.STORAGE_KEYS.FAVORITE_MOVIES, movieId);
      // Mise à jour de l'état local
      setFavorites(prevList => prevList.filter(movie => movie.id !== movieId));
    } catch (error) {
      console.error('Erreur lors du retrait des favoris:', error);
    }
  };
  
  /**
   * Naviguer vers les détails d'un film
   */
  const goToMovieDetails = (movie) => {
    navigation.navigate('MovieDetail', { movie });
  };

  // Rendu de l'écran vide si la liste des favoris est vide
  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <FontAwesome name="heart" size={70} color={COLORS.secondary} />
      <Text style={styles.emptyTitle}>Aucun favori</Text>
      <Text style={styles.emptySubtitle}>
        Ajoutez des films à vos favoris en explorant la bibliothèque de films
      </Text>
      <TouchableOpacity 
        style={styles.exploreButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.exploreButtonText}>Explorer les films</Text>
      </TouchableOpacity>
    </View>
  );
  
  // Organisation des films par date d'ajout (plus récent en premier)
  const sortedFavorites = [...favorites].sort((a, b) => {
    return new Date(b.addedAt || 0) - new Date(a.addedAt || 0);
  });

  return (
    <View style={styles.container}>
      <Header title="Mes Favoris" />
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Chargement de vos favoris...</Text>
        </View>
      ) : (
        <FlatList
          data={sortedFavorites}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={[
            styles.moviesGrid,
            favorites.length === 0 && styles.emptyList
          ]}
          renderItem={({ item }) => (
            <MovieCard
              movie={item}
              onPress={() => goToMovieDetails(item)}
              onFavoritePress={() => handleRemoveFromFavorites(item.id)}
              isFavorite={true} // Toujours vrai car nous sommes dans l'écran des favoris
              style={styles.movieCard}
            />
          )}
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

export default FavoritesScreen;

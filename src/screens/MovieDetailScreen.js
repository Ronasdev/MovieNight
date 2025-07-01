/**
 * MovieDetailScreen.js - Écran de détail d'un film
 * 
 * Cet écran affiche les informations détaillées d'un film:
 * - Image de fond et affiche
 * - Titre, année, genres
 * - Synopsis
 * - Boutons d'action (favoris, à voir, vu)
 * 
 * C'est un exemple parfait de Stack Navigation, accessible depuis plusieurs écrans.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Platform
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Import des services et utilitaires
import { COLORS, SIZES, FONTS, SHADOWS } from '../utils/theme';
import storageService, { isMovieInList, addMovieToList, removeMovieFromList } from '../services/storageService';

const { width, height } = Dimensions.get('window');

const MovieDetailScreen = ({ route, navigation }) => {
  // Récupération du film passé en paramètre de navigation
  const { movie } = route.params;
  const insets = useSafeAreaInsets();
  
  // États pour suivre si le film est dans différentes listes
  const [isFavorite, setIsFavorite] = useState(false);
  const [isWatched, setIsWatched] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  
  // Vérifier le statut du film dans les différentes listes au chargement de l'écran
  useEffect(() => {
    checkMovieStatus();
  }, []);
  
  /**
   * Vérifie le statut du film dans toutes les listes sauvegardées
   */
  const checkMovieStatus = async () => {
    try {
      // Vérification pour les favoris
      const favStatus = await isMovieInList(storageService.STORAGE_KEYS.FAVORITE_MOVIES, movie.id);
      setIsFavorite(favStatus);
      
      // Vérification pour les films vus
      const watchedStatus = await isMovieInList(storageService.STORAGE_KEYS.WATCHED_MOVIES, movie.id);
      setIsWatched(watchedStatus);
      
      // Vérification pour la watchlist
      const watchlistStatus = await isMovieInList(storageService.STORAGE_KEYS.WATCHLIST, movie.id);
      setIsInWatchlist(watchlistStatus);
    } catch (error) {
      console.error('Erreur lors de la vérification du statut du film:', error);
    }
  };
  
  /**
   * Gestion des favoris
   */
  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await removeMovieFromList(storageService.STORAGE_KEYS.FAVORITE_MOVIES, movie.id);
      } else {
        await addMovieToList(storageService.STORAGE_KEYS.FAVORITE_MOVIES, movie);
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Erreur lors de la mise à jour des favoris:', error);
    }
  };
  
  /**
   * Gestion des films vus
   */
  const toggleWatched = async () => {
    try {
      if (isWatched) {
        await removeMovieFromList(storageService.STORAGE_KEYS.WATCHED_MOVIES, movie.id);
      } else {
        await addMovieToList(storageService.STORAGE_KEYS.WATCHED_MOVIES, movie);
        // Si on marque comme vu, on retire de la watchlist
        if (isInWatchlist) {
          await removeMovieFromList(storageService.STORAGE_KEYS.WATCHLIST, movie.id);
          setIsInWatchlist(false);
        }
      }
      setIsWatched(!isWatched);
    } catch (error) {
      console.error('Erreur lors de la mise à jour des films vus:', error);
    }
  };
  
  /**
   * Gestion de la watchlist
   */
  const toggleWatchlist = async () => {
    try {
      if (isInWatchlist) {
        await removeMovieFromList(storageService.STORAGE_KEYS.WATCHLIST, movie.id);
      } else {
        await addMovieToList(storageService.STORAGE_KEYS.WATCHLIST, movie);
      }
      setIsInWatchlist(!isInWatchlist);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la watchlist:', error);
    }
  };

  // Calcul du nombre d'étoiles à afficher
  const renderStars = () => {
    const rating = movie.vote_average / 2; // Conversion de 0-10 à 0-5
    return (
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((star) => {
          let iconName = 'star-o';
          if (star <= Math.floor(rating)) {
            iconName = 'star';
          } else if (star === Math.ceil(rating) && !Number.isInteger(rating)) {
            iconName = 'star-half-full';
          }
          return (
            <FontAwesome
              key={`star-${star}`}
              name={iconName}
              size={18}
              color={COLORS.star}
              style={{ marginRight: 3 }}
            />
          );
        })}
        <Text style={styles.ratingText}>{movie.vote_average.toFixed(1)}/10</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Barre de statut transparente */}
      <StatusBar translucent backgroundColor="transparent" />
      
      {/* Image de fond avec dégradé */}
      <View style={styles.backdropContainer}>
        <Image
          source={{
            uri: movie.backdrop_path
              ? `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`
              : 'https://via.placeholder.com/780x440?text=No+Image'
          }}
          style={styles.backdropImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['rgba(18, 18, 18, 0)', COLORS.background]}
          style={styles.backdropGradient}
        />
      </View>
      
      {/* Bouton de retour */}
      <TouchableOpacity
        style={[styles.backButton, { top: insets.top + 10 }]}
        onPress={() => navigation.goBack()}
      >
        <FontAwesome name="arrow-left" size={20} color={COLORS.text} />
      </TouchableOpacity>
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* En-tête avec poster et titre */}
        <View style={styles.headerContainer}>
          {/* Poster du film */}
          <Image
            source={{
              uri: movie.poster_path
                ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
                : 'https://via.placeholder.com/342x513?text=No+Image'
            }}
            style={styles.posterImage}
            resizeMode="cover"
          />
          
          {/* Informations du film */}
          <View style={styles.movieInfo}>
            <Text style={styles.title}>{movie.title}</Text>
            
            {/* Année */}
            {movie.release_date && (
              <Text style={styles.year}>
                {movie.release_date.substring(0, 4)}
              </Text>
            )}
            
            {/* Notation */}
            {renderStars()}
            
            {/* Genres */}
            {movie.genres && (
              <View style={styles.genresContainer}>
                {movie.genres.map((genre, index) => (
                  <View key={index} style={styles.genreBadge}>
                    <Text style={styles.genreText}>{genre}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
        
        {/* Synopsis */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Synopsis</Text>
          <Text style={styles.overview}>{movie.overview}</Text>
        </View>
        
        {/* Boutons d'action */}
        <View style={styles.actionButtonsContainer}>
          {/* Bouton Favoris */}
          <TouchableOpacity
            style={[
              styles.actionButton,
              isFavorite && { backgroundColor: 'rgba(255, 107, 107, 0.2)' },
            ]}
            onPress={toggleFavorite}
          >
            <FontAwesome
              name={isFavorite ? 'heart' : 'heart-o'}
              size={22}
              color={isFavorite ? COLORS.secondary : COLORS.text}
            />
            <Text style={[
              styles.actionButtonText,
              isFavorite && { color: COLORS.secondary }
            ]}>
              {isFavorite ? 'Dans les favoris' : 'Ajouter aux favoris'}
            </Text>
          </TouchableOpacity>
          
          {/* Bouton Vu */}
          <TouchableOpacity
            style={[
              styles.actionButton,
              isWatched && { backgroundColor: 'rgba(46, 91, 255, 0.2)' },
            ]}
            onPress={toggleWatched}
          >
            <FontAwesome
              name={isWatched ? 'eye' : 'eye-slash'}
              size={22}
              color={isWatched ? COLORS.primary : COLORS.text}
            />
            <Text style={[
              styles.actionButtonText,
              isWatched && { color: COLORS.primary }
            ]}>
              {isWatched ? 'Déjà vu' : 'Marquer comme vu'}
            </Text>
          </TouchableOpacity>
          
          {/* Bouton À voir */}
          <TouchableOpacity
            style={[
              styles.actionButton,
              isInWatchlist && { backgroundColor: 'rgba(255, 193, 7, 0.2)' },
            ]}
            onPress={toggleWatchlist}
          >
            <FontAwesome
              name={isInWatchlist ? 'bookmark' : 'bookmark-o'}
              size={22}
              color={isInWatchlist ? COLORS.warning : COLORS.text}
            />
            <Text style={[
              styles.actionButtonText,
              isInWatchlist && { color: COLORS.warning }
            ]}>
              {isInWatchlist ? 'Dans ma liste' : 'Ajouter à ma liste'}
            </Text>
          </TouchableOpacity>
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
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 30,
  },
  backdropContainer: {
    width: '100%',
    height: height * 0.35,
    position: 'absolute',
    top: 0,
  },
  backdropImage: {
    width: '100%',
    height: '100%',
  },
  backdropGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70%',
  },
  backButton: {
    position: 'absolute',
    left: 15,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    marginTop: height * 0.25,
    paddingHorizontal: SIZES.medium,
  },
  posterImage: {
    width: 120,
    height: 180,
    borderRadius: SIZES.borderRadius.medium,
    marginRight: SIZES.medium,
    ...SHADOWS.medium,
  },
  movieInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    ...FONTS.h2,
    color: COLORS.text,
    marginBottom: SIZES.base,
  },
  year: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    marginBottom: SIZES.base,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  ratingText: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    marginLeft: SIZES.small,
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  genreBadge: {
    paddingHorizontal: SIZES.small,
    paddingVertical: SIZES.base / 2,
    backgroundColor: COLORS.cardLight,
    borderRadius: SIZES.borderRadius.full,
    marginRight: SIZES.base,
    marginBottom: SIZES.base,
  },
  genreText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },
  section: {
    paddingHorizontal: SIZES.medium,
    marginTop: SIZES.large,
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: SIZES.small,
  },
  overview: {
    ...FONTS.body,
    color: COLORS.text,
    lineHeight: 22,
  },
  actionButtonsContainer: {
    paddingHorizontal: SIZES.medium,
    marginTop: SIZES.xlarge,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.medium,
    paddingHorizontal: SIZES.medium,
    backgroundColor: COLORS.cardLight,
    borderRadius: SIZES.borderRadius.medium,
    marginBottom: SIZES.medium,
  },
  actionButtonText: {
    ...FONTS.subtitle,
    color: COLORS.text,
    marginLeft: SIZES.medium,
  },
});

export default MovieDetailScreen;

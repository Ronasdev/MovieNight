/**
 * MovieDetailScreen.js - Écran de détail d'un film
 * 
 * Cet écran affiche les informations détaillées d'un film et gère les interactions utilisateur
 * (favoris, vus, à voir) en utilisant un thème dynamique pour l'affichage.
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Import des services et utilitaires
import { getMovieDetails, getPosterUrl } from '../services/api';
import { SIZES, FONTS, SHADOWS } from '../utils/theme'; // On retire COLORS
import { useTheme } from '../contexts/ThemeContext';
import ThemedContainer from '../components/ThemedContainer';
import storageService, { isMovieInList, addMovieToList, removeMovieFromList } from '../services/storageService';

const { width, height } = Dimensions.get('window');

// Couleurs spécifiques pour les états des boutons, indépendantes du thème
const STATUS_COLORS = {
  favorite: '#ff6b6b', // Rouge pour les favoris
  watched: '#2e5bff',   // Bleu pour les vus
  watchlist: '#ffc107', // Jaune pour la watchlist
};

const MovieDetailScreen = ({ route, navigation }) => {
  const { movieId } = route.params;
  const { isDarkMode, theme } = useTheme();
  const insets = useSafeAreaInsets();

  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isWatched, setIsWatched] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  // Génération des styles basés sur le thème. Recalculés seulement si le thème change.
  const styles = useMemo(() => createStyles(theme), [theme]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const details = await getMovieDetails(movieId);
        setMovieDetails(details);
        await checkMovieStatus(details.id);
      } catch (error) {
        console.error("Erreur lors de la récupération des données du film:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [movieId]);

  const checkMovieStatus = async (currentMovieId) => {
    try {
      const [favStatus, watchedStatus, watchlistStatus] = await Promise.all([
        isMovieInList(storageService.STORAGE_KEYS.FAVORITE_MOVIES, currentMovieId),
        isMovieInList(storageService.STORAGE_KEYS.WATCHED_MOVIES, currentMovieId),
        isMovieInList(storageService.STORAGE_KEYS.WATCHLIST, currentMovieId),
      ]);
      setIsFavorite(favStatus);
      setIsWatched(watchedStatus);
      setIsInWatchlist(watchlistStatus);
    } catch (error) {
      console.error('Erreur lors de la vérification du statut du film:', error);
    }
  };

  const handleToggle = async (listKey, status, setStatus, movieData) => {
    try {
      if (status) {
        await removeMovieFromList(listKey, movieData.id);
      } else {
        const movieToStore = { id: movieData.id, title: movieData.title, posterUrl: getPosterUrl(movieData.poster_path) };
        await addMovieToList(listKey, movieToStore);
      }
      setStatus(!status);
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la liste ${listKey}:`, error);
    }
  };

  const toggleFavorite = () => handleToggle(storageService.STORAGE_KEYS.FAVORITE_MOVIES, isFavorite, setIsFavorite, movieDetails);
  const toggleWatchlist = () => handleToggle(storageService.STORAGE_KEYS.WATCHLIST, isInWatchlist, setIsInWatchlist, movieDetails);
  
  const toggleWatched = async () => {
    await handleToggle(storageService.STORAGE_KEYS.WATCHED_MOVIES, isWatched, setIsWatched, movieDetails);
    // Si on marque comme 'vu' et qu'il est dans la watchlist, on le retire
    if (!isWatched && isInWatchlist) {
      await handleToggle(storageService.STORAGE_KEYS.WATCHLIST, true, setIsInWatchlist, movieDetails);
    }
  };

  const renderStars = (ratingValue) => {
    const rating = ratingValue / 2;
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    const starColor = STATUS_COLORS.watchlist; // Utilise la couleur 'warning'
    let stars = [];

    for (let i = 0; i < fullStars; i++) stars.push(<FontAwesome key={`full_${i}`} name="star" size={16} color={starColor} />);
    if (halfStar) stars.push(<FontAwesome key="half" name="star-half-empty" size={16} color={starColor} />);
    for (let i = 0; i < emptyStars; i++) stars.push(<FontAwesome key={`empty_${i}`} name="star-o" size={16} color={starColor} />);

    return stars;
  };

  if (loading) {
    return <ThemedContainer style={styles.loadingContainer}><Text style={styles.loadingText}>Chargement...</Text></ThemedContainer>;
  }

  if (!movieDetails) {
    return <ThemedContainer style={styles.loadingContainer}><Text style={styles.loadingText}>Détails non disponibles.</Text></ThemedContainer>;
  }

  return (
    <ThemedContainer style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.backdropContainer}>
          <Image source={{ uri: getPosterUrl(movieDetails.backdrop_path) }} style={styles.backdropImage} resizeMode="cover" />
          <LinearGradient colors={['transparent', theme.backgroundColor]} style={styles.backdropGradient} />
        </View>

        <TouchableOpacity style={[styles.backButton, { top: insets.top + 10 }]} onPress={() => navigation.goBack()}>
          <FontAwesome name="chevron-left" size={16} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.headerContainer}>
          <Image source={{ uri: getPosterUrl(movieDetails.poster_path) }} style={styles.posterImage} resizeMode="cover" />
          <View style={styles.movieInfo}>
            <Text style={styles.title}>{movieDetails.title}</Text>
            <Text style={styles.year}>{new Date(movieDetails.release_date).getFullYear()}</Text>
            <View style={styles.ratingContainer}>
              {renderStars(movieDetails.vote_average)}
              <Text style={styles.ratingText}>{movieDetails.vote_average.toFixed(1)}/10</Text>
            </View>
            <View style={styles.genresContainer}>
              {movieDetails.genres.slice(0, 3).map(genre => (
                <View key={genre.id} style={styles.genreBadge}><Text style={styles.genreText}>{genre.name}</Text></View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.section}><Text style={styles.sectionTitle}>Synopsis</Text><Text style={styles.overview}>{movieDetails.overview}</Text></View>

        <View style={styles.actionButtonsContainer}>
          <ActionButton icon="heart" text="Ajouter aux favoris" activeText="Dans mes favoris" active={isFavorite} color={STATUS_COLORS.favorite} onPress={toggleFavorite} />
          <ActionButton icon="check-circle" text="Marquer comme vu" activeText="Déjà vu" active={isWatched} color={STATUS_COLORS.watched} onPress={toggleWatched} />
          <ActionButton icon="bookmark" text="Ajouter à ma liste" activeText="Dans ma liste" active={isInWatchlist} color={STATUS_COLORS.watchlist} onPress={toggleWatchlist} />
        </View>
      </ScrollView>
    </ThemedContainer>
  );
};

// Composant réutilisable pour les boutons d'action pour simplifier le JSX
const ActionButton = ({ icon, text, activeText, active, color, onPress }) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <TouchableOpacity
      style={[styles.actionButton, active && { backgroundColor: `${color}33` }]} // Ajoute une opacité de 20% (33 en hex)
      onPress={onPress}
    >
      <FontAwesome name={active ? icon : `${icon}-o`} size={22} color={active ? color : theme.textColor} />
      <Text style={[styles.actionButtonText, active && { color }]}>{active ? activeText : text}</Text>
    </TouchableOpacity>
  );
};

// Fonction pour créer les styles en fonction du thème
const createStyles = (theme) => StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: SIZES.medium, ...FONTS.body, color: theme.secondaryTextColor },
  scrollView: { flex: 1 },
  content: { paddingBottom: 30 },
  backdropContainer: { width: '100%', height: height * 0.35, position: 'absolute', top: 0 },
  backdropImage: { width: '100%', height: '100%' },
  backdropGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '70%' },
  backButton: { position: 'absolute', left: 15, zIndex: 10, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  headerContainer: { flexDirection: 'row', marginTop: height * 0.25, paddingHorizontal: SIZES.medium },
  posterImage: { width: 120, height: 180, borderRadius: SIZES.borderRadius.medium, marginRight: SIZES.medium, ...SHADOWS.medium },
  movieInfo: { flex: 1, justifyContent: 'center' },
  title: { ...FONTS.h2, color: theme.textColor, marginBottom: SIZES.base },
  year: { ...FONTS.body, color: theme.secondaryTextColor, marginBottom: SIZES.base },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: SIZES.base },
  ratingText: { ...FONTS.body, color: theme.secondaryTextColor, marginLeft: SIZES.small },
  genresContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  genreBadge: { paddingHorizontal: SIZES.small, paddingVertical: SIZES.base / 2, backgroundColor: theme.cardLightColor, borderRadius: SIZES.borderRadius.full, marginRight: SIZES.base, marginBottom: SIZES.base },
  genreText: { ...FONTS.caption, color: theme.secondaryTextColor },
  section: { paddingHorizontal: SIZES.medium, marginTop: SIZES.large },
  sectionTitle: { ...FONTS.h3, color: theme.textColor, marginBottom: SIZES.small },
  overview: { ...FONTS.body, color: theme.textColor, lineHeight: 22 },
  actionButtonsContainer: { paddingHorizontal: SIZES.medium, marginTop: SIZES.xlarge },
  actionButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: SIZES.medium, paddingHorizontal: SIZES.medium, backgroundColor: theme.cardLightColor, borderRadius: SIZES.borderRadius.medium, marginBottom: SIZES.medium },
  actionButtonText: { ...FONTS.subtitle, color: theme.textColor, marginLeft: SIZES.medium },
});

export default MovieDetailScreen;

/**
 * MovieCard.js - Composant de carte de film entièrement thématisé
 */

import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';

import { SIZES, FONTS, SHADOWS } from '../utils/theme';
import { useTheme } from '../contexts/ThemeContext';
import { getPosterUrl } from '../services/api';

const { width } = Dimensions.get('window');

// Couleurs spécifiques pour les états, pour la clarté
const FAVORITE_COLOR = '#FF6B6B'; // Rouge pour favori
const WATCHED_COLOR = '#4ECDC4'; // Vert d'eau pour vu

const createStyles = (theme) => StyleSheet.create({
  container: {
    width: (width / 2) - (SIZES.medium * 1.5),
    height: 250,
    borderRadius: SIZES.borderRadius.medium,
    backgroundColor: theme.cardColor,
    margin: SIZES.small / 2,
    overflow: 'hidden',
    ...SHADOWS.medium,
    elevation: 5, // Pour Android
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SIZES.small,
  },
  title: {
    ...FONTS.subtitle,
    color: theme.textColor,
    marginBottom: SIZES.base / 2,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    marginRight: 2,
  },
  year: {
    ...FONTS.caption,
    color: theme.textSecondary,
  },
  actions: {
    position: 'absolute',
    top: SIZES.small,
    right: SIZES.small,
    flexDirection: 'column',
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: SIZES.borderRadius.full,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.base,
  },
});

const MovieCard = ({
  movie,
  onPress,
  onFavoritePress,
  onWatchedPress,
  isFavorite = false,
  isWatched = false,
  style = {}
}) => {
  const { theme } = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  // Si les données du film sont invalides, on n'affiche rien pour éviter un crash.
  if (!movie || !movie.id) {
    return null; 
  }

  const renderStars = () => {
    // On s'assure que vote_average est un nombre avant de l'utiliser.
    const rating = typeof movie.vote_average === 'number' ? movie.vote_average / 2 : 0;
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    const starColor = theme.starColor;

    return (
      <View style={styles.starsContainer}>
        {[...Array(fullStars)]?.map((_, i) => (
          <FontAwesome key={`full-${i}`} name="star" size={12} color={starColor} style={styles.star} />
        ))}
        {halfStar && (
          <FontAwesome key="half" name="star-half-full" size={12} color={starColor} style={styles.star} />
        )}
        {[...Array(emptyStars)]?.map((_, i) => (
          <FontAwesome key={`empty-${i}`} name="star-o" size={12} color={starColor} style={styles.star} />
        ))}
      </View>
    );
  };

  return (
    <TouchableOpacity 
      style={[styles.container, style]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: getPosterUrl(movie.poster_path) }}
        style={styles.image}
        resizeMode="cover"
      />
      
      {/* <LinearGradient
        colors={theme.gradientCard}
        style={styles.gradient}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      /> */}
      
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {movie.title || movie.name || 'Titre inconnu'}
        </Text>
        
        <View style={styles.infoContainer}>
          {renderStars()}
          {movie.release_date && (
            <Text style={styles.year}>
              {new Date(movie.release_date).getFullYear()}
            </Text>
          )}
        </View>
      </View>
      
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: isFavorite ? FAVORITE_COLOR : 'rgba(0,0,0,0.5)' }]}
          onPress={onFavoritePress}
        >
          <FontAwesome 
            name={isFavorite ? "heart" : "heart-o"} 
            size={16} 
            color={theme.white} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: isWatched ? WATCHED_COLOR : 'rgba(0,0,0,0.5)' }]}
          onPress={onWatchedPress}
        >
          <FontAwesome 
            name={isWatched ? "eye" : "eye-slash"} 
            size={16} 
            color={theme.white} 
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default MovieCard;

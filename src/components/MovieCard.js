/**
 * MovieCard.js - Composant de carte de film
 * 
 * Ce composant affiche une carte pour un film avec:
 * - Image d'affiche
 * - Titre
 * - Note (étoiles)
 * - Options (ajouter aux favoris, marquer comme vu)
 * 
 * Il est utilisé dans plusieurs écrans de l'application pour
 * afficher les films de manière cohérente et attrayante.
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

import { COLORS, SIZES, FONTS, SHADOWS } from '../utils/theme';

const { width } = Dimensions.get('window');

/**
 * Composant MovieCard - Carte affichant un film avec ses informations principales
 * 
 * @param {Object} movie - Les données du film à afficher
 * @param {Function} onPress - Fonction appelée quand la carte est touchée
 * @param {Function} onFavoritePress - Fonction appelée quand le bouton favori est touché
 * @param {Function} onWatchedPress - Fonction appelée quand le bouton "vu" est touché
 * @param {Boolean} isFavorite - Si le film est dans les favoris
 * @param {Boolean} isWatched - Si le film a été vu
 * @param {Object} style - Styles supplémentaires pour la carte
 */
const MovieCard = ({
  movie,
  onPress,
  onFavoritePress,
  onWatchedPress,
  isFavorite = false,
  isWatched = false,
  style = {}
}) => {
  // Calcul des étoiles basé sur la note du film (sur 10)
  const renderStars = () => {
    // Par défaut on suppose que la note est sur 10
    const rating = movie.vote_average ? movie.vote_average / 2 : 0;
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    return (
      <View style={styles.starsContainer}>
        {/* Affichage des étoiles pleines */}
        {[...Array(fullStars)].map((_, i) => (
          <FontAwesome key={`full-${i}`} name="star" size={12} color={COLORS.star} style={styles.star} />
        ))}
        
        {/* Affichage d'une demi-étoile si nécessaire */}
        {halfStar && (
          <FontAwesome key="half" name="star-half-full" size={12} color={COLORS.star} style={styles.star} />
        )}
        
        {/* Affichage des étoiles vides */}
        {[...Array(emptyStars)].map((_, i) => (
          <FontAwesome key={`empty-${i}`} name="star-o" size={12} color={COLORS.star} style={styles.star} />
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
      {/* Image d'arrière-plan avec dégradé pour meilleure lisibilité */}
      <Image
        source={{ 
          uri: movie.poster_path 
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : 'https://via.placeholder.com/500x750?text=No+Image'
        }}
        style={styles.image}
        resizeMode="cover"
      />
      
      {/* Dégradé pour une meilleure lisibilité du texte */}
      <LinearGradient
        colors={COLORS.gradientCard}
        style={styles.gradient}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
      
      {/* Informations du film */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {movie.title || movie.name}
        </Text>
        
        <View style={styles.infoContainer}>
          {/* Affichage des étoiles pour la notation */}
          {renderStars()}
          
          {/* Année de sortie (si disponible) */}
          {movie.release_date && (
            <Text style={styles.year}>
              {movie.release_date.substring(0, 4)}
            </Text>
          )}
        </View>
      </View>
      
      {/* Boutons d'action (favoris et vu) */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, isFavorite && styles.activeActionButton]}
          onPress={onFavoritePress}
        >
          <FontAwesome 
            name={isFavorite ? "heart" : "heart-o"} 
            size={16} 
            color={isFavorite ? COLORS.secondary : COLORS.text} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, isWatched && styles.activeActionButton]}
          onPress={onWatchedPress}
        >
          <FontAwesome 
            name={isWatched ? "eye" : "eye-slash"} 
            size={16} 
            color={isWatched ? COLORS.primary : COLORS.text} 
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: (width / 2) - (SIZES.medium * 1.5),
    height: 250,
    borderRadius: SIZES.borderRadius.medium,
    backgroundColor: COLORS.card,
    margin: SIZES.small / 2,
    overflow: 'hidden',
    ...SHADOWS.medium,
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
    color: COLORS.text,
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
    color: COLORS.textSecondary,
  },
  actions: {
    position: 'absolute',
    top: SIZES.small,
    right: SIZES.small,
    flexDirection: 'row',
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: SIZES.borderRadius.full,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SIZES.base / 2,
  },
  activeActionButton: {
    backgroundColor: 'rgba(46, 91, 255, 0.8)',
  },
});

export default MovieCard;

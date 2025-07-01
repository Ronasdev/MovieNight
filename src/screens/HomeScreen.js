/**
 * HomeScreen.js - Écran d'accueil/découverte
 * 
 * Cet écran permet aux utilisateurs de découvrir des films.
 * Il présente:
 * - Une grille de films populaires
 * - Une barre de recherche
 * - Une mise en page attrayante et réactive
 * 
 * C'est l'écran principal de l'application.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Keyboard
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Composants personnalisés
import MovieCard from '../components/MovieCard';
import Header from '../components/Header';

// Styles et utilitaires
import { COLORS, SIZES, FONTS, SHADOWS } from '../utils/theme';

// Stockage
import { STORAGE_KEYS, isMovieInList, addMovieToList, removeMovieFromList } from '../services/storageService';

// Données de démonstration pour le tutoriel (normalement, ces données viendraient d'une API comme TMDB)
import mockMovies from '../utils/mockData';

const HomeScreen = ({ navigation }) => {
  // États
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchActive, setSearchActive] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [watchedMovies, setWatchedMovies] = useState([]);
  
  // SafeArea pour gérer les encoches et barres système
  const insets = useSafeAreaInsets();
  
  // Charger les films au démarrage
  useEffect(() => {
    // Dans un tutoriel réel, vous feriez un appel API ici
    // Pour simplifier, nous utilisons des données mockées
    setTimeout(() => {
      setMovies(mockMovies);
      setLoading(false);
    }, 1000); // Simulation de délai réseau
    
    // Chargement des listes de l'utilisateur depuis AsyncStorage
    loadUserLists();
  }, []);
  
  // Charger les listes sauvegardées de l'utilisateur
  const loadUserLists = async () => {
    try {
      // Vous pourriez utiliser le hook useAsyncStorage ici dans une application réelle
      // Mais pour la simplicité du tutoriel, nous utilisons directement les fonctions
      const favs = await isMovieInList(STORAGE_KEYS.FAVORITE_MOVIES) || [];
      const watched = await isMovieInList(STORAGE_KEYS.WATCHED_MOVIES) || [];
      
      setFavorites(favs);
      setWatchedMovies(watched);
    } catch (error) {
      console.error('Erreur lors du chargement des listes utilisateur:', error);
    }
  };
  
  // Filtrer les films en fonction de la recherche
  const filteredMovies = searchQuery
    ? movies.filter(movie => 
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : movies;
  
  // Gérer l'ajout/retrait des favoris
  const toggleFavorite = async (movie) => {
    try {
      const isFavorite = favorites.some(fav => fav.id === movie.id);
      
      if (isFavorite) {
        await removeMovieFromList(STORAGE_KEYS.FAVORITE_MOVIES, movie.id);
        setFavorites(prev => prev.filter(m => m.id !== movie.id));
      } else {
        await addMovieToList(STORAGE_KEYS.FAVORITE_MOVIES, movie);
        setFavorites(prev => [...prev, movie]);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour des favoris:', error);
    }
  };
  
  // Gérer le marquage comme vu/non vu
  const toggleWatched = async (movie) => {
    try {
      const isWatched = watchedMovies.some(m => m.id === movie.id);
      
      if (isWatched) {
        await removeMovieFromList(STORAGE_KEYS.WATCHED_MOVIES, movie.id);
        setWatchedMovies(prev => prev.filter(m => m.id !== movie.id));
      } else {
        await addMovieToList(STORAGE_KEYS.WATCHED_MOVIES, movie);
        setWatchedMovies(prev => [...prev, movie]);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour des films vus:', error);
    }
  };
  
  // Naviguer vers les détails du film
  const goToMovieDetails = (movie) => {
    navigation.navigate('MovieDetail', { movie });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* En-tête avec barre de recherche */}
      <Header 
        title="Découvrir"
        rightIcon={searchActive ? "times" : "search"}
        onRightPress={() => {
          setSearchActive(!searchActive);
          if (searchActive) {
            setSearchQuery('');
            Keyboard.dismiss();
          }
        }}
      />
      
      {/* Barre de recherche (conditionnelle) */}
      {searchActive && (
        <View style={styles.searchContainer}>
          <FontAwesome name="search" size={16} color={COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un film..."
            placeholderTextColor={COLORS.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
        </View>
      )}
      
      {/* Contenu principal */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Chargement des films...</Text>
        </View>
      ) : (
        <>
          {filteredMovies.length > 0 ? (
            <FlatList
              data={filteredMovies}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.moviesGrid}
              renderItem={({ item }) => {
                const isFavorite = favorites.some(movie => movie.id === item.id);
                const isWatched = watchedMovies.some(movie => movie.id === item.id);
                
                return (
                  <MovieCard
                    movie={item}
                    onPress={() => goToMovieDetails(item)}
                    onFavoritePress={() => toggleFavorite(item)}
                    onWatchedPress={() => toggleWatched(item)}
                    isFavorite={isFavorite}
                    isWatched={isWatched}
                  />
                );
              }}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <FontAwesome name="film" size={50} color={COLORS.textSecondary} />
              <Text style={styles.emptyText}>Aucun film trouvé</Text>
            </View>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: SIZES.borderRadius.medium,
    marginHorizontal: SIZES.medium,
    marginVertical: SIZES.small,
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small,
    ...SHADOWS.small,
  },
  searchInput: {
    flex: 1,
    color: COLORS.text,
    marginLeft: SIZES.small,
    fontSize: SIZES.font.body,
  },
  moviesGrid: {
    paddingHorizontal: SIZES.small,
    paddingBottom: 100, // Espace pour la barre de navigation
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    marginTop: SIZES.medium,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    ...FONTS.subtitle,
    color: COLORS.textSecondary,
    marginTop: SIZES.medium,
  },
});

export default HomeScreen;

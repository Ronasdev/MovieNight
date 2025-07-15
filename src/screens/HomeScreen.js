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

import React, { useState, useEffect, useMemo } from 'react';
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

// Styles et utilitaires (on retire COLORS pour n'utiliser que le thème dynamique)
import { SIZES, FONTS, SHADOWS } from '../utils/theme';
import { useTheme } from '../contexts/ThemeContext';
import ThemedContainer from '../components/ThemedContainer';

// Stockage


// Français: Importation des fonctions de notre service API et du service de stockage.
// English: Importing functions from our API service and storage service.
import { getPopularMovies, getPosterUrl, searchMovies } from '../services/api';
import storageService, { isMovieInList, addMovieToList, removeMovieFromList, getData } from '../services/storageService';

const HomeScreen = ({ navigation }) => {
  // Utilisation du contexte de thème
  const { theme } = useTheme();
  // États
  const [allMovies, setAllMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchActive, setSearchActive] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [watchedMovies, setWatchedMovies] = useState([]);
  
  // SafeArea pour gérer les encoches et barres système
  const insets = useSafeAreaInsets();
  
  // Charger les films depuis l'API au démarrage de l'écran
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        // On récupère les films bruts de l'API
        const moviesFromApi = await getPopularMovies();

        // console.log(moviesFromApi);
        
        // On s'assure que les données sont valides avant de les utiliser
        if (Array.isArray(moviesFromApi)) {
          setAllMovies(moviesFromApi);
          setFilteredMovies(moviesFromApi);
        } else {
          // En cas de réponse invalide, on initialise avec des tableaux vides
          setAllMovies([]);
          setFilteredMovies([]);
        }

      } catch (error) {
        console.error("Erreur lors de la récupération des films:", error);
        setAllMovies([]);
        setFilteredMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
    loadUserLists();
  }, []);
  
  // Charger les listes sauvegardées de l'utilisateur
  const loadUserLists = async () => {
    try {
      // Vous pourriez utiliser le hook useAsyncStorage ici dans une application réelle
      // Mais pour la simplicité du tutoriel, nous utilisons directement les fonctions
      const favs = await getData(storageService.STORAGE_KEYS.FAVORITE_MOVIES) || [];
      const watched = await getData(storageService.STORAGE_KEYS.WATCHED_MOVIES) || [];
      
      if(Array.isArray(favs)) {
        setFavorites(favs);
      }else{
        setFavorites([]);
      }
      if(Array.isArray(watched)) {
        setWatchedMovies(watched);
      }else{
        setWatchedMovies([]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des listes utilisateur:', error);
    }
  };
  
  // Gérer la recherche de films
  useEffect(() => {
    const handleSearch = async () => {
      if (searchQuery.trim() === '') {
        setFilteredMovies(allMovies); // Si la recherche est vide, on affiche tous les films
        return;
      }

      // On filtre localement les films déjà chargés pour une recherche instantanée
      const localResults = allMovies.filter(movie => 
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMovies(localResults);

      // Optionnel: Vous pourriez aussi lancer une recherche sur l'API pour des résultats plus complets
      // const apiResults = await searchMovies(searchQuery);
      // setFilteredMovies(apiResults.map(...)); // formater les résultats de l'API
    };

    const searchTimeout = setTimeout(() => {
      handleSearch();
    }, 300); // On attend 300ms après la saisie pour lancer la recherche (debounce)

    return () => clearTimeout(searchTimeout); // Nettoyage du timeout
  }, [searchQuery, allMovies]);
  
  // Gérer l'ajout/retrait des favoris
  const toggleFavorite = async (movie) => {
    try {
      const isFavorite = favorites.some(fav => fav.id === movie.id);
      
      if (isFavorite) {
        await removeMovieFromList(storageService.STORAGE_KEYS.FAVORITE_MOVIES, movie.id);
        if(Array.isArray(favorites)) {
          setFavorites(prev => prev.filter(m => m.id !== movie.id));
        }
      } else {
        await addMovieToList(storageService.STORAGE_KEYS.FAVORITE_MOVIES, movie);
        if(Array.isArray(favorites)) {
          setFavorites(prev => [...prev, movie]);
        }
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
        await removeMovieFromList(storageService.STORAGE_KEYS.WATCHED_MOVIES, movie.id);
        if(Array.isArray(watchedMovies)) {
            setWatchedMovies(prev => prev.filter(m => m.id !== movie.id));
        }
      } else {
        await addMovieToList(storageService.STORAGE_KEYS.WATCHED_MOVIES, movie);
        if(Array.isArray(watchedMovies)) {
          setWatchedMovies(prev => [...prev, movie]);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour des films vus:', error);
    }
  };
  
  // Naviguer vers les détails du film
  

  // Création des styles dynamiques
    // Création des styles dynamiques, recalculés seulement si le thème change
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <ThemedContainer style={[styles.container, { paddingTop: insets.top }]}>
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
                    <FontAwesome name="search" size={16} color={theme.secondaryTextColor} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un film..."
                        placeholderTextColor={theme.secondaryTextColor}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
        </View>
      )}
      
      {/* Contenu principal */}
      {loading ? (
        <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={'#E91E63'} />
          <Text style={styles.loadingText}>Chargement des films...</Text>
        </View>
      ) : (
        <>
          {filteredMovies?.length > 0 ? (
            <FlatList
              data={filteredMovies}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.moviesGrid}
              renderItem={({ item }) => {
                                const isFavorite = favorites.some(fav => fav.id === item.id);
                const isWatched = watchedMovies.some(watched => watched.id === item.id);
               
                return (
                  <MovieCard
                    movie={item}
                    onPress={() => navigation.navigate('MovieDetail', { movieId: item.id, movieTitle: item.title })}
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
                            <FontAwesome name="film" size={50} color={theme.secondaryTextColor} />
              <Text style={styles.emptyText}>Aucun film trouvé</Text>
            </View>
          )}
        </>
      )}
    </ThemedContainer>
  );
};

// Fonction pour créer les styles en fonction du thème
// Fonction pour créer les styles en fonction du thème
const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    // Le backgroundColor est géré par ThemedContainer
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
        backgroundColor: theme.cardColor,
    borderRadius: SIZES.borderRadius.medium,
    marginHorizontal: SIZES.medium,
    marginVertical: SIZES.small,
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small,
    ...SHADOWS.small,
  },
  searchInput: {
    flex: 1,
        color: theme.textColor,
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
        color: theme.secondaryTextColor,
    marginTop: SIZES.medium,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    ...FONTS.subtitle,
        color: theme.secondaryTextColor,
    marginTop: SIZES.medium,
  },
});

export default HomeScreen;

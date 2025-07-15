// Français:
// Ce fichier centralise toutes les interactions avec l'API The Movie Database (TMDB).
// L'utilisation d'un service dédié comme celui-ci permet de séparer la logique de récupération des données
// de la logique de présentation (vos composants et écrans), ce qui est une excellente pratique en développement.

// English:
// This file centralizes all interactions with The Movie Database (TMDB) API.
// Using a dedicated service like this separates the data fetching logic
// from the presentation logic (your components and screens), which is an excellent development practice.

import axios from 'axios';
import { API_KEY, API_BASE_URL } from '../utils/apiConfig';

// On crée une instance d'axios avec une configuration de base.
// Cela nous évite de répéter l'URL de base et la clé d'API à chaque appel.
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'fr-FR', // On demande les résultats en français
  },
});

// Fonction pour récupérer la liste des films populaires
export const getPopularMovies = async () => {
  try {
    const response = await apiClient.get('/movie/popular');
    return response.data.results;
  } catch (error) {
    // En cas d'erreur, on l'affiche dans la console et on la propage
    console.error('Erreur lors de la récupération des films populaires:', error);
    throw error;
  }
};

// Fonction pour récupérer les détails d'un film spécifique par son ID
export const getMovieDetails = async (movieId) => {
  try {
    const response = await apiClient.get(`/movie/${movieId}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération des détails du film ${movieId}:`, error);
    throw error;
  }
};

// Fonction pour rechercher des films à partir d'une requête textuelle
export const searchMovies = async (query) => {
  try {
    const response = await apiClient.get('/search/movie', {
      params: {
        query: query,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error(`Erreur lors de la recherche de films pour "${query}":`, error);
    throw error;
  }
};

// On peut aussi créer une fonction pour obtenir l'URL complète d'une image
// TMDB fournit des chemins relatifs, il faut donc les préfixer.
export const getPosterUrl = (path) => {
  if (!path) {
    // Retourne une image par défaut si aucune n'est fournie
    return 'https://via.placeholder.com/500x750.png?text=Pas+d\'image';
  }
  return `https://image.tmdb.org/t/p/w500${path}`;
};

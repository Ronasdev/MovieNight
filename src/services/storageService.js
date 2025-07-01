/**
 * storageService.js - Service de gestion du stockage local
 * 
 * Ce service utilise AsyncStorage pour sauvegarder et récupérer
 * les données persistantes de l'application:
 * - Films favoris
 * - Films à voir
 * - Films déjà vus
 * - Paramètres utilisateur
 * 
 * AsyncStorage est une solution de stockage clé-valeur asynchrone et non-chiffrée.
 * Parfait pour les données non-sensibles que l'on veut conserver entre les sessions.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// Clés utilisées pour le stockage
const STORAGE_KEYS = {
  WATCHED_MOVIES: '@MovieNight:watchedMovies',
  FAVORITE_MOVIES: '@MovieNight:favoriteMovies',
  WATCHLIST: '@MovieNight:watchlist',
  USER_SETTINGS: '@MovieNight:userSettings',
};

/**
 * Sauvegarde un tableau d'objets dans AsyncStorage
 * @param {string} key - Clé de stockage
 * @param {Array} data - Données à stocker
 * @returns {Promise<void>}
 */
export const saveData = async (key, data) => {
  try {
    // On convertit l'objet/tableau en chaîne JSON avant de le stocker
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem(key, jsonValue);
    console.log(`Données sauvegardées avec succès pour la clé: ${key}`);
    return true;
  } catch (error) {
    console.error(`Erreur lors de la sauvegarde des données pour la clé ${key}:`, error);
    return false;
  }
};

/**
 * Récupère des données depuis AsyncStorage
 * @param {string} key - Clé de stockage
 * @returns {Promise<any>} - Les données récupérées ou null en cas d'erreur
 */
export const getData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    // Si aucune donnée n'est trouvée, on retourne null
    if (jsonValue === null) {
      console.log(`Aucune donnée trouvée pour la clé: ${key}`);
      return null;
    }
    // On convertit la chaîne JSON en objet/tableau JavaScript
    return JSON.parse(jsonValue);
  } catch (error) {
    console.error(`Erreur lors de la récupération des données pour la clé ${key}:`, error);
    return null;
  }
};

/**
 * Ajoute un film à une liste spécifique
 * @param {string} listKey - Clé de la liste (favoris, à voir, vus)
 * @param {Object} movie - Objet film à ajouter
 * @returns {Promise<boolean>} - Succès de l'opération
 */
export const addMovieToList = async (listKey, movie) => {
  try {
    // Récupération de la liste actuelle
    const currentList = await getData(listKey) || [];
    
    // Vérification si le film existe déjà dans la liste
    const movieExists = currentList.some((item) => item.id === movie.id);
    
    if (!movieExists) {
      // Ajout du film avec la date d'ajout
      const updatedList = [...currentList, { 
        ...movie, 
        addedAt: new Date().toISOString() 
      }];
      
      // Sauvegarde de la liste mise à jour
      await saveData(listKey, updatedList);
      return true;
    }
    
    return false; // Le film existe déjà
  } catch (error) {
    console.error(`Erreur lors de l'ajout du film à la liste ${listKey}:`, error);
    return false;
  }
};

/**
 * Retire un film d'une liste spécifique
 * @param {string} listKey - Clé de la liste (favoris, à voir, vus)
 * @param {number|string} movieId - ID du film à retirer
 * @returns {Promise<boolean>} - Succès de l'opération
 */
export const removeMovieFromList = async (listKey, movieId) => {
  try {
    // Récupération de la liste actuelle
    const currentList = await getData(listKey) || [];
    
    // Filtrage de la liste pour retirer le film
    const updatedList = currentList.filter((movie) => movie.id !== movieId);
    
    // Vérification si un film a été retiré
    if (updatedList.length < currentList.length) {
      // Sauvegarde de la liste mise à jour
      await saveData(listKey, updatedList);
      return true;
    }
    
    return false; // Le film n'était pas dans la liste
  } catch (error) {
    console.error(`Erreur lors du retrait du film de la liste ${listKey}:`, error);
    return false;
  }
};

/**
 * Vérifie si un film est dans une liste spécifique
 * @param {string} listKey - Clé de la liste à vérifier
 * @param {number|string} movieId - ID du film à vérifier
 * @returns {Promise<boolean>} - True si le film est dans la liste
 */
export const isMovieInList = async (listKey, movieId) => {
  try {
    const list = await getData(listKey) || [];
    return list.some((movie) => movie.id === movieId);
  } catch (error) {
    console.error(`Erreur lors de la vérification du film dans la liste ${listKey}:`, error);
    return false;
  }
};

/**
 * Sauvegarde les paramètres utilisateur
 * @param {Object} settings - Paramètres à sauvegarder
 * @returns {Promise<boolean>} - Succès de l'opération
 */
export const saveUserSettings = async (settings) => {
  return saveData(STORAGE_KEYS.USER_SETTINGS, settings);
};

/**
 * Récupère les paramètres utilisateur
 * @returns {Promise<Object>} - Paramètres utilisateur
 */
export const getUserSettings = async () => {
  const settings = await getData(STORAGE_KEYS.USER_SETTINGS);
  return settings || { darkMode: true }; // Valeurs par défaut
};

// Export des constantes et fonctions
export default {
  STORAGE_KEYS,
  saveData,
  getData,
  addMovieToList,
  removeMovieFromList,
  isMovieInList,
  saveUserSettings,
  getUserSettings,
};

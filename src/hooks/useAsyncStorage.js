/**
 * useAsyncStorage.js - Hook personnalisé pour AsyncStorage
 * 
 * Ce hook simplifie l'utilisation d'AsyncStorage dans les composants React
 * en fournissant:
 * - Un état local synchronisé avec AsyncStorage
 * - Des fonctions pour manipuler cet état tout en gardant AsyncStorage à jour
 * - Une gestion des erreurs et des chargements
 * 
 * Ce hook est central pour la démonstration d'AsyncStorage dans le tutoriel.
 */

import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Hook personnalisé pour interagir avec AsyncStorage
 * 
 * @param {string} key - Clé AsyncStorage
 * @param {any} initialValue - Valeur initiale si rien n'existe en storage
 * @returns {Array} - [storedValue, setValue, loading, error]
 */
const useAsyncStorage = (key, initialValue = null) => {
  // État pour stocker la valeur récupérée
  const [storedValue, setStoredValue] = useState(initialValue);
  
  // État pour suivre le chargement
  const [loading, setLoading] = useState(true);
  
  // État pour stocker les erreurs éventuelles
  const [error, setError] = useState(null);

  /**
   * Fonction d'initialisation pour récupérer les données depuis AsyncStorage
   */
  const initializeStorage = useCallback(async () => {
    try {
      setLoading(true);
      // Récupération des données depuis AsyncStorage
      const item = await AsyncStorage.getItem(key);
      
      // Si des données existent, les parser et les stocker dans l'état local
      // Sinon, utiliser la valeur initiale fournie
      const value = item ? JSON.parse(item) : initialValue;
      setStoredValue(value);
      setError(null);
    } catch (e) {
      console.error(`Erreur lors de la récupération de la clé ${key}:`, e);
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [key, initialValue]);

  // Chargement initial des données au montage du composant
  useEffect(() => {
    initializeStorage();
  }, [initializeStorage]);

  /**
   * Fonction pour mettre à jour la valeur dans l'état et AsyncStorage
   * @param {any} newValue - Nouvelle valeur ou fonction pour mettre à jour la valeur
   */
  const setValue = useCallback(async (newValue) => {
    try {
      // Permettre aux fonctions de mise à jour d'accéder à l'état précédent
      const valueToStore =
        newValue instanceof Function ? newValue(storedValue) : newValue;
      
      // Mise à jour de l'état local
      setStoredValue(valueToStore);
      
      // Mise à jour d'AsyncStorage
      await AsyncStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (e) {
      console.error(`Erreur lors de la mise à jour de la clé ${key}:`, e);
      setError(e);
    }
  }, [key, storedValue]);

  /**
   * Fonction pour forcer le rechargement des données depuis AsyncStorage
   */
  const refreshData = useCallback(() => {
    initializeStorage();
  }, [initializeStorage]);

  // On retourne les états et fonctions nécessaires
  return [storedValue, setValue, loading, error, refreshData];
};

export default useAsyncStorage;

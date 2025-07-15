/**
 * Header.js - Composant d'en-tête personnalisable
 * 
 * Ce composant représente la barre d'en-tête qui apparaît en haut des écrans.
 * Il est entièrement dynamique et s'adapte au thème (clair/sombre).
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SIZES, FONTS } from '../utils/theme';
import { useTheme } from '../contexts/ThemeContext';

// La fonction de création des styles est déplacée à l'extérieur pour la clarté.
const createStyles = (theme) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent', // Le fond est géré par le conteneur parent (ThemedContainer)
    paddingBottom: SIZES.small,
    paddingHorizontal: SIZES.medium,
    borderBottomWidth: 1,
    borderBottomColor: theme.separator, // Utilisation de la couleur du thème
  },
  leftContainer: {
    width: 40,
    alignItems: 'flex-start',
  },
  rightContainer: {
    width: 40,
    alignItems: 'flex-end',
  },
  title: {
    ...FONTS.h3,
    color: theme.textColor, // Utilisation de la couleur du thème
    textAlign: 'center',
    flex: 1,
  },
  button: {
    paddingVertical: SIZES.base,
  },
});

/**
 * Composant Header - Barre d'en-tête personnalisable
 * 
 * @param {string} title - Titre à afficher au centre
 * @param {boolean} showBackButton - Afficher ou non le bouton retour
 * @param {Function} onBackPress - Fonction appelée lors du clic sur le bouton retour
 * @param {string} rightIcon - Nom de l'icône à afficher à droite (de FontAwesome)
 * @param {Function} onRightPress - Fonction appelée lors du clic sur le bouton droit
 * @param {Object} style - Styles supplémentaires pour le header
 */
const Header = ({ 
  title, 
  showBackButton = false, 
  onBackPress, 
  rightIcon, 
  onRightPress,
  style = {} 
}) => {
  // Utilisation du contexte de thème
  const { theme } = useTheme();
  // Utilisation de SafeAreaInsets pour adapter l'en-tête à l'encoche/barre d'état
  const insets = useSafeAreaInsets();
  
  // Styles dynamiques basés sur le thème actuel
  const styles = React.useMemo(() => createStyles(theme), [theme]);
  
  return (
    <View style={[
      styles.container,
      { paddingTop: insets.top }, // Ajoute un padding en haut pour la barre d'état
      style
    ]}>
      {/* Partie gauche: bouton retour ou espace vide */}
      <View style={styles.leftContainer}>
        {showBackButton ? (
          <TouchableOpacity 
            style={styles.button} 
            onPress={onBackPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // Zone de clic étendue
          >
            <FontAwesome name="chevron-left" size={18} color={theme.textColor} />
          </TouchableOpacity>
        ) : <View style={{ width: 40 }} />}
      </View>
      
      {/* Titre central */}
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      
      {/* Partie droite: bouton d'action optionnel ou espace vide */}
      <View style={styles.rightContainer}>
        {rightIcon ? (
          <TouchableOpacity 
            style={styles.button} 
            onPress={onRightPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // Zone de clic étendue
          >
            <FontAwesome name={rightIcon} size={18} color={theme.textColor} />
          </TouchableOpacity>
        ) : <View style={{ width: 40 }} />}
      </View>
    </View>
  );
};



export default Header;

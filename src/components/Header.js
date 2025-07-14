/**
 * Header.js - Composant d'en-tête personnalisable
 * 
 * Ce composant représente la barre d'en-tête qui apparaît en haut des écrans.
 * Il peut inclure:
 * - Un titre
 * - Un bouton de retour (optionnel)
 * - Un bouton d'action à droite (optionnel)
 * 
 * Ce composant est conçu pour être réutilisé sur tous les écrans
 * de l'application avec différentes configurations.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { COLORS, SIZES, FONTS } from '../utils/theme';
import { useTheme } from '../contexts/ThemeContext';

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
  const { isDarkMode, theme } = useTheme();
  // Utilisation de SafeAreaInsets pour adapter l'en-tête à l'encoche/barre d'état
  const insets = useSafeAreaInsets();
  
  // Styles dynamiques basés sur le thème actuel
  const styles = React.useMemo(() => StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: 'transparent', // Le fond est géré par ThemedContainer
      paddingBottom: SIZES.small,
      paddingHorizontal: SIZES.medium,
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
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
      color: isDarkMode ? COLORS.text : theme.textColor,
      textAlign: 'center',
      flex: 1,
    },
    backButton: {
      paddingVertical: SIZES.base,
    },
    rightButton: {
      paddingVertical: SIZES.base,
    },
  }), [isDarkMode, theme]);
  
  return (
    <View style={[
      styles.container,
      { paddingTop: insets.top },
      style
    ]}>
      {/* Partie gauche: bouton retour ou espace vide */}
      <View style={styles.leftContainer}>
        {showBackButton ? (
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={onBackPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <FontAwesome name="chevron-left" size={18} color={isDarkMode ? COLORS.text : theme.textColor} />
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
            style={styles.rightButton} 
            onPress={onRightPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <FontAwesome name={rightIcon} size={18} color={isDarkMode ? COLORS.text : theme.textColor} />
          </TouchableOpacity>
        ) : <View style={{ width: 40 }} />}
      </View>
    </View>
  );
};



export default Header;

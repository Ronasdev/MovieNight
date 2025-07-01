/**
 * Theme.js - Fichier de configuration du thème de l'application
 * 
 * Ce fichier contient toutes les constantes liées au design de l'application:
 * - Couleurs
 * - Espacement
 * - Typographie
 * - Ombres
 * 
 * L'utilisation d'un fichier centralisé pour le thème facilite la maintenance
 * et permet de changer rapidement l'apparence de toute l'application.
 */

export const COLORS = {
  // Couleurs principales
  primary: '#2E5BFF',      // Bleu principal
  secondary: '#FF6B6B',    // Rouge accent
  
  // Couleurs de fond
  background: '#121212',   // Fond principal (mode sombre)
  card: '#1E1E1E',         // Fond des cartes
  cardLight: '#2A2A2A',    // Fond des cartes plus clair
  
  // Couleurs de texte
  text: '#FFFFFF',         // Texte principal
  textSecondary: '#B3B3B3',// Texte secondaire
  textMuted: '#6C757D',    // Texte peu important
  
  // Couleurs de statut
  success: '#4CAF50',      // Vert pour succès
  warning: '#FFC107',      // Jaune pour avertissement
  error: '#F44336',        // Rouge pour erreur
  
  // Couleurs des étoiles de notation
  star: '#FFD700',         // Or pour étoiles actives
  starInactive: '#555555', // Gris pour étoiles inactives
  
  // Dégradés (utilisés avec LinearGradient)
  gradientPrimary: ['#2E5BFF', '#4F6AFF'],
  gradientCard: ['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.4)'],
};

export const SIZES = {
  // Espacement de base
  base: 8,
  small: 12,
  medium: 16,
  large: 24,
  xlarge: 32,
  xxlarge: 40,
  
  // Bordures et rayons
  borderRadius: {
    small: 4,
    medium: 8,
    large: 12,
    xlarge: 20,
    full: 1000,
  },
  
  // Tailles de texte
  font: {
    caption: 12,
    body: 14,
    subtitle: 16,
    title: 18,
    h3: 20,
    h2: 24,
    h1: 30,
  },
};

export const FONTS = {
  // Poids de police
  regular: {
    fontWeight: '400',
  },
  medium: {
    fontWeight: '500',
  },
  semiBold: {
    fontWeight: '600',
  },
  bold: {
    fontWeight: '700',
  },
  
  // Styles composés
  caption: {
    fontSize: SIZES.font.caption,
    fontWeight: '400',
  },
  body: {
    fontSize: SIZES.font.body,
    fontWeight: '400',
  },
  subtitle: {
    fontSize: SIZES.font.subtitle,
    fontWeight: '500',
  },
  title: {
    fontSize: SIZES.font.title,
    fontWeight: '600',
  },
  h3: {
    fontSize: SIZES.font.h3,
    fontWeight: '700',
  },
  h2: {
    fontSize: SIZES.font.h2,
    fontWeight: '700',
  },
  h1: {
    fontSize: SIZES.font.h1,
    fontWeight: '700',
  },
};

// Styles d'ombres pour différentes plateformes
export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 5,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
};

// Export d'un objet thème global pour faciliter l'import
export default {
  COLORS,
  SIZES,
  FONTS,
  SHADOWS,
};

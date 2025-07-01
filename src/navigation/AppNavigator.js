/**
 * AppNavigator.js - Configuration de la navigation de l'application
 * 
 * Ce fichier configure toute la structure de navigation de l'application:
 * - Navigation par onglets pour les écrans principaux
 * - Navigation par pile (Stack) pour les écrans détaillés
 * 
 * La Stack Navigation est un élément central de cette démo, montrant
 * comment naviguer entre différents écrans tout en conservant un historique.
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';

// Import des écrans
import HomeScreen from '../screens/HomeScreen';
import WatchlistScreen from '../screens/WatchlistScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MovieDetailScreen from '../screens/MovieDetailScreen';

// Import du thème
import { COLORS, SIZES } from '../utils/theme';

// Création des navigateurs
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

/**
 * TabNavigator - Navigation par onglets pour les écrans principaux
 */
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.background,
          borderTopColor: 'rgba(255,255,255,0.1)',
          paddingBottom: SIZES.base,
          height: 60,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 5,
        }
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarLabel: 'Découvrir',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="film" size={20} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Watchlist" 
        component={WatchlistScreen} 
        options={{
          tabBarLabel: 'À voir',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="list" size={20} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Favorites" 
        component={FavoritesScreen} 
        options={{
          tabBarLabel: 'Favoris',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="heart" size={20} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
          tabBarLabel: 'Profil',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="user" size={20} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

/**
 * AppNavigator - Navigation principale de l'application
 * Combine TabNavigator et StackNavigator
 */
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="MainTabs"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: COLORS.background },
        }}
      >
        {/* Navigation par onglets comme écran principal */}
        <Stack.Screen 
          name="MainTabs" 
          component={TabNavigator} 
        />
        
        {/* Écrans accessibles via navigation Stack */}
        <Stack.Screen 
          name="MovieDetail" 
          component={MovieDetailScreen} 
          options={{
            // Animation de transition personnalisée
            cardStyleInterpolator: ({ current, layouts }) => {
              return {
                cardStyle: {
                  transform: [
                    {
                      translateY: current.progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [layouts.screen.height, 0],
                      }),
                    },
                  ],
                },
              };
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

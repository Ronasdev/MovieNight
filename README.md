# MovieNight

![MovieNight Logo](./assets/icon.png)

## 📱 Présentation

**MovieNight** est une application mobile moderne développée avec React Native et Expo qui permet aux utilisateurs de suivre leurs films préférés, ceux qu'ils ont vus et ceux qu'ils souhaitent voir. L'application offre une interface utilisateur élégante et intuitive avec un thème sombre par défaut.

Cette application a été créée pour la chaîne YouTube [RonasDev](https://www.youtube.com/ronasdev) comme exemple d'application React Native mettant en valeur AsyncStorage et Stack Navigation.

## ✨ Fonctionnalités

- **Découverte de films** - Parcourez une sélection de films populaires
- **Liste de films à voir** - Gardez une trace des films que vous voulez regarder
- **Favoris** - Marquez vos films préférés
- **Films vus** - Suivez les films que vous avez déjà regardés
- **Détails des films** - Consultez des informations détaillées sur chaque film
- **Thème sombre** - Interface utilisateur moderne et agréable pour les yeux
- **Données persistantes** - Vos listes sont sauvegardées entre les sessions

## 🛠️ Technologies utilisées

- [React Native](https://reactnative.dev/) - Framework pour applications mobiles
- [Expo](https://expo.dev/) - Plateforme pour développer des applications React Native
- [React Navigation](https://reactnavigation.org/) - Navigation entre écrans
  - Stack Navigation pour les écrans détaillés
  - Tab Navigation pour les sections principales
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) - Stockage de données persistant
- [Expo Linear Gradient](https://docs.expo.dev/versions/latest/sdk/linear-gradient/) - Effets visuels avancés
- [React Native Vector Icons](https://github.com/oblador/react-native-vector-icons) - Icônes pour l'interface utilisateur

## 📋 Prérequis

- [Node.js](https://nodejs.org/) (v14 ou supérieur)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/workflow/expo-cli/)
- Un appareil mobile ou un émulateur

## 🚀 Installation

1. Clonez ce dépôt :
```bash
git clone https://github.com/votre-username/MovieNight.git
cd MovieNight
```

2. Installez les dépendances :
```bash
npm install
# ou
yarn install
```

3. Démarrez l'application :
```bash
expo start
# ou
npm start
# ou
yarn start
```

4. Scannez le code QR avec l'application Expo Go (Android) ou l'appareil photo (iOS) ou utilisez un émulateur.

## 📂 Structure du projet

```
MovieNight/
├── assets/                 # Ressources statiques (images, icônes)
├── src/
│   ├── components/         # Composants réutilisables
│   ├── screens/            # Écrans de l'application
│   ├── navigation/         # Configuration de la navigation
│   ├── services/           # Services (AsyncStorage, API)
│   ├── hooks/              # Hooks personnalisés
│   └── utils/              # Utilitaires et constantes
├── App.js                  # Point d'entrée principal
└── package.json            # Configuration des dépendances
```

## 📱 Écrans principaux

- **HomeScreen** - Découverte de films
- **WatchlistScreen** - Liste de films à voir
- **FavoritesScreen** - Films marqués comme favoris
- **ProfileScreen** - Statistiques utilisateur et préférences
- **MovieDetailScreen** - Détails d'un film spécifique

## 🧠 Points forts d'implémentation

### AsyncStorage
L'application utilise AsyncStorage pour stocker localement les préférences utilisateur et les listes de films. Un hook personnalisé `useAsyncStorage` a été créé pour faciliter l'utilisation d'AsyncStorage dans les composants React.

```javascript
// Exemple d'utilisation du hook useAsyncStorage
const [favorites, setFavorites, loading, error, refreshData] = 
  useAsyncStorage(STORAGE_KEYS.FAVORITE_MOVIES, []);
```

### Navigation
MovieNight utilise React Navigation avec une combinaison de navigation par onglets pour les sections principales et navigation par pile pour les écrans de détails.

```javascript
// Exemple de navigation vers l'écran détaillé d'un film
navigation.navigate('MovieDetail', { movie });
```

## 📝 Notes pour les développeurs

Cette application a été créée à des fins éducatives pour la chaîne YouTube RonasDev. Les données de films sont simulées localement, mais vous pourriez facilement la connecter à une API comme [TMDB](https://www.themoviedb.org/documentation/api) pour obtenir des données réelles.

## 📚 Ressources additionnelles

- [Tutoriel complet sur YouTube](https://www.youtube.com/ronasdev)
- [Documentation React Native](https://reactnative.dev/docs/getting-started)
- [Documentation Expo](https://docs.expo.dev/)
- [Documentation React Navigation](https://reactnavigation.org/docs/getting-started)

## 📄 Licence

Ce projet est sous licence MIT.

---

⭐️ **Créé par [RonasDev](https://www.youtube.com/ronasdev)** ⭐️

/**
 * mockData.js - Données de démonstration pour l'application
 * 
 * Ce fichier contient des données de films fictives pour le développement et le tutoriel.
 * Dans une application réelle, ces données viendraient d'une API comme TMDB.
 * 
 * Ces données permettent de tester l'application sans avoir besoin
 * d'une connexion internet ou d'une clé API.
 */

// Liste de films populaires avec les données essentielles
const mockMovies = [
  {
    id: 1,
    title: "Inception",
    poster_path: "/8IB2e4r4oVhHnANbnm7O3Tj6tF8.jpg",
    backdrop_path: "/8ZTVqHMk1RvpGe1NRbYdVXAZQXA.jpg",
    overview: "Dom Cobb est un voleur expérimenté, le meilleur dans l'art dangereux de l'extraction, voler les secrets les plus intimes enfouis au plus profond du subconscient durant une phase de rêve, lorsque l'esprit est le plus vulnérable.",
    release_date: "2010-07-16",
    vote_average: 8.4,
    genres: ["Action", "Science-Fiction", "Aventure"],
  },
  {
    id: 2,
    title: "The Dark Knight",
    poster_path: "/1hRoyzDtpgMU7Dz4JF22RANzQO7.jpg",
    backdrop_path: "/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg",
    overview: "Batman aborde une phase décisive de sa guerre contre le crime à Gotham City. Avec l'aide du lieutenant de police Jim Gordon et du procureur Harvey Dent, il entreprend de démanteler les dernières organisations criminelles qui infestent les rues de la ville.",
    release_date: "2008-07-18",
    vote_average: 8.5,
    genres: ["Action", "Crime", "Drame", "Thriller"],
  },
  {
    id: 3,
    title: "Parasite",
    poster_path: "/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    backdrop_path: "/ApiBzeaa95TNYliSbQ8pJv4Fje7.jpg",
    overview: "Toute la famille de Ki-taek est au chômage, et s'intéresse fortement au train de vie de la richissime famille Park. Un jour, leur fils réussit à se faire recommander pour donner des cours particuliers d'anglais chez les Park.",
    release_date: "2019-05-30",
    vote_average: 8.5,
    genres: ["Comédie", "Drame", "Thriller"],
  },
  {
    id: 4,
    title: "Interstellar",
    poster_path: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    backdrop_path: "/xJHokMbljvjADYdit5fK5VQsXEG.jpg",
    overview: "Dans un futur proche, face à une Terre exsangue, un groupe d'explorateurs utilise un vaisseau interstellaire pour franchir un trou de ver permettant de parcourir des distances jusque-là infranchissables.",
    release_date: "2014-11-07",
    vote_average: 8.3,
    genres: ["Aventure", "Drame", "Science-Fiction"],
  },
  {
    id: 5,
    title: "Pulp Fiction",
    poster_path: "/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
    backdrop_path: "/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg",
    overview: "L'odyssée sanglante et burlesque de petits malfrats dans la jungle de Hollywood à travers trois histoires qui s'entremêlent.",
    release_date: "1994-10-14",
    vote_average: 8.5,
    genres: ["Thriller", "Crime"],
  },
  {
    id: 6,
    title: "Le Voyage de Chihiro",
    poster_path: "/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",
    backdrop_path: "/Ab8mkHmkYADjU7wQiOkia9BzGvS.jpg",
    overview: "Chihiro, une fillette de 10 ans, est en route vers sa nouvelle demeure en compagnie de ses parents. Au cours du voyage, la famille fait une halte dans un parc à thème qui leur paraît abandonné.",
    release_date: "2001-07-20",
    vote_average: 8.5,
    genres: ["Animation", "Familial", "Fantastique"],
  },
  {
    id: 7,
    title: "Fight Club",
    poster_path: "/a26cQPRhJPX6GbWfQbvZdrrp9j9.jpg",
    backdrop_path: "/rr7E0NoGKxvbkb89eR1GwfoYjpA.jpg",
    overview: "Le narrateur, sans identité précise, vit seul, travaille seul, dort seul, mange seul ses plateaux-repas pour micro-ondes. C'est pourquoi il va devenir membre du Fight club, un lieu clandestin où il va pouvoir retrouver sa virilité.",
    release_date: "1999-10-15",
    vote_average: 8.4,
    genres: ["Drame"],
  },
  {
    id: 8,
    title: "Avengers: Endgame",
    poster_path: "/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
    backdrop_path: "/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg",
    overview: "Après leur défaite face à Thanos, les Avengers et les Gardiens de la Galaxie restants luttent pour sauver l'univers.",
    release_date: "2019-04-26",
    vote_average: 8.3,
    genres: ["Action", "Aventure", "Science-Fiction"],
  },
  {
    id: 9,
    title: "Joker",
    poster_path: "/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
    backdrop_path: "/n6bUvigpRFqSwmPp1m2YADdbRBc.jpg",
    overview: "Arthur Fleck, comédien raté, rencontre des voyous violents en errant dans les rues de Gotham City déguisé en clown. Méprisé par la société, Fleck s'enfonce peu à peu dans la démence et devient le génie criminel connu sous le nom de Joker.",
    release_date: "2019-10-02",
    vote_average: 8.2,
    genres: ["Crime", "Thriller", "Drame"],
  },
  {
    id: 10,
    title: "Coco",
    poster_path: "/eKi8dIrr8voobbaGzDpe8w0PVbC.jpg",
    backdrop_path: "/askg3SMvhqEl4OL52YuvdtY40Yb.jpg",
    overview: "Depuis déjà plusieurs générations, la musique est bannie dans la famille de Miguel. Un vrai déchirement pour le jeune garçon dont le rêve ultime est de devenir un musicien aussi accompli que son idole, Ernesto de la Cruz.",
    release_date: "2017-11-22",
    vote_average: 8.2,
    genres: ["Animation", "Familial", "Fantastique", "Aventure"],
  },
  {
    id: 11,
    title: "Your Name",
    poster_path: "/q719jXXEzOoYaps6babgKnONONX.jpg",
    backdrop_path: "/mMtUybQ6hL24FXo0F3Z4j2KG7kZ.jpg",
    overview: "Mitsuha est une lycéenne qui réside dans une petite ville située dans les montagnes. Elle vit aux côtés de sa petite sœur, sa grand-mère et son père, bien qu'elle n'entretienne pas d'excellentes relations avec ce dernier.",
    release_date: "2016-08-26",
    vote_average: 8.5,
    genres: ["Romance", "Animation", "Drame"],
  },
  {
    id: 12,
    title: "Spider-Man: No Way Home",
    poster_path: "/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
    backdrop_path: "/iQFcwSGbZXMkeyKrxbPnwnRo5fl.jpg",
    overview: "Avec l'identité de Spider-Man désormais révélée, Peter demande de l'aide au docteur Strange. Lorsqu'un sort tourne mal, des ennemis dangereux d'autres mondes commencent à apparaître, forçant Peter à découvrir ce que signifie vraiment être Spider-Man.",
    release_date: "2021-12-15",
    vote_average: 8.0,
    genres: ["Action", "Aventure", "Science-Fiction"],
  },
];

export default mockMovies;

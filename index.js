// Modules de base pour créer un serveur
import { ApolloServer } from '@apollo/server'; // On importe le module ApolloServer
import { readFileSync } from 'fs'; // On importe le module fs pour lire le fichier schema.graphql
import { startStandaloneServer } from '@apollo/server/standalone'; // On importe le module standalone pour lancer le serveur Apollo
import jwt  from "jsonwebtoken"; // On importe le module jsonwebtoken
// Importe les variables d'environnement
import dotenv from 'dotenv';
dotenv.config();

// On importe nos types et nos resolvers
const typeDefs = readFileSync('./schema.graphql', { encoding: 'utf-8' });
import { resolvers } from './resolvers.js';

// Creation d'une instance ApolloServer
const server = new ApolloServer({
  typeDefs, // On passe nos types à ApolloServer
  resolvers, // On passe nos resolvers à ApolloServer

  // On définit le contexte de notre application. Le contexte est un objet qui est passé à chaque resolver et qui contient des informations sur la requête en cours.
  context: async ({ req, res }) => {
    // On tente de récupérer le token dans le header Authorization
    const token = req.headers.authorization || '';
    // SI le token est présent dans le header ALORS on le vérifie
    if (token) {
      try {
        const decodedToken = jwt.verify(token, process.env.APP_SECRET);
        // On retourne l'utilisateur qui a fait la requête
        return { user: decodedToken };
      } catch (err) {
        throw new Error('Invalid token');
      }
    }
    if (!token) {
      throw new Error('No token found'); // Si le token n'est pas présent dans le header, on retourne une erreur
    }

    // On retourne l'utilisateur qui a fait la requête (null si l'utilisateur n'est pas connecté)
    const user = await getUser(token);
    console.log(user);
    return { user };
   
  },
});
// On lance le serveur
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀 Server ready at ${url}`);

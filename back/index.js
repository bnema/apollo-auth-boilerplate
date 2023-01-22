// Modules de base pour créer un serveur
import { ApolloServer } from '@apollo/server'; // On importe le module ApolloServer
import { readFileSync } from 'fs'; // On importe le module fs pour lire le fichier schema.graphql
import { startStandaloneServer } from '@apollo/server/standalone'; // On importe le module standalone pour lancer le serveur Apollo
import dotenv from 'dotenv';
dotenv.config();

// On importe nos types et nos resolvers
const typeDefs = readFileSync('./schema.graphql', { encoding: 'utf-8' });
import { resolvers } from './resolvers.js';

// Creation d'une instance ApolloServer
const server = new ApolloServer({
  typeDefs, // On passe nos types à ApolloServer
  resolvers, // On passe nos resolvers à ApolloServer
  
});

// On lance le serveur
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀 Server ready at ${url}`);

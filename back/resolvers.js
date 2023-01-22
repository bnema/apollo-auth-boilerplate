import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
// On a besoin de bcrypt et de jsonwebtoken pour la mutation "login"
import bcrypt from "bcrypt";
import jwt  from "jsonwebtoken";
const { sign, verify } = jwt;
// Importe les variables d'environnement
import dotenv from 'dotenv';
dotenv.config();
const APP_SECRET = process.env.APP_SECRET;


// Fonction async qui prend le token, l'analyse et répond en bolean si le token est valide ou non
async function verifyTokenJwt(token) {
  try {
    const valid = verify(token, APP_SECRET);
    if (valid) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    // Si l'erreur est jwt expired, on retourne un message d'erreur
    if (error.name === "TokenExpiredError") {
      return {
        error: "Token is expired"
      }
    }
    // Si l'erreur est jwt malformed, on retourne un message d'erreur
    if (error.name === "JsonWebTokenError") {
      return {
        error: "Token is malformed"
      }
    }
    return false;
  }
}

// On définit les resolvers. Ce sont des fonctions qui vont être appelées quand on fait une requête ou une mutation.
const resolvers = {
    // On définit les resolvers pour les queries.
    // allUsers va retourner tous les utilisateurs de notre application.
    Query: {
    allUsers: async () => {
      return await prisma.user.findMany();
    },
    oneUser: async (parent, args, context, info) => {
      return await prisma.user.findUnique({
        where: {
          id: args.id,
        },
      });
    },
    // verifyToken va vérifier un token et retourner un status et l'id de l'utilisateur
    verifyToken: async (parent, args, context, info) => {
      // On défini ce que le type TokenResponse.status peut retourner
      try {
      // On récupère le token dans le payload
      const token = args.token;
      console.log("Token reçu pour analyse " + token);
      // On vérifie le token avec notre function verifyToken
      const valid = await verifyTokenJwt(token);
    
      // Notre type TokenResponse retourne un status et userId
      // Si le token est valide, on retourne l'utilisateur qui a fait la requête
      if (valid === true) {
        console.log("Token valide");
        // Check who is the user in the token
        const decoded = jwt.decode(token);
        const user = await prisma.user.findUnique({
          where: {
            id: decoded.userId
          }});
        
        return {
          user : user,
          status: 200
          }
          } else {
            // Si le token n'est pas valide, on retourne un status 401
            console.log("Token invalide");
            return {
              status: 401,
              error: "Token invalide"
            }
          }
        }
      catch (error) {
       throw new Error(error);
         }
       },
    },

    Mutation: {
    // login va vérifier que l'utilisateur existe bien et que le mot de passe est correct puis va retourner un token.
    login: async (parent, args, context, info) => {
        // Recherche de l'utilisateur correspondant à l'adresse e-mail fournie
        const user = await prisma.user.findUnique({
            where: {
                email: args.email,
            },
        });
        // Si l'utilisateur n'existe pas, on retourne une erreur
        if (!user) {
            throw new Error(`Le compte n'existe pas`);
        }
        // On vérifie que le mot de passe est correct
        const valid = await bcrypt.compare(args.password, user.password);
        if (!valid) {
          throw new Error("Mot de passe incorrect");
        }
        // Création du token avec jsonwebtoken
        const token = sign({ userId: user.id }, APP_SECRET);
        // Console.log l'utilisateur et le token
        console.log(`User: ${user.name} - Token: ${token} est connecté`);

        // On prépare la réponse à retourner qui contient le token et l'utilisateur
       const response = {
          token: token
       }

        // On retourne la réponse
        return response;


      },
    // signup va créer un nouvel utilisateur et l'ajouter à la base de données (en cryptant le mot de passe).
    signup: async (parent, args, context, info) => {
        // On vérifie que l'utilisateur n'existe pas déjà
        const userExists = await prisma.user.findUnique({
            where: {
                email: args.email,
            },
        });
        // Si l'utilisateur existe déjà, on retourne une erreur
        if (userExists) {
            throw new Error(`L'utilisateur existe déjà`);
        }
        // On crypte le mot de passe avec bcrypt
        const password = await bcrypt.hash(args.password, 10);
        // On crée l'utilisateur dans la base de données
        const user = await prisma.user.create({
          data: {
            email: args.email,
            password: password,
            name: args.name
          }
        });
        // On crée un token avec jsonwebtoken
        const token = sign({ userId: user.id }, APP_SECRET);
        // On retourne le token et l'utilisateur
        return { token, user };
      },
    },
  };
  
  export { resolvers }
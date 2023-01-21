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
    // allPosts va retourner tous les posts de notre application.
    allPosts: async () => {
      return await prisma.post.findMany();
    },
    onePost: async (parent, args, context, info) => {
      return await prisma.post.findUnique({
        where: {
          id: args.id,
        },
      });
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
            throw new Error("No such user found");
        }

        const valid = await bcrypt.compare(args.password, user.password);
        if (!valid) {
          throw new Error("Invalid password");
        }
        // Création du token avec jsonwebtoken
        const token = sign({ userId: user.id }, APP_SECRET);
        // Retour du token et de l'utilisateur
        return {
          token,
          user,
        };
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
            throw new Error("User already exists");
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
    // createPost va créer un post et l'ajouter à la base de données.
    createPost: async (parent, args, context, info) => {
      return await prisma.post.create({
        data: {
          title: args.title,
          content: args.content,
          published: args.published,
          authorID: args.authorID,
        },
      });
    },
    // updatePost va modifier un post et l'ajouter à la base de données.
    updatePost: async (parent, args, context, info) => {
      return await prisma.post.update({
        where: {
          id: args.id,
        },
        data: {
          title: args.title,
          content: args.content,
          published: args.published,
        },
      });
    },
    // deletePost va supprimer un post de la base de données.
    deletePost: async (parent, args, context, info) => {
      return await prisma.post.delete({
        where: {
          id: args.id,
        },
      });
    },
    // deleteUser va supprimer un utilisateur de la base de données.
    deleteUser: async (parent, args, context, info) => {
      return await prisma.user.delete({
        where: {
          id: args.id,
        },
      });
    }
    }
  };
  
  export { resolvers }
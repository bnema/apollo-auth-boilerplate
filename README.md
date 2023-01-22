# 🚀 Apollo Auth Boilerplate

Ceci est un boilerplate d'un composant d'authentification NodeJS full-stack utilisant Apollo Server et Apollo Client. Le backend utilise GraphQL et Prisma. Le frontend utilise Vite.js et React.

Ce boilerplate est réalisé dans le but d'être utilisé comme base pour des projets futurs. Il est donc possible qu'il soit mis à jour régulièrement.

Je tiens également à signaler que je suis novice en GraphQL, donc si vous avez des suggestions ou des commentaires, n'hésitez pas à me contacter ou faire une pull request.

✌

## Backend

__Stack du backend :__
- Apollo Server 
- Prisma 
- bcrypt 
- jsonwebtoken 

__Features :__
- Une définition de schéma pour l'API GraphQL
- Des résolveurs pour gérer diverses requêtes et mutations, tels que allUsers, oneUser, login et signup
- Vérification de jetons pour l'authentification
- Connexion à une base de données via Prisma pour stocker et récupérer des données

Le backend est lancé sur le port 4000 et peut être consulté à l'adresse http://localhost:4000/.

## Frontend

__Stack du frontend :__
- Vite.js
- React 
- Apollo Client 

__Features :__
- Un composant de connexion pour les utilisateurs existants
- Un composant d'inscription pour les nouveaux utilisateurs
- Une page de tableau de bord pour les utilisateurs après la connexion
- Gestion de jetons en utilisant localStorage

Le frontend est lancé sur le port 5173 et peut être consulté à l'adresse http://localhost:5173/.

## Installation

Il faut réaliser un npm install dans chaque dossier (backend et frontend) pour installer les dépendances.

```bash
npm install
```

Il y a 2 variables d'environnement à définir dans un .env pour le back :
```bash
APP_SECRET=(clé secrète pour la génération de jetons)
PG_URL=(URL de connexion à la base de données PostgreSQL via Prisma)
```
(Il est en théorie possible d'appliquer le modèle à d'autres bases de données, mais je n'ai pas testé)

Générer le schéma de la base de données :
```bash
npx prisma migrate dev --name init
npx prisma generate
```
Lancer le serveur backend :
```bash
cd back/ && npm run start
```
Puis le serveur frontend :
```bash
cd front/ && npm run dev

```

## Licence

Ce boilerplate est sous licence Apache 2.0. Vous pouvez en utiliser les codes sources à des fins commerciales ou non-commerciales, mais vous devez inclure un avis de copyright et une copie de la licence dans toutes les copies ou parties substantielles du logiciel.

## Auteur

- [@bnema](https://www.github.com/bnema)
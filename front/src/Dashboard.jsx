import { useState } from 'react'
import { useQuery, gql, useMutation } from '@apollo/client';
import './App.css'

// Vue /dashboard : affiche le dashboard de l'utilisateur connecté
const token = localStorage.getItem('token');

// verifyToken: async (parent, args, context, info) => {
//     const token = args.token;
//     const valid = await jwt.verify(token, process.env.APP_SECRET);
//     // On retourne l'utilisateur qui a fait la requête
//     if (valid) {
//       return {
//         user: {
//           id: args.id,
//           name: args.name,
//           email: args.email,
//         },
//       };
//     } else { 
//       // Si le token n'est pas valide, on retourne une erreur "fuck you"
//       throw new Error("Fuck you");
//     }}
//   },      


// On doit s'assurer que le token est valide et correspond bien à un utilisateur connecté
const VERIFY_TOKEN = gql`
    query verifyToken($token: String!) {
        verifyToken(token: $token) {
            user {
                id
                name
                email
            }
        }
    }
`;
function Dashboard() {
    // On récupère le token en local storage
    // On vérifie que le token est valide
    const { loading, error, data } = useQuery(VERIFY_TOKEN, {
        query: VERIFY_TOKEN,
        variables: { token: token },
    });
    // Si le token n'est pas valide, on affiche un message d'erreur
    if (error) {
        return <div>Erreur : {error.message}</div>;
    } else if (loading) {
        return <div>Loading</div>;
    } else {
    return (
        <div className="flex">
            <h1>COUCOUILLE</h1>
        </div>
    );
    }
}
export default Dashboard;
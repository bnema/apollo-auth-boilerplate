import { useState } from 'react'
import { useQuery, gql, useMutation, ApolloLink } from '@apollo/client';
import './App.css'

// Vue /dashboard : affiche le dashboard de l'utilisateur connecté

// On récupère le token en local storage
const token = localStorage.getItem('token');

// On l'envoi pour vérifier que le token est valide avant d'afficher le dashboard
const VERIFY_TOKEN = gql`
    query verifyToken($token: String!) {
        verifyToken(token: $token) {
            # On récupère les informations de l'utilisateur
            user {
                id
                name
                email
            },
            # On récupère le status (200) si le token est valide
            status
        }
    }

`;


function Dashboard() {
    // On récupère le token en local storage
    // On vérifie que le token est valide
    const { loading, error, data } = useQuery(VERIFY_TOKEN, {
        variables: { token },
    });
    // Si le token n'est pas valide, on affiche un message d'erreur
    if (error) {
        return <div>Erreur : {error.message}</div>;
    } else if (loading) {
        return <div>Loading</div>;
    } else {
        localStorage.setItem('user', JSON.stringify(data.verifyToken.user));
    return (
        <div className="flex">
            <h1>Bienvenue sur le Dashboard {data.verifyToken.user.name}</h1>
            <div className="container">
            <button onClick={() => { localStorage.removeItem('token'); window.location.reload(); }}>Déconnexion</button>
            </div>
        </div>
    );
    }
}
export default Dashboard;
import React from 'react';
import * as ReactDOM from 'react-dom/client';
import { ApolloClient, InMemoryCache, ApolloProvider, ApolloLink } from '@apollo/client';
import LoginSignupPage from './App';
import Dashboard from './Dashboard';

const client = new ApolloClient({
  uri: 'http://localhost:4000/',
  cache: new InMemoryCache(),
});

// Si un token est présent dans le local storage, on veut que le client l'ajoute dans toutes ses requêtes
if (localStorage.getItem('token')) {
  client.setLink( 
    new ApolloLink((operation, forward) => {
      operation.setContext({
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return forward(operation);
    }).concat(client.link),
  );
}


// Supported in React 18+
const root = ReactDOM.createRoot(document.getElementById('root'));


// SI l'utilisateur est connecté on affiche le dashboard, sinon on affiche la page de login
root.render(
  <ApolloProvider client={client}>
    {localStorage.getItem('token') ? <Dashboard /> : <LoginSignupPage />} 
  </ApolloProvider>,
);
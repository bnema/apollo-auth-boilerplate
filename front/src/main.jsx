import React from 'react';
import * as ReactDOM from 'react-dom/client';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import LoginSignupPage from './App';
import Dashboard from './Dashboard';

const client = new ApolloClient({
  uri: 'http://localhost:4000/',
  cache: new InMemoryCache(),
});

// Supported in React 18+
const root = ReactDOM.createRoot(document.getElementById('root'));


// SI l'utilisateur est connecté on affiche le dashboard, sinon on affiche la page de login
root.render(
  <ApolloProvider client={client}>
    {localStorage.getItem('token') ? <Dashboard /> : <LoginSignupPage />} 
  </ApolloProvider>,
);
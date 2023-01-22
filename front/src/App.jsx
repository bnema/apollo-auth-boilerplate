import { useState } from 'react'
import { gql, useMutation } from '@apollo/client';
import './App.css'


// On fait appel à la mutation login du resolver pour se connecter
const LOGIN_MUTATION = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

// On fait appel à la mutation signup du resolver pour s'inscrire
const SIGNUP_MUTATION = gql`
  mutation signup($name: String!, $email: String!, $password: String!) {
    signup(name: $name, email: $email, password: $password) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;

// Affiche la page de login/signup
function LoginSignupPage() {
  // On définit les états de la page
  // email, password, name et passwordConfirm sont les champs de formulaire
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState('');
  // error est le message d'erreur qui s'affiche en cas d'erreur
  const [error, setError] = useState('');
  // On définit les mutations login et signup afin de pouvoir les utiliser dans la page
  const [login] = useMutation(LOGIN_MUTATION);
  const [signup] = useMutation(SIGNUP_MUTATION);
  // Une fois connecté on veut afficher le nom de l'utilisateur
  

  // Fonction qui gère la soumission du formulaire de login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await login({ // On fait appel à la mutation login
        variables: { email, password },
      });
      // Si l'utilisateur a bien été connecté, on affiche un message de succès et on stocke le token en local storage
      localStorage.setItem('token', data.login.token);
      // display the dashboard page
      window.location.href = "/dashboard";

    } catch (err) {
      // Si l'adresse email n'existe pas, on affiche un message d'erreur
      if (err.message.includes("email")) { 
        setError("Cette adresse email n'existe pas");
        return;
      }
      // Si le mot de passe est incorrect, on affiche un message d'erreur
      if (err.message.includes("password")) { 
        setError("Le mot de passe est incorrect");
        return;
      }
    }
  };

  // Fonction qui gère la soumission du formulaire d'inscription
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (password !== passwordConfirm) {
      setError("les mots de passe ne sont pas identiques");
      return;
    }
    try {
      // On fait appel à la mutation signup
      const { data } = await signup({
        variables: { name, email, password },
      });
      // Si l'utilisateur a bien été créé, on affiche un message de succès et on stocke le token en local storage
      alert("Votre compte a bien été créé");
      localStorage.setItem('token', data.login.token);

    } catch (err) {
      // Si l'adresse email existe déjà, on affiche un message d'erreur en alertant l'utilisateur
      if (err.message.includes("email")) { 
        setError("Cette adresse email est déjà utilisée");
        alert("Cette adresse email est déjà utilisée");
        return;
      }
    }
  };

// On récupère le token stocké en local storage
const token = localStorage.getItem('token');


return (
    <div className="flex">
      <div className="w-1/2 p-4"> {token && (
        // Si l'utilisateur est connecté, on affiche son nom et un bouton de déconnexion (qui supprime le token du local storage et recharge la page)
        <div>
          <div className="Yo">Bonjour</div>
          <button onClick={() => { localStorage.removeItem('token'); window.location.reload(); }}>Déconnexion</button>
        </div>
      )} </div>
    <div className="w-1/2 p-4">
      <h2>Login</h2>
      <form onSubmit={handleLoginSubmit}>
          <div className="mb-4">
            <label htmlFor="email">Email</label>
            <input 
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password">Password</label>
            <input 
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">Login</button>
          <div className="text-red-500">{error}</div>
        </form>
      </div>
      <div className="w-1/2 p-4">
        <h2>Signup</h2>
        <form onSubmit={handleSignupSubmit}>
          <div className="mb-4">
            <label htmlFor="name">Name</label>
            <input 
              id="name"
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email">Email</label>
            <input 
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password">Password</label>
            <input 
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="passwordConfirm">Confirm Password</label>
            <input 
              id="passwordConfirm"
              type="password"
              placeholder="Confirm Password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />
          </div>
          <button type="submit">Signup</button>
          <div className="text-red-500">{error}</div>
        </form>
      </div>
    </div>
  );

      }

export default LoginSignupPage;

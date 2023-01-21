import { useState } from 'react'
import { useQuery, gql, useMutation } from '@apollo/client';
import './App.css'

const LOGIN_MUTATION = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;
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

function LoginSignupPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');
  const [login] = useMutation(LOGIN_MUTATION);
  const [signup] = useMutation(SIGNUP_MUTATION);
  

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await login({
        variables: { email, password },
      });
      // Si l'utilisateur a bien été connecté, on affiche un message de succès et on stocke le token en local storage
      alert("Vous êtes connecté");
      localStorage.setItem('token', data.login.token);
      localStorage.setItem("username", data.login.user.name);

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

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (password !== passwordConfirm) {
      setError("les mots de passe ne sont pas identiques");
      return;
    }
    try {
      const { data } = await signup({
        variables: { name, email, password },
      });
      // Si l'utilisateur a bien été créé, on affiche un message de succès et on stocke le token en local storage
      alert("Votre compte a bien été créé");
      localStorage.setItem('token', data.login.token);

    } catch (err) {
      // Si l'adresse email existe déjà, on affiche un message d'erreur
      if (err.message.includes("email")) { 
        setError("Cette adresse email est déjà utilisée");
        return;
      }
    }
  };
const token = localStorage.getItem('token');
const username = localStorage.getItem("username");

return (
    <div className="flex">
      <div className="w-1/2 p-4"> {token && (
        // Si l'utilisateur est connecté, on affiche son nom et un bouton de déconnexion (qui supprime le token du local storage et recharge la page)
        <div>
          <div className="Yo">Bonjour {username}</div>
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

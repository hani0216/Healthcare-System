import React, { useState } from 'react';
import './LoginPage.css'; // Import du fichier CSS
import corilus from '../../../assets/corilus.png';
import { Link, useNavigate } from 'react-router-dom'; // Importation de Link et useNavigate
import axios from 'axios'; // Import d'axios pour les appels HTTP

export default function LoginForm() {
  const [email, setEmail] = useState(''); // Gère l'email
  const [password, setPassword] = useState(''); // Gère le mot de passe
  const [error, setError] = useState(''); // Gère l'erreur
  const navigate = useNavigate(); // Pour la navigation après la connexion réussie

  // Fonction qui est appelée lors de la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      email,
      password,
    };

    try {
      // Envoi de la requête POST au backend pour l'authentification
      const response = await axios.post('http://localhost:8088/api/auth/login', userData);

      // Si la connexion est réussie, on stocke les tokens dans le localStorage
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);

      // Rediriger l'utilisateur vers la page d'accueil ou une autre page
      navigate('/home'); // Remplace '/home' par la page où tu veux rediriger l'utilisateur
    } catch (err) {
      // Gérer l'erreur (exemple : si les identifiants sont incorrects)
      setError('Invalid email or password');
    }
  };

  return (
    <div className="login-container">
      <div></div>
      <div className='logoSection'></div>
      <div className="login-card">
        <div></div>
        <img
          src={corilus}
          alt="Logo-Corilus"
          style={{ width: '90%', height: '15vh', marginBottom: '5vh' }}
        />
        <h2 className="login-title">Welcome Back !</h2>

        {/* Formulaire de connexion */}
        <form onSubmit={handleSubmit} className="login-form">
          {/* Champ email */}
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="email"
              className="form-input"
              placeholder="Enter your email"
              value={email} // Liaison avec l'état
              onChange={(e) => setEmail(e.target.value)} // Mise à jour de l'état
              required
            />
          </div>

          {/* Champ mot de passe */}
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Enter your password"
              value={password} // Liaison avec l'état
              onChange={(e) => setPassword(e.target.value)} // Mise à jour de l'état
              required
            />
          </div>

          {/* Affichage de l'erreur (si connexion échouée) */}
          {error && <p style={{ color: 'red' }}>{error}</p>}

          <button type="submit" className="login-button">
            Login
          </button>
        </form>

        {/* Lien vers la page de création de compte */}
        <div className="forgot-password">
          <Link to="/signUp" className="forgot-link">Register?</Link>
        </div>
        <div className="forgot-password">
          <a href="#" className="forgot-link">Forgot password?</a>
        </div>
      </div>
    </div>
  );
}

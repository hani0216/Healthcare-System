import React, { useState } from 'react';
import './LoginPage.css';
import corilus from '../../../assets/corilus.png';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';


export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

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

      // Ajout de l'email dans le localStorage
      localStorage.setItem('email', email);

      // Appel pour récupérer userId
      try {
        const userIdResponse = await axios.get(
          `http://localhost:8088/api/users/userId/${email}`,
          {
            headers: {
              Authorization: `Bearer ${response.data.accessToken}`,
            },
          }
        );
        localStorage.setItem('userId', userIdResponse.data);
      } catch (e) {
        console.error("Erreur lors de la récupération du userId", e);
      }

      // Appel pour récupérer specificId
      try {
        const specificIdResponse = await axios.get(
          `http://localhost:8088/api/users/specific-id/${email}`,
          {
            headers: {
              Authorization: `Bearer ${response.data.accessToken}`,
            },
          }
        );
        localStorage.setItem('specificId', specificIdResponse.data);
      } catch (e) {
        console.error("Erreur lors de la récupération du specificId", e);
      }

      // Appel pour récupérer le nom de l'utilisateur et le rôle
      try {
        const userDataResponse = await axios.get(
          `http://localhost:8088/api/users/email/${email}`,
          {
            headers: {
              Authorization: `Bearer ${response.data.accessToken}`,
            },
          }
        );
        if (userDataResponse.data && userDataResponse.data.name) {
          localStorage.setItem('userName', userDataResponse.data.name);
          console.log("userName ok :", userDataResponse.data.role);
        }
        if (userDataResponse.data && userDataResponse.data.role) {
          localStorage.setItem('role', userDataResponse.data.role);
          console.log(userDataResponse.data.doctorInfo)
          if (userDataResponse.data.role === 'DOCTOR') {
            navigate('/doctorHome');
            return;
          } else if (userDataResponse.data.role === 'INSURANCE_ADMIN') {
            navigate('/insuranceHome');
            return;
          } else if(userDataResponse.data.role === 'PATIENT'){
            navigate('/patientHome');
            return;
          }
        }
      } catch (e) {
        console.error("Erreur lors de la récupération du userName ou du rôle", e);
        // Par défaut, rediriger vers patientHome
        navigate('/notFound');
        return;
      }
    } catch (err) {
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

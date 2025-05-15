import axios from 'axios';

// URL de l'API de login
const API_URL = 'http://localhost:8088/api/auth/login';

export const login = async (userData: {
  email: string;
  password: string;
}) => {
  try {
    // Envoi des données via une requête POST
    const response = await axios.post(API_URL, {
      email: userData.email,
      password: userData.password,
    });
    
    // Retourne la réponse du backend contenant les tokens
    return response.data;
  } catch (error: any) {
    // Si une erreur se produit, on la capture et la renvoie
    throw error.response ? error.response.data : error.message;
  }
};

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

    // Ajout du token dans le localStorage
    localStorage.setItem('accessToken', response.data.accessToken);

    // Ajout du refreshToken dans le localStorage si présent
    if (response.data.refreshToken) {
      localStorage.setItem('refreshToken', response.data.refreshToken);
      console.log("refreshToken ok :", response.data.refreshToken);
    }

    // Ajout de l'email dans le localStorage
    localStorage.setItem('email', userData.email);

    // Appel pour récupérer userId
    try {
      const userIdResponse = await axios.get(
        `http://localhost:8088/api/users/userId/${userData.email}`,
        {
          headers: {
            Authorization: `Bearer ${response.data.accessToken}`,
          },
        }
      );
      console.log("userIdResponse.data =", userIdResponse.data);
      localStorage.setItem('userId', userIdResponse.data);
    } catch (e) {
      console.error("Erreur lors de la récupération du userId", e);
    }

    // Appel pour récupérer specificId
    try {
      const specificIdResponse = await axios.get(
        `http://localhost:8088/api/users/specific-id/${userData.email}`,
        {
          headers: {
            Authorization: `Bearer ${response.data.accessToken}`,
          },
        }
      );
      console.log("specificIdResponse.data =", specificIdResponse.data);
      localStorage.setItem('specificId', specificIdResponse.data);
    } catch (e) {
      console.error("Erreur lors de la récupération du specificId", e);
    }

    // Appel pour récupérer le nom de l'utilisateur
    try {
      const userDataResponse = await axios.get(
        `http://localhost:8088/api/users/email/${userData.email}`,
        {
          headers: {
            Authorization: `Bearer ${response.data.accessToken}`,
          },
        }
      );
      if (userDataResponse.data && userDataResponse.data.name) {
        localStorage.setItem('userName', userDataResponse.data.name);
        console.log("userName ok :", userDataResponse.data.name);
      }
    } catch (e) {
      console.error("Erreur lors de la récupération du userName", e);
    }

    // Retourne la réponse du backend contenant les tokens
    return response.data;
  } catch (error: any) {
    // Si une erreur se produit, on la capture et la renvoie
    throw error.response ? error.response.data : error.message;
  }
};


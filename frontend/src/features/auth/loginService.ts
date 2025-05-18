import axios from 'axios';

const API_URL = 'http://localhost:8088/api/auth/login';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  email?: string | null;
}

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(API_URL, {
    email: data.email,
    password: data.password,
  });
  // Stockage local des tokens
  localStorage.setItem('accessToken', response.data.accessToken);
  localStorage.setItem('refreshToken', response.data.refreshToken);
  return response.data;
};

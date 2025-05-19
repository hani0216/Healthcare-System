import axios from 'axios';

const API_URL = 'http://localhost:8088/patients';

export async function updatePatient(id: string, data: any, token: string) {
  return axios.put(`${API_URL}/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

import axios from 'axios';

export async function fetchAllUsers() {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    throw new Error('No access token found');
  }
  const response = await axios.get('http://localhost:8088/api/users', {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return response.data;
}

export async function fetchAllDoctors() {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    throw new Error('No access token found');
  }
  const response = await axios.get('http://localhost:8088/doctors', {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return response.data;
}

export async function fetchAllPatients() {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    throw new Error('No access token found');
  }
  const response = await axios.get('http://localhost:8088/patients', {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return response.data;
}

export async function fetchAllInsuranceAdmins() {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    throw new Error('No access token found');
  }
  const response = await axios.get('http://localhost:8088/insurance-admins', {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return response.data;
}

export async function fetchAllInvoices() {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    throw new Error('No access token found');
  }
  const response = await axios.get('http://localhost:8088/api/invoices', {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return response.data;
}

export async function fetchAllReimbursements() {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    throw new Error('No access token found');
  }
  const response = await axios.get('http://localhost:8088/api/reimbursements', {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return response.data;
} 
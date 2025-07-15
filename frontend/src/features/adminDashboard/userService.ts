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

export const deletePatient = async (id: string) => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(`http://localhost:8088/patients/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete patient: ${response.statusText}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting patient:', error);
    throw error;
  }
};

export const deleteDoctor = async (id: string) => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(`http://localhost:8088/doctors/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete doctor: ${response.statusText}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting doctor:', error);
    throw error;
  }
};

export const deleteInsuranceAdmin = async (id: string) => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(`http://localhost:8088/insurance-admins/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete insurance admin: ${response.statusText}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting insurance admin:', error);
    throw error;
  }
};
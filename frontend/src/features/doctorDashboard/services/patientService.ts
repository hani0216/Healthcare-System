export async function fetchAllPatients() {
  const token = localStorage.getItem('accessToken');
  const response = await fetch('http://localhost:8088/patients', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) {
    throw new Error('Failed to fetch patients');
  }
  return response.json();
}
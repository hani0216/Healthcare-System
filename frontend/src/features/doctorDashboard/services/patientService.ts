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

export async function getAuthorizationStatus(doctorId: number, medicalRecordId: number): Promise<string> {
  const token = localStorage.getItem('accessToken');
  const url = `http://localhost:8088/api/authorizations/status?doctorId=${doctorId}&medicalRecordId=${medicalRecordId}`;
  const res = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error('Failed to fetch authorization status');
  const text = await res.text();
  try {
    const data = JSON.parse(text);
    return data.status || 'UNKNOWN';
  } catch {
    return text.trim();
  }
}
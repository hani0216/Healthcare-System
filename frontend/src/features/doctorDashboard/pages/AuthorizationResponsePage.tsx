import React from 'react';
import { useSearchParams } from 'react-router-dom';

const AuthorizationResponsePage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const initialStatus = searchParams.get('status') || '';

  const handleResponse = async (newStatus: string) => {
    try {
      const response = await fetch('http://localhost:8088/api/notifications/authorization/save-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, status: newStatus }),
      });
      const text = await response.text();
      alert(text);
    } catch (err) {
      alert('Erreur lors de l’envoi de la réponse');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Authorization Request Response</h2>
      <p style={{ marginBottom: 18 }}>
        A doctor wants to access your medical record. By clicking on your choice below, you will either grant or deny the doctor permission to view, modify, and add documents to your medical file.
      </p>
      <p>Initial status: <strong>{initialStatus}</strong></p>
      <button onClick={() => handleResponse('AUTHORIZED')} style={{ marginRight: 10, backgroundColor: 'green', color: 'white', padding: '8px 18px', border: 'none', borderRadius: 6, fontWeight: 500 }}>
        Authorize
      </button>
      <button onClick={() => handleResponse('DENIED')} style={{ backgroundColor: 'red', color: 'white', padding: '8px 18px', border: 'none', borderRadius: 6, fontWeight: 500 }}>
        Reject
      </button>
    </div>
  );
};

export default AuthorizationResponsePage;
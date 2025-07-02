import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthorizationStatus } from '../services/patientService';
import { useState } from 'react';

interface PatientCardProps {
  name: string;
  email: string;
  address: string | null;
  phone: string | null;
  insurance: string | null;
}

const CARD_WIDTH = 300;
const CARD_HEIGHT = 240;
const BORDER_RADIUS = '10px';

const PatientCard: React.FC<PatientCardProps & { id: number }> = ({ id, name, email, address, phone, insurance }) => {
  const navigate = useNavigate();
  const [authStatus, setAuthStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAccessMedicalRecord = async () => {
    setLoading(true);
    setError(null);
    setAuthStatus(null);
    try {
      const doctorId = Number(localStorage.getItem('specificId'));
      const status = await getAuthorizationStatus(doctorId, id);
      setAuthStatus(status);
      if (status === 'AUTHORIZED') {
        navigate(`/doctor/patient/${id}/medical-record`);
      }
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAuthorization = async () => {
    // TODO: implémenter la requête d'autorisation si besoin
    alert('Request authorization feature not implemented yet.');
  };

  return (
    <div
      style={{
        backgroundColor: 'transparent', // plus de fond visible pour la carte
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        borderRadius: 0,
        boxSizing: 'border-box',
        margin: '12px',
        boxShadow: 'none' // enlève l'ombre/bordure
      }}
    >
      <div
        style={{
          backgroundColor: '#28a6a7',
          padding: '1rem',
          color: 'white',
          width: '100%',
          height: '12vh',
          borderRadius: BORDER_RADIUS + ' ' + BORDER_RADIUS + ' 0 0'
        }}
      >
        <h2
          style={{
            fontWeight: 'bold',
            fontSize: '1.125rem'
          }}
        >
          <h3 style={{ margin: 0, fontWeight: 600 }}>{name}</h3>
        </h2>
        <p
          style={{
            fontSize: '0.875rem',
            opacity: 0.8
          }}
        >
          <p style={{ margin: 0, color: 'white' }}>Insurance: {insurance || '-'}</p>
        </p>
      </div>
      <div
        style={{
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          backgroundColor: 'white',
          width: '100%',
          borderRadius: '0 0 ' + BORDER_RADIUS + ' ' + BORDER_RADIUS,
          flex: 1,
          justifyContent: 'center'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <span
            style={{
              marginLeft: '0.5rem',
              fontSize: '0.875rem'
            }}
          >
            <p style={{ margin: 0, color: 'black' }}>Address: {address || '-'}</p>
            <p style={{ margin: 0, color: 'black' }}>Email: {email}</p>
            <p style={{ margin: 0, color: 'black' }}>Phone: {phone || '-'}</p>
          </span>
        </div>
        <div
          style={{
            backgroundColor: '#f9fafb',
            textAlign: 'right',
            borderTop: '1px solid #e5e7eb',
            margin: '0px',
            padding: '0px',
            height: '100%'
          }}
        >
          <button
            style={{
              color: '#2563eb',
              fontSize: '0.875rem',
              fontWeight: 500,
              backgroundColor: 'transparent',
              border: 'none',
            }}
            onClick={handleAccessMedicalRecord}
          >
            Voir plus
          </button>
          {loading && <div style={{ color: '#2563eb', fontSize: 13 }}>Checking authorization...</div>}
          {error && <div style={{ color: 'red', fontSize: 13 }}>{error}</div>}
          {authStatus === 'PENDING' && <div style={{ color: '#fbbf24', fontSize: 13 }}>Waiting for patient to confirm access to this medical record.</div>}
          {authStatus === 'DENIED' && <div style={{ color: '#ef4444', fontSize: 13 }}>The user did not grant permission to access this medical record.</div>}
          {authStatus === 'UNKNOWN' && (
            <div style={{ marginTop: 8 }}>
              <button
                style={{
                  color: '#fff',
                  backgroundColor: '#28a6a7',
                  border: 'none',
                  borderRadius: 6,
                  padding: '6px 16px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontSize: 13
                }}
                onClick={handleRequestAuthorization}
              >
                Request authorization
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientCard;



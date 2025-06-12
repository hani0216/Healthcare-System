import React, { useMemo, useState, useEffect } from 'react';
import { sendDocument, fetchSpecialities, fetchDoctorsBySpeciality, fetchDoctorsByName } from '../services/medicalRecordService';
import { data } from 'react-router-dom';

interface PDFViewerProps {
  bytes?: number[];
  base64?: string;
  onClose: () => void;
  documentTitle?: string;
  documentId: number; 
}

const PDFViewer: React.FC<PDFViewerProps> = ({ bytes, base64, onClose, documentTitle, documentId }) => {
  const [showShare, setShowShare] = useState(false);
  const [message, setMessage] = useState('');
  const [doctors, setDoctors] = useState<{ id: number; name: string; speciality?: string }[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<number | undefined>(undefined);
  const [searchMode, setSearchMode] = useState<'name' | 'speciality'>('name');
  const [searchValue, setSearchValue] = useState('');
  const [specialities, setSpecialities] = useState<string[]>([]);
  const [specialityError, setSpecialityError] = useState<string | null>(null);

  // Génère l'URL du PDF
  const src = useMemo(() => {
    if (bytes && Array.isArray(bytes) && bytes.length > 0) {
      const uint8 = new Uint8Array(bytes);
      const blob = new Blob([uint8], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      return url;
    }
    if (base64 && typeof base64 === "string") {
      const binaryString = window.atob(base64);
      const len = binaryString.length;
      const uint8 = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        uint8[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([uint8], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      return url;
    }
    return undefined;
  }, [base64, bytes]);

  // Charger tous les médecins pour la recherche par nom
  useEffect(() => {
    if (showShare && searchMode === 'name') {
      const token = localStorage.getItem("accessToken");
      fetch("http://localhost:8088/doctors", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setDoctors(data))
        .catch(() => setDoctors([]));
    }
  }, [showShare, searchMode]);

  // Charger les spécialités quand on passe en mode "speciality"
  useEffect(() => {
    if (showShare && searchMode === 'speciality' && specialities.length === 0) {
      fetchSpecialities()
        .then(data => setSpecialities(data))
        .catch(() => setSpecialityError('Erreur lors du chargement des spécialités'));
    }
  }, [showShare, searchMode, specialities.length]);

  // Charger les médecins selon la spécialité sélectionnée
  useEffect(() => {
    if (showShare && searchMode === 'speciality' && searchValue) {
      fetchDoctorsBySpeciality(searchValue)
        .then(data => setDoctors(data))
        .catch(() => setDoctors([]));
        console.log(data);
    }
  }, [showShare, searchMode, searchValue]);

  // Charger les médecins selon le nom tapé
  useEffect(() => {
    if (showShare && searchMode === 'name' && searchValue) {
      fetchDoctorsByName(searchValue)
        .then(data => setDoctors(data))
        .catch(() => setDoctors([]));
    } else if (showShare && searchMode === 'name' && !searchValue) {
      setDoctors([]);
    }
  }, [showShare, searchMode, searchValue]);

  const handleShare = async () => {
    const senderId = Number(localStorage.getItem("specificId"));
    const receiverId = selectedDoctor;
    const description = message;
    const resourceId = documentId; // Assure-toi de passer documentId en prop à PDFViewer

    console.log("sendDocument params:", { senderId, receiverId, description, resourceId });

    if (!senderId || !receiverId || !resourceId) {
      alert("Veuillez sélectionner un médecin et vérifier les informations.");
      return;
    }

    try {
      await sendDocument(senderId, receiverId, description, resourceId);
      alert("Document partagé avec succès !");
      setShowShare(false);
      setMessage('');
      setSelectedDoctor(undefined);
    } catch (err) {
      alert("Erreur lors du partage du document.");
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: 800, background: '#f9fafb', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: 16 }}>
      {!showShare && (
        <button
          style={{
            position: 'absolute',
            left: 16,
            top: 16,
            background: 'rgb(37, 99, 235)',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            padding: '6px 16px',
            fontWeight: 600,
            cursor: 'pointer',
            zIndex: 10,
          }}
          onClick={() => setShowShare(true)}
        >
          Share this document
        </button>
      )}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 16,
          right: 16,
          background: '#ef4444',
          color: 'white',
          border: 'none',
          borderRadius: 8,
          padding: '6px 16px',
          fontWeight: 600,
          cursor: 'pointer',
          zIndex: 10,
        }}
      >
        Close
      </button>
      {!showShare ? (
        src ? (
          <iframe
            src={src}
            title="PDF Viewer"
            width="100%"
            height="800px"
            style={{ border: 'none', borderRadius: 12, marginTop: 50 }}
          />
        ) : (
          <div style={{ textAlign: 'center', color: '#888', marginTop: 80 }}>No PDF to display</div>
        )
      ) : (
        <div style={{ marginTop: 60, padding: 32 }}>
          <h2 style={{ marginBottom: 24 }}>{documentTitle || "Document"}</h2>
          <textarea
            style={{
              width: '100%',
              minHeight: 60,
              borderRadius: 6,
              border: '1px solid #cbd5e1',
              padding: 8,
              fontSize: 15,
              marginBottom: 16,
              resize: 'vertical',
            }}
            placeholder="Enter a message to share with the doctor..."
            value={message}
            onChange={e => setMessage(e.target.value)}
          />
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>Select a doctor :</label>
            <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
              <button
                style={{
                  background: searchMode === 'name' ? '#2563eb' : '#e5e7eb',
                  color: searchMode === 'name' ? 'white' : '#1e293b',
                  border: 'none',
                  borderRadius: 6,
                  padding: '6px 18px',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
                onClick={() => setSearchMode('name')}
                type="button"
              >
                By name
              </button>
              <button
                style={{
                  background: searchMode === 'speciality' ? '#2563eb' : '#e5e7eb',
                  color: searchMode === 'speciality' ? 'white' : '#1e293b',
                  border: 'none',
                  borderRadius: 6,
                  padding: '6px 18px',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
                onClick={() => setSearchMode('speciality')}
                type="button"
              >
                By speciality
              </button>
              {searchMode === 'name' ? (
                <>
                 
                
                </>
              ) : (
                <select
                  style={{
                    flex: 1,
                    border: '1px solid #cbd5e1',
                    borderRadius: 6,
                    padding: '6px 12px',
                    fontSize: 15,
                    marginLeft: 8
                  }}
                  value={searchValue}
                  onChange={e => setSearchValue(e.target.value)}
                >
                  <option value="">Toutes les spécialités</option>
                  {specialities.map((spec, idx) => (
                    <option key={idx} value={spec}>{spec}</option>
                  ))}
                </select>
              )}
            </div>
            {specialityError && <div style={{ color: 'red', marginBottom: 8 }}>{specialityError}</div>}
            <select
              style={{
                width: '100%',
                padding: 8,
                borderRadius: 6,
                border: '1px solid #cbd5e1',
                fontSize: 15,
              }}
              value={selectedDoctor ?? ''}
              onChange={e => setSelectedDoctor(Number(e.target.value))}
            >
              <option value="">Sélectionner...</option>
              {doctors.map(doc => (
                <option key={doc.id} value={doc.id}>
                  {doc.doctorInfo?.name || doc.name} {doc.speciality ? `(${doc.speciality})` : ''}
                </option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              style={{
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                padding: '8px 24px',
                fontWeight: 500,
                fontSize: 16,
                cursor: 'pointer',
              }}
              onClick={handleShare}
            >
              Share
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFViewer;
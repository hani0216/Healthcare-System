import React from 'react';
import PdfImg from '../../../assets/pdf.png';

interface PdfCardProps {
  title: string;
  contentUrl: string; // non utilisé ici, mais prêt pour futur téléchargement
  creator: string;
  noteDescription: string;
  creationDate: any; // ex: Timestamp (Firestore) ou Date
  onClick: () => void;
}

const PdfCard: React.FC<PdfCardProps> = ({
  title,
  contentUrl,
  creator,
  noteDescription,
  creationDate,
  onClick,
}) => {
  // Convertir Timestamp → Date JS si nécessaire
  const dateObj = creationDate?.toDate ? creationDate.toDate() : new Date(creationDate);
  const formattedDate = dateObj.toLocaleDateString('fr-FR');

  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        transition: 'all 0.3s ease-in-out',
        cursor: 'pointer',
      }}
    >
      <div style={{ display: 'flex' }}>
        <div
          style={{
            width: '6rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundImage: `url(${PdfImg})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            margin: '4px',
          }}
        >
          <i
            className="fas fa-file-pdf"
            style={{
              fontSize: '2.25rem',
              color: '#ef4444',
            }}
          />
        </div>
        <div style={{ padding: '1rem', flex: 1 }}>
          <h4 style={{ fontWeight: 500, color: '#1f2937' }}>
            {title}
          </h4>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '0.5rem',
              fontSize: '0.875rem',
              color: '#6b7280',
            }}
          >
            <span>{formattedDate}</span>
          </div>
          <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
            <span
              style={{
                backgroundColor: '#dbeafe',
                color: '#1e40af',
                fontSize: '0.75rem',
                padding: '0.25rem 0.5rem',
                borderRadius: '0.25rem',
              }}
            >
              {creator}
            </span>
            <span
              style={{
                backgroundColor: '#dbeafe',
                color: '#1e40af',
                fontSize: '0.75rem',
                padding: '0.25rem 0.5rem',
                borderRadius: '0.25rem',
              }}
            >
              {noteDescription}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfCard;

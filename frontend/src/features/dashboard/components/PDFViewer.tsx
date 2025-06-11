import React, { useMemo } from 'react';

interface PDFViewerProps {
  url?: string;
  base64?: string; // chaîne base64 (cas courant avec Spring)
  bytes?: number[]; // tableau de bytes (rare, mais possible)
  onClose: () => void;
}

// Utilitaire pour décoder le base64 en Uint8Array
function base64ToUint8Array(base64: string): Uint8Array {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ url, base64, bytes, onClose }) => {
  // Génère dynamiquement l'URL du PDF selon le format reçu
  const src = useMemo(() => {
    if (bytes && Array.isArray(bytes) && bytes.length > 0) {
      const uint8 = new Uint8Array(bytes);
      const blob = new Blob([uint8], { type: 'application/pdf' });
      return URL.createObjectURL(blob);
    }
    if (base64 && typeof base64 === "string") {
      const uint8 = base64ToUint8Array(base64);
      const blob = new Blob([uint8], { type: 'application/pdf' });
      return URL.createObjectURL(blob);
    }
    if (url) {
      return url;
    }
    return undefined;
  }, [base64, bytes, url]);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        minHeight: 650, // Augmente la hauteur minimale
        marginTop: 40,  // Ajoute une marge supérieure
        background: '#f9fafb',
        borderRadius: 16,
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        padding: 16,
      }}
    >
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
      {src ? (
        <iframe
          src={src}
          title="PDF Viewer"
          width="100%"
          height="800px" // Augmente la hauteur de l'iframe
          style={{ border: 'none', borderRadius: 12, marginTop: 16 }}
        />
      ) : (
        <div style={{ textAlign: 'center', marginTop: 40, color: '#888' }}>No PDF to display</div>
      )}
    </div>
  );
};

export default PDFViewer;
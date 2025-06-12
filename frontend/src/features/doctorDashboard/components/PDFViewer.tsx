import React, { useMemo } from 'react';

interface PDFViewerProps {
  bytes?: number[]; // tableau de bytes (rare avec Spring)
  base64?: string;  // chaîne base64 (cas courant avec Spring)
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

const PDFViewer: React.FC<PDFViewerProps> = ({ bytes, base64, onClose }) => {
  const src = useMemo(() => {
    console.log("PDFViewer props:", { bytes, base64 });
    if (bytes && Array.isArray(bytes) && bytes.length > 0) {
      console.log("PDFViewer utilise bytes, taille:", bytes.length);
      const uint8 = new Uint8Array(bytes);
      const blob = new Blob([uint8], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      console.log("PDFViewer url (bytes):", url);
      return url;
    }
    if (base64 && typeof base64 === "string") {
      console.log("PDFViewer utilise base64, taille:", base64.length);
      const uint8 = base64ToUint8Array(base64);
      const blob = new Blob([uint8], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      console.log("PDFViewer url (base64):", url);
      return url;
    }
    console.log("PDFViewer : aucune donnée PDF à afficher");
    return undefined;
  }, [base64, bytes]);

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: 800, background: '#f9fafb', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: 16 }}>
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
          height="800px"
          style={{ border: 'none', borderRadius: 12, marginTop: 16 }}
        />
      ) : (
        <div style={{ textAlign: 'center', color: '#888', marginTop: 80 }}>No PDF to display</div>
      )}
    </div>
  );
};

export default PDFViewer;
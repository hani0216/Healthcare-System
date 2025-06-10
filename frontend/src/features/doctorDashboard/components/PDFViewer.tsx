import React from 'react';

interface PDFViewerProps {
  url?: string;
  base64?: string; // base64 string (sans data:...)
  onClose: () => void;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ url, base64, onClose }) => {
  // Si base64 fourni, construire un data URL
  const src = base64
    ? `data:application/pdf;base64,${base64}`
    : url || undefined;

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: 500, background: '#f9fafb', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: 16 }}>
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
          height="500px"
          style={{ border: 'none', borderRadius: 12, marginTop: 16 }}
        />
      ) : (
        <div style={{ textAlign: 'center', marginTop: 40, color: '#888' }}>No PDF to display</div>
      )}
    </div>
  );
};

export default PDFViewer; 
import React from 'react';

interface PDFViewerProps {
  url: string;
  onClose: () => void;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ url, onClose }) => {
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
      <iframe
        src={url}
        title="PDF Viewer"
        width="100%"
        height="500px"
        style={{ border: 'none', borderRadius: 12, marginTop: 16 }}
      />
    </div>
  );
};

export default PDFViewer; 
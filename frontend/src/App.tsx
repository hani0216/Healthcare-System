import AppRouter from './router/AppRouter';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import animationGif from './assets/Animation.gif';

export default function App() {
  const location = useLocation();
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    setShowLoader(true);
    const timeout = setTimeout(() => setShowLoader(false), 500);
    return () => clearTimeout(timeout);
  }, [location]);

  return (
    <div className="app" style={{ position: 'relative' }}>
      {showLoader && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.45)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(6px)',
          transition: 'opacity 0.3s',
        }}>
          <div style={{
            zIndex: 10000,
            background: 'none',
            boxShadow: 'none',
            borderRadius: 0,
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <img src={animationGif} alt="Loading..." style={{ width: 120, height: 120, borderRadius: 0, boxShadow: 'none', background: 'none' }} />
          </div>
        </div>
      )}
      <AppRouter />
    </div>
  );
}

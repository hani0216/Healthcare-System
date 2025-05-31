import React from 'react';
import SideBar from '../components/sideBar';
import DashboardActionsBar from '../components/DashboardActionsBar';

export default function DoctorHome() {
  const userName = localStorage.getItem('userName') || 'Doctor';
  return (
    <div style={{ height: 'auto', display: 'flex' }}>
      <SideBar />
      <div style={{ flex: 1, background: '#f5f6fa', position: 'relative', minHeight: '100vh' }}>
        <DashboardActionsBar userName={userName} />
        <div className="container mx-auto p-6 max-w-6xl" style={{ marginTop: '40px' }}>
          <h2 className="text-2xl font-bold mb-8 text-center" style={{ color: '#28A6A7' }}>
            Welcome to your Doctor Dashboard
          </h2>
          {/* Ajouter ici les widgets/statistiques spécifiques au médecin */}
        </div>
      </div>
    </div>
  );
} 
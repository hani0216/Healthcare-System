import React, { useEffect, useState } from 'react';
import SideBar from '../components/sideBar';
import DashboardActionsBar from '../components/DashboardActionsBar';
import PatientCard from '../components/PatientCard';
import { fetchAllPatients } from '../../doctorDashboard/services/patientService';

export default function DoctorHome() {
  const userName = localStorage.getItem('userName') || 'Doctor';
  const [patients, setPatients] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchAllPatients()
      .then(setPatients)
      .catch(console.error);
  }, []);

  const filteredPatients = patients.filter(p =>
    p.patientInfo?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ height: 'auto', display: 'flex' }}>
      <SideBar />
      <div style={{ flex: 1, background: '#f5f6fa', position: 'relative', minHeight: '100vh' }}>
        <DashboardActionsBar userName={userName} />
        <div className="container mx-auto p-6 max-w-6xl" style={{ marginTop: '40px' }}>
          {/* Barre de recherche */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
            <input
              type="text"
              placeholder="Rechercher un patient..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '60%',
                padding: '18px 24px',
                borderRadius: '32px',
                border: '1px solid #ccc',
                fontSize: 20,
                outline: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}
            />
          </div>
          {/* Liste de PatientCard */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'flex-start'
          }}>
            {filteredPatients.map((p) => (
              <PatientCard
                key={p.id}
                id={p.id}
                name={p.patientInfo?.name}
                email={p.patientInfo?.email}
                address={p.patientInfo?.address}
                phone={p.patientInfo?.phone}
                insurance={p.insurance}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
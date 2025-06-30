import React, { useEffect, useState } from 'react';
import SideBar from '../components/sideBar';
import DashboardActionsBar from '../components/DashboardActionsBar';
import PatientCard from '../components/PatientCard';
import { fetchAllPatients } from '../../doctorDashboard/services/patientService';

export default function DoctorHome() {
  const userName = localStorage.getItem('userName') || 'Doctor';
  const [patients, setPatients] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [patientsPerPage] = useState(8); 

  useEffect(() => {
    fetchAllPatients()
      .then(setPatients)
      .catch(console.error);
  }, []);

  const filteredPatients = patients.filter(p =>
    p.patientInfo?.name?.toLowerCase().includes(search.toLowerCase())
  );

  // Calcul de la pagination
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient);
  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

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
            {currentPatients.map((p) => (
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '16px',
              marginTop: '32px',
              padding: '20px'
            }}>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  background: currentPage === 1 ? '#f3f4f6' : '#fff',
                  color: currentPage === 1 ? '#9ca3af' : '#374151',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  fontWeight: 500
                }}
              >
                Précédent
              </button>
              
              <div style={{ display: 'flex', gap: '8px' }}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #e5e7eb',
                      background: currentPage === page ? '#28a6a7' : '#fff',
                      color: currentPage === page ? '#fff' : '#374151',
                      cursor: 'pointer',
                      fontWeight: 500,
                      minWidth: '40px'
                    }}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  background: currentPage === totalPages ? '#f3f4f6' : '#fff',
                  color: currentPage === totalPages ? '#9ca3af' : '#374151',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  fontWeight: 500
                }}
              >
                Suivant
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
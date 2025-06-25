import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBillWave, faRefresh, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { fetchReimbursementsByInsuredId } from '../services/insuranceService';
import ReimbursementItem from '../components/ReimbursementItem';
import SideBar from '../components/sideBar';
import DashboardActionsBar from '../components/DashboardActionsBar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Reimbursement {
  id: number;
  status: string;
  amount: number;
  invoiceId: number;
  insuredId: number;
  medicalRecordId: number | null;
}

const ReimbursementsPage: React.FC = () => {
  const [reimbursements, setReimbursements] = useState<Reimbursement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const loadReimbursements = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const insuredId = localStorage.getItem('specificId');
      if (!insuredId) {
        throw new Error('Insured ID not found in local storage');
      }

      const data = await fetchReimbursementsByInsuredId(parseInt(insuredId));
      // Trier les remboursements par date de création (du plus récent au plus ancien)
      const sortedData = data.sort((a: any, b: any) => {
        const dateA = new Date(a.creationDate || a.createdAt || 0);
        const dateB = new Date(b.creationDate || b.createdAt || 0);
        return dateB.getTime() - dateA.getTime();
      });
      setReimbursements(sortedData);
    } catch (error) {
      console.error('Error loading reimbursements:', error);
      setError('Failed to load reimbursements');
      toast.error('Failed to load reimbursements', {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReimbursements();
  }, []);

  const handleRefresh = () => {
    loadReimbursements();
    setCurrentPage(1);
    toast.success('Reimbursements refreshed!', {
      position: "top-center",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const userName = localStorage.getItem('userName') || 'Insurance';

  // Calcul de la pagination
  const totalPages = Math.ceil(reimbursements.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentReimbursements = reimbursements.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div style={{ height: 'auto', display: 'flex' }}>
      <SideBar />
      <div style={{ flex: 1, background: '#f5f6fa', position: 'relative', minHeight: '100vh' }}>
        <DashboardActionsBar userName={userName} />
        <ToastContainer position="top-center" autoClose={2000} />
        
        <div className="container mx-auto p-6 max-w-6xl" style={{ marginTop: '40px' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: '2rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FontAwesomeIcon 
                icon={faMoneyBillWave} 
                style={{ color: '#28A6A7', fontSize: '1.5rem' }} 
              />
              <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 600, color: '#28A6A7' }}>
                Reimbursements
              </h1>
            </div>
            <button
              onClick={handleRefresh}
              style={{
                background: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: 8,
                padding: "8px 16px",
                fontWeight: 600,
                cursor: "pointer",
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <FontAwesomeIcon icon={faRefresh} />
              Refresh
            </button>
          </div>

          {isLoading && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '50vh',
              fontSize: '1.1rem',
              color: '#64748b'
            }}>
              Loading reimbursements...
            </div>
          )}

          {error && (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '50vh',
              gap: '1rem'
            }}>
              <div style={{ fontSize: '1.1rem', color: '#ef4444' }}>
                {error}
              </div>
              <button
                onClick={handleRefresh}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.25rem',
                  border: 'none',
                  background: '#2563eb',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                Try Again
              </button>
            </div>
          )}

          {!isLoading && !error && reimbursements.length === 0 && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '30vh',
              fontSize: '1.1rem',
              color: '#64748b',
              background: 'white',
              borderRadius: '0.5rem',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>
              No reimbursements found
            </div>
          )}

          {!isLoading && !error && reimbursements.length > 0 && (
            <>
              <div className="flex flex-col gap-4">
                {currentReimbursements.map((reimbursement) => (
                  <ReimbursementItem
                    key={reimbursement.id}
                    id={reimbursement.id}
                    status={reimbursement.status}
                    amount={reimbursement.amount}
                    invoiceId={reimbursement.invoiceId}
                    insuredId={reimbursement.insuredId}
                    medicalRecordId={reimbursement.medicalRecordId}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  gap: '1rem',
                  marginTop: '2rem',
                  padding: '1rem'
                }}>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '0.25rem',
                      border: '1px solid #d1d5db',
                      background: currentPage === 1 ? '#f1f5f9' : 'white',
                      color: currentPage === 1 ? '#94a3b8' : '#64748b',
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <FontAwesomeIcon icon={faChevronLeft} />
                    Previous
                  </button>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        style={{
                          padding: '0.5rem 1rem',
                          borderRadius: '0.25rem',
                          border: '1px solid #d1d5db',
                          background: currentPage === page ? '#2563eb' : 'white',
                          color: currentPage === page ? 'white' : '#64748b',
                          cursor: 'pointer',
                          fontWeight: currentPage === page ? 600 : 400
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
                      padding: '0.5rem 1rem',
                      borderRadius: '0.25rem',
                      border: '1px solid #d1d5db',
                      background: currentPage === totalPages ? '#f1f5f9' : 'white',
                      color: currentPage === totalPages ? '#94a3b8' : '#64748b',
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    Next
                    <FontAwesomeIcon icon={faChevronRight} />
                  </button>
                </div>
              )}

              <div style={{ 
                textAlign: 'center', 
                marginTop: '1rem',
                color: '#64748b',
                fontSize: '0.9rem'
              }}>
                Showing {startIndex + 1} to {Math.min(endIndex, reimbursements.length)} of {reimbursements.length} reimbursements
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReimbursementsPage; 
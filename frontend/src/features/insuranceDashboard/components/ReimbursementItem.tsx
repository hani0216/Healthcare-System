import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBillWave, faCheckCircle, faTimesCircle, faClock } from '@fortawesome/free-solid-svg-icons';

interface ReimbursementItemProps {
  id: number;
  status: string;
  amount: number;
  invoiceId: number;
  insuredId: number;
  medicalRecordId: number | null;
}

const ReimbursementItem: React.FC<ReimbursementItemProps> = ({
  id,
  status,
  amount,
  invoiceId,
  insuredId,
  medicalRecordId
}) => {
  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case 'APPROVED':
        return faCheckCircle;
      case 'REJECTED':
        return faTimesCircle;
      case 'PROCESSING':
        return faClock;
      default:
        return faClock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'APPROVED':
        return '#22c55e';
      case 'REJECTED':
        return '#ef4444';
      case 'PROCESSING':
        return '#eab308';
      default:
        return '#64748b';
    }
  };

  const getStatusBackgroundColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'APPROVED':
        return '#dcfce7';
      case 'REJECTED':
        return '#fee2e2';
      case 'PROCESSING':
        return '#fef3c7';
      default:
        return '#f1f5f9';
    }
  };

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      padding: '1rem',
      marginBottom: '1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FontAwesomeIcon 
            icon={faMoneyBillWave} 
            style={{ color: '#2563eb', fontSize: '1.2rem' }} 
          />
          <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: '#1e293b' }}>
            Reimbursement #{id}
          </h4>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FontAwesomeIcon 
            icon={getStatusIcon(status)} 
            style={{ color: getStatusColor(status), fontSize: '1rem' }} 
          />
          <span style={{ 
            fontSize: '0.9rem',
            fontWeight: 500,
            padding: '0.25rem 0.5rem',
            borderRadius: '0.25rem',
            backgroundColor: getStatusBackgroundColor(status),
            color: getStatusColor(status)
          }}>
            {status}
          </span>
        </div>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <span style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Invoice ID: {invoiceId}
          </span>
          <span style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Insured ID: {insuredId}
          </span>
          {medicalRecordId && (
            <span style={{ color: '#64748b', fontSize: '0.9rem' }}>
              Medical Record ID: {medicalRecordId}
            </span>
          )}
        </div>
        <span style={{ 
          fontSize: '1.1rem',
          fontWeight: 600,
          color: '#1e293b'
        }}>
          {amount.toFixed(2)} €
        </span>
      </div>
    </div>
  );
};

export default ReimbursementItem; 
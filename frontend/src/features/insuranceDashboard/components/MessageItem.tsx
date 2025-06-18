import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileInvoice, faEye, faCheck, faTimes, faMoneyBillWave } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { fetchInvoiceById, initializeReimbursement } from '../services/insuranceService';

interface MessageItemProps {
  id: number;
  senderId: number;
  receiverId: number;
  description: string;
  resourceType: string;
  resourceId: number;
  date: string;
  senderName?: string;
  onUpdate: () => void;
}

const MessageItem: React.FC<MessageItemProps> = ({
  id,
  senderId,
  receiverId,
  description,
  resourceType,
  resourceId,
  date,
  senderName,
  onUpdate
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isReimbursementLoading, setIsReimbursementLoading] = useState(false);
  const [showReimbursementForm, setShowReimbursementForm] = useState(false);
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const [reimbursementForm, setReimbursementForm] = useState({
    amount: '',
    insuredId: '',
    medicalRecordId: ''
  });

  const handleViewInvoice = async () => {
    try {
      setIsLoading(true);
      const invoice = await fetchInvoiceById(resourceId);
      setInvoiceData(invoice);
      toast.success("Invoice details loaded!", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error("Error viewing invoice:", error);
      toast.error("Failed to load invoice details", {
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

  const handleInitializeReimbursement = async () => {
    try {
      setIsReimbursementLoading(true);
      
      const reimbursementData = {
        status: "Processing",
        amount: parseFloat(reimbursementForm.amount),
        invoiceId: resourceId,
        insuredId: parseInt(reimbursementForm.insuredId),
        medicalRecordId: parseInt(reimbursementForm.medicalRecordId)
      };

      await initializeReimbursement(reimbursementData);
      
      toast.success("Reimbursement initialized successfully!", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setShowReimbursementForm(false);
      setReimbursementForm({ amount: '', insuredId: '', medicalRecordId: '' });
      onUpdate();
    } catch (error) {
      console.error("Error initializing reimbursement:", error);
      toast.error("Failed to initialize reimbursement", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsReimbursementLoading(false);
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type.toUpperCase()) {
      case 'INVOICE':
        return faFileInvoice;
      default:
        return faFileInvoice;
    }
  };

  const getResourceColor = (type: string) => {
    switch (type.toUpperCase()) {
      case 'INVOICE':
        return '#2563eb';
      default:
        return '#64748b';
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
            icon={getResourceIcon(resourceType)} 
            style={{ color: getResourceColor(resourceType), fontSize: '1.2rem' }} 
          />
          <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: '#1e293b' }}>
            {resourceType} - {description}
          </h4>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={handleViewInvoice}
            disabled={isLoading}
            style={{
              background: 'none',
              border: 'none',
              color: '#2563eb',
              cursor: 'pointer',
              padding: '0.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}
            title="View invoice details"
          >
            <FontAwesomeIcon icon={faEye} />
            <span style={{ fontSize: '0.9rem' }}>View</span>
          </button>
          <button
            onClick={() => setShowReimbursementForm(!showReimbursementForm)}
            style={{
              background: 'none',
              border: 'none',
              color: '#22c55e',
              cursor: 'pointer',
              padding: '0.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}
            title="Initialize reimbursement"
          >
            <FontAwesomeIcon icon={faMoneyBillWave} />
            <span style={{ fontSize: '0.9rem' }}>Initialize Reimbursement</span>
          </button>
        </div>
      </div>
      
      {showReimbursementForm && (
        <div style={{ 
          background: '#f8fafc', 
          padding: '1rem', 
          borderRadius: '0.5rem', 
          border: '1px solid #e2e8f0',
          marginTop: '0.5rem'
        }}>
          <h5 style={{ margin: '0 0 1rem 0', color: '#1e293b' }}>Initialize Reimbursement</h5>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <input
              type="number"
              placeholder="Amount"
              value={reimbursementForm.amount}
              onChange={(e) => setReimbursementForm(prev => ({ ...prev, amount: e.target.value }))}
              style={{
                padding: '0.5rem',
                borderRadius: '0.25rem',
                border: '1px solid #d1d5db',
                fontSize: '0.9rem'
              }}
            />
            <input
              type="number"
              placeholder="Insured ID"
              value={reimbursementForm.insuredId}
              onChange={(e) => setReimbursementForm(prev => ({ ...prev, insuredId: e.target.value }))}
              style={{
                padding: '0.5rem',
                borderRadius: '0.25rem',
                border: '1px solid #d1d5db',
                fontSize: '0.9rem'
              }}
            />
            <input
              type="number"
              placeholder="Medical Record ID"
              value={reimbursementForm.medicalRecordId}
              onChange={(e) => setReimbursementForm(prev => ({ ...prev, medicalRecordId: e.target.value }))}
              style={{
                padding: '0.5rem',
                borderRadius: '0.25rem',
                border: '1px solid #d1d5db',
                fontSize: '0.9rem'
              }}
            />
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowReimbursementForm(false);
                  setReimbursementForm({ amount: '', insuredId: '', medicalRecordId: '' });
                }}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.25rem',
                  border: '1px solid #d1d5db',
                  background: 'white',
                  color: '#64748b',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleInitializeReimbursement}
                disabled={isReimbursementLoading || !reimbursementForm.amount || !reimbursementForm.insuredId || !reimbursementForm.medicalRecordId}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.25rem',
                  border: 'none',
                  background: '#22c55e',
                  color: 'white',
                  cursor: 'pointer',
                  opacity: (isReimbursementLoading || !reimbursementForm.amount || !reimbursementForm.insuredId || !reimbursementForm.medicalRecordId) ? 0.5 : 1
                }}
              >
                {isReimbursementLoading ? 'Processing...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <span style={{ color: '#64748b', fontSize: '0.9rem' }}>
            From: {senderName || `Doctor ID: ${senderId}`}
          </span>
          <span style={{ color: '#64748b', fontSize: '0.9rem' }}>
            {new Date(date).toLocaleDateString()}
          </span>
        </div>
        <span style={{ 
          fontSize: '0.9rem',
          fontWeight: 500,
          padding: '0.25rem 0.5rem',
          borderRadius: '0.25rem',
          backgroundColor: `${getResourceColor(resourceType)}20`,
          color: getResourceColor(resourceType)
        }}>
          {resourceType}
        </span>
      </div>
    </div>
  );
};

export default MessageItem; 
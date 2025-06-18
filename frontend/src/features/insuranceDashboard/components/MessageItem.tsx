import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileInvoice, faEye, faCheck, faTimes, faMoneyBillWave, faBan } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { fetchInvoiceById, initializeReimbursement, checkReimbursementExistsForInvoice } from '../services/insuranceService';

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
    amount: ''
  });
  const [hasReimbursement, setHasReimbursement] = useState(false);
  const [checkingReimbursement, setCheckingReimbursement] = useState(true);
  const [reimbursementAction, setReimbursementAction] = useState<'initialize' | 'refuse' | null>(null);

  // Vérifier si un remboursement existe déjà pour cette facture
  useEffect(() => {
    const checkExistingReimbursement = async () => {
      try {
        console.log(`Checking existing reimbursement for resourceId: ${resourceId}, resourceType: ${resourceType}`);
        setCheckingReimbursement(true);
        const exists = await checkReimbursementExistsForInvoice(resourceId);
        console.log(`Reimbursement exists for resourceId ${resourceId}: ${exists}`);
        setHasReimbursement(exists);
      } catch (error) {
        console.error("Error checking existing reimbursement:", error);
        setHasReimbursement(false);
      } finally {
        setCheckingReimbursement(false);
      }
    };

    if (resourceType.toUpperCase() === 'INVOICE') {
      checkExistingReimbursement();
    } else {
      setCheckingReimbursement(false);
    }
  }, [resourceId, resourceType]);

  const handleInitializeReimbursement = async (status: string = "Processing") => {
    try {
      setIsReimbursementLoading(true);
      
      // Récupérer l'ID de l'assuré depuis le localStorage
      const insuredId = localStorage.getItem('specificId');
      if (!insuredId) {
        throw new Error('Insured ID not found in local storage');
      }

      // Récupérer les détails de la facture pour obtenir le medicalRecordId
      const invoice = await fetchInvoiceById(resourceId);
      if (!invoice || !invoice.medicalRecordId) {
        throw new Error('Medical record ID not found in invoice');
      }

      const reimbursementData = {
        status: status,
        amount: parseFloat(reimbursementForm.amount),
        invoiceId: resourceId,
        insuredId: parseInt(insuredId),
        medicalRecordId: invoice.medicalRecordId
      };

      await initializeReimbursement(reimbursementData);
      
      const actionText = status === "REJECTED" ? "rejected" : "initialized";
      toast.success(`Reimbursement ${actionText} successfully!`, {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setShowReimbursementForm(false);
      setReimbursementForm({ amount: '' });
      setReimbursementAction(null);
      setHasReimbursement(true); // Mettre à jour l'état local
      onUpdate();
    } catch (error) {
      console.error("Error initializing reimbursement:", error);
      toast.error("Failed to process reimbursement", {
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
          {/* Afficher les boutons seulement si pas de remboursement existant et pas en cours de vérification */}
          {!checkingReimbursement && !hasReimbursement && (
            <>
              <button
                onClick={() => {
                  setReimbursementAction('initialize');
                  setShowReimbursementForm(true);
                }}
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
                title="Initialize reimbursement"
              >
                <FontAwesomeIcon icon={faMoneyBillWave} />
                <span style={{ fontSize: '0.9rem' }}>Initialize Reimbursement</span>
              </button>
              <button
                onClick={() => {
                  setReimbursementAction('refuse');
                  setShowReimbursementForm(true);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ef4444',
                  cursor: 'pointer',
                  padding: '0.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}
                title="Refuse reimbursement"
              >
                <FontAwesomeIcon icon={faBan} />
                <span style={{ fontSize: '0.9rem' }}>Refuse Reimbursement</span>
              </button>
            </>
          )}

          {/* Afficher un indicateur si un remboursement existe déjà */}
          {!checkingReimbursement && hasReimbursement && (
            <span style={{
              color: '#22c55e',
              fontSize: '0.9rem',
              fontWeight: 500,
              padding: '0.25rem 0.5rem',
              borderRadius: '0.25rem',
              backgroundColor: '#dcfce7',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              <FontAwesomeIcon icon={faCheck} />
              Reimbursement Exists
            </span>
          )}
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
          <h5 style={{ margin: '0 0 1rem 0', color: '#1e293b' }}>
            {reimbursementAction === 'refuse' ? 'Refuse Reimbursement' : 'Initialize Reimbursement'}
          </h5>
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
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowReimbursementForm(false);
                  setReimbursementForm({ amount: '' });
                  setReimbursementAction(null);
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
                onClick={() => handleInitializeReimbursement(reimbursementAction === 'refuse' ? "REJECTED" : "Processing")}
                disabled={isReimbursementLoading || !reimbursementForm.amount}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.25rem',
                  border: 'none',
                  background: reimbursementAction === 'refuse' ? '#ef4444' : '#2563eb',
                  color: 'white',
                  cursor: 'pointer',
                  opacity: (isReimbursementLoading || !reimbursementForm.amount) ? 0.5 : 1
                }}
              >
                {isReimbursementLoading ? 'Processing...' : (reimbursementAction === 'refuse' ? 'Refuse' : 'Initialize')}
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
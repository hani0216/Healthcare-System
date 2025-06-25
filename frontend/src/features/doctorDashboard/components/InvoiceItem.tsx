import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileInvoice, faPen, faCheck, faTimes, faShare } from '@fortawesome/free-solid-svg-icons';
import { updateInvoice, shareInvoice, fetchInsuranceAdminByName, fetchPatientById } from '../services/medicalRecordService';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

interface InvoiceItemProps {
  id: number;
  invoiceDate: string;
  amount: number;
  description: string;
  status: string;
  medicalRecordId: number;
  onUpdate: () => void;
}

const InvoiceItem: React.FC<InvoiceItemProps> = ({
  id,
  invoiceDate,
  amount,
  description,
  status,
  medicalRecordId,
  onUpdate
}) => {
  const { patientId } = useParams<{ patientId: string }>();
  const [isEditing, setIsEditing] = useState(false);
  const [editAmount, setEditAmount] = useState(amount.toString());
  const [editDescription, setEditDescription] = useState(description);
  const [editStatus, setEditStatus] = useState(status);
  const [isLoading, setIsLoading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PAID':
        return '#22c55e';
      case 'PENDING':
        return '#eab308';
      case 'DRAFT':
        return '#64748b';
      case 'CANCELED':
        return '#ef4444';
      default:
        return '#64748b';
    }
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const specificId = localStorage.getItem("specificId");
      if (!specificId) {
        throw new Error("No specific ID found");
      }

      await updateInvoice(id, parseInt(specificId), {
        amount: parseFloat(editAmount),
        description: editDescription,
        status: editStatus,
        medicalRecordId
      });

      toast.success("Invoice updated successfully!", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error("Error updating invoice:", error);
      toast.error("Failed to update invoice", {
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

  const handleCancel = () => {
    setEditAmount(amount.toString());
    setEditDescription(description);
    setEditStatus(status);
    setIsEditing(false);
  };

  const handleShare = async () => {
    try {
      console.log("Starting share process...");
      console.log("Patient ID from URL:", patientId);
      
      setIsSharing(true);
      const specificId = localStorage.getItem("specificId");
      console.log("Doctor ID (specificId) from localStorage:", specificId);
      
      if (!specificId) {
        throw new Error("No doctor ID found");
      }

      if (!patientId) {
        console.log("No patient ID available in URL");
        throw new Error("No patient ID available");
      }

      // Récupérer les informations du patient
      console.log("Fetching patient data for ID:", patientId);
      const patientData = await fetchPatientById(parseInt(patientId));
      console.log("Patient data:", patientData);

      if (!patientData) {
        console.log("No patient data received");
        throw new Error("Failed to fetch patient data");
      }

      if (!patientData.insurance) {
        console.log("No insurance company in patient data:", patientData);
        throw new Error("No insurance company found for this patient");
      }

      console.log("Insurance company found:", patientData.insurance);

      // Récupérer l'ID de l'administrateur d'assurance
      console.log("Fetching insurance admin for company:", patientData.insurance);
      const insuranceAdminId = await fetchInsuranceAdminByName(patientData.insurance);
      console.log("Insurance Admin ID received:", insuranceAdminId);

      if (!insuranceAdminId) {
        console.log("No insurance admin ID received");
        throw new Error("Failed to find insurance admin");
      }

      console.log("Sharing invoice with insurance admin ID:", insuranceAdminId);
      await shareInvoice(
        parseInt(specificId), // ID du médecin (sender)
        insuranceAdminId,     // ID de l'administrateur d'assurance (receiver)
        `${description} - Invoice amount: ${amount} €`, // Message
        id
      );

      console.log("Invoice shared successfully");
      toast.success("Invoice shared successfully with insurance provider!", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error("Error in share process:", error);
      console.log("Error details:", {
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined
      });
      
      toast.error(error instanceof Error ? error.message : "Failed to share invoice with insurance provider", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsSharing(false);
      console.log("Share process completed");
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
      {!isEditing ? (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FontAwesomeIcon icon={faFileInvoice} style={{ color: '#2563eb', fontSize: '1.2rem' }} />
              <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: '#1e293b' }}>
                {description}
              </h4>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={handleShare}
                disabled={isSharing}
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
                title="Share with insurance provider"
              >
                <FontAwesomeIcon icon={faShare} />
                <span style={{ fontSize: '0.9rem' }}>Share</span>
              </button>
              <button
                onClick={() => setIsEditing(true)}
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
              >
                <FontAwesomeIcon icon={faPen} />
                <span style={{ fontSize: '0.9rem' }}>Edit</span>
              </button>
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <span style={{ color: '#64748b', fontSize: '0.9rem' }}>
                {new Date(invoiceDate).toLocaleDateString()}
              </span>
              <span style={{ 
                color: getStatusColor(status),
                fontSize: '0.9rem',
                fontWeight: 500,
                padding: '0.25rem 0.5rem',
                borderRadius: '0.25rem',
                backgroundColor: `${getStatusColor(status)}20`
              }}>
                {status}
              </span>
            </div>
            <span style={{ 
              fontSize: '1.1rem',
              fontWeight: 600,
              color: '#1e293b'
            }}>
              {amount.toFixed(2)} €
            </span>
          </div>
        </>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input
              type="number"
              value={editAmount}
              onChange={(e) => setEditAmount(e.target.value)}
              placeholder="Amount"
              style={{
                flex: 1,
                padding: '0.5rem',
                borderRadius: '0.25rem',
                border: '1px solid #d1d5db',
                fontSize: '0.9rem'
              }}
            />
            <select
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value)}
              style={{
                padding: '0.5rem',
                borderRadius: '0.25rem',
                border: '1px solid #d1d5db',
                fontSize: '0.9rem',
                backgroundColor: 'white', width:'20vh'
              }}
            >
              <option value="DRAFT">Draft</option>
              <option value="PENDING">Pending</option>
              <option value="PAID">Paid</option>
              <option value="CANCELED">Canceled</option>
            </select>
          </div>
          <input
            type="text"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="Description"
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '0.25rem',
              border: '1px solid #d1d5db',
              fontSize: '0.9rem'
            }}
          />
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <button
              onClick={handleCancel}
              disabled={isLoading}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.25rem',
                border: '1px solid #d1d5db',
                background: 'white',
                color: '#64748b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <FontAwesomeIcon icon={faTimes} />
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.25rem',
                border: 'none',
                background: '#2563eb',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <FontAwesomeIcon icon={faCheck} />
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceItem; 
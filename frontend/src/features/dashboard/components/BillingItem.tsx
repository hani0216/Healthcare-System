import React, { useState } from 'react';

const STATUS_COLORS: Record<string, string> = {
  Processing: '#fbbf24', // jaune
  PROCESSING: '#fbbf24',
  Approved: '#22c55e', // vert
  APPROVED: '#22c55e',
  Rejected: '#ef4444', // rouge
  REJECTED: '#ef4444',
  Paid: '#22c55e',
  Pending: '#fbbf24',
};

interface BillingItemProps {
  date: string;
  price: number;
  description: string;
  doctorName: string;
  invoiceId: number;
  fetchReimbursement: (invoiceId: string) => Promise<any>;
}

const BillingItem: React.FC<BillingItemProps> = ({ date, price, description, doctorName, invoiceId, fetchReimbursement }) => {
  const [showReimbursement, setShowReimbursement] = useState(false);
  const [reimbursement, setReimbursement] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    if (!showReimbursement) {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchReimbursement(invoiceId.toString());
        console.log(invoiceId);
        if (Array.isArray(data) && data.length > 0 && data[0]) {
          setReimbursement(data[0]);
        } else {
          setReimbursement(null);
          setError('No reimbursement found for this invoice yet.');
        }
      } catch (e: any) {
        setError('No reimbursement found for this invoice yet.');
      } finally {
        setLoading(false);
      }
    }
    setShowReimbursement((v) => !v);
  };

  return (
    <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', padding: 24, marginBottom: 16, cursor: 'pointer', transition: 'box-shadow 0.2s', border: '1px solid #e5e7eb' }} onClick={handleClick}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ fontWeight: 600, fontSize: 18 }}>{description}</div>
        <div style={{ fontWeight: 700, color: '#28A6A7', fontSize: 20 }}>{price} €</div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 15, color: '#555' }}>
        <span>Date: {new Date(date).toLocaleDateString()}</span>
        <span>By: <span style={{ color: '#2563eb', fontWeight: 500 }}>{doctorName}</span></span>
      </div>
      {showReimbursement && (
        <div style={{ marginTop: 18, background: '#f3f4f6', borderRadius: 8, padding: 16 }}>
          {loading ? (
            <span>Loading reimbursement...</span>
          ) : error ? (
            <span style={{ color: '#ef4444' }}>{error}</span>
          ) : reimbursement ? (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 500 }}>Reimbursement amount:</span>
              <span style={{ fontWeight: 600 }}>{reimbursement.amount} €</span>
              <span style={{
                background: STATUS_COLORS[reimbursement.status] || '#e5e7eb',
                color: '#222',
                padding: '4px 14px',
                borderRadius: 16,
                fontWeight: 600,
                fontSize: 15,
                marginLeft: 12,
              }}>{reimbursement.status}</span>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default BillingItem; 
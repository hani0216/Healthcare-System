import React, { useEffect, useState } from 'react';
import SideBar from '../components/sideBar';
import DashboardActionsBar from '../components/DashboardActionsBar';
import MessageItem from '../components/MessageItem';
import { fetchReceivedMessages, fetchDoctorName, fetchInvoiceById } from '../services/insuranceService';
import { ToastContainer, toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import 'react-toastify/dist/ReactToastify.css';

export default function InsuranceHome() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [doctorNames, setDoctorNames] = useState<Record<number, string>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    const loadMessages = async () => {
      try {
        setLoading(true);
        const specificId = localStorage.getItem("specificId");
        if (!specificId) {
          throw new Error("No specific ID found");
        }

        const receivedMessages = await fetchReceivedMessages(parseInt(specificId));
        // Pour chaque message de type INVOICE, récupérer l'invoiceDate
        const messagesWithInvoiceDate = await Promise.all(receivedMessages.map(async (msg: any) => {
          if (msg.resourceType === 'INVOICE' && msg.resourceId) {
            try {
              const invoice = await fetchInvoiceById(msg.resourceId);
              return { ...msg, displayDate: invoice.invoiceDate };
            } catch (e) {
              return { ...msg, displayDate: msg.date };
            }
          }
          return { ...msg, displayDate: msg.date };
        }));
        // Trier les messages par date (du plus récent au plus ancien)
        const sortedMessages = messagesWithInvoiceDate.sort((a: any, b: any) => {
          const dateA = new Date(a.displayDate || 0);
          const dateB = new Date(b.displayDate || 0);
          return dateB.getTime() - dateA.getTime();
        });
        setMessages(sortedMessages);

        // Récupérer les noms des médecins expéditeurs
        const uniqueDoctorIds = Array.from(new Set(receivedMessages.map((msg: any) => msg.senderId))) as number[];
        const doctorNamesMap: Record<number, string> = {};
        
        for (const doctorId of uniqueDoctorIds) {
          try {
            const doctorName = await fetchDoctorName(doctorId);
            doctorNamesMap[doctorId] = doctorName;
          } catch (error) {
            console.error(`Error fetching doctor name for ID ${doctorId}:`, error);
            doctorNamesMap[doctorId] = "Unknown Doctor";
          }
        }
        
        setDoctorNames(doctorNamesMap);
      } catch (error) {
        console.error("Error loading messages:", error);
        setError(error instanceof Error ? error.message : "Failed to load messages");
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  const userName = localStorage.getItem('userName') || 'Insurance';

  // Calcul de la pagination
  const totalPages = Math.ceil(messages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMessages = messages.slice(startIndex, endIndex);

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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 className="text-2xl font-bold" style={{ color: '#28A6A7' }}>Received Messages</h2>
            <button
              onClick={handleRefresh}
              style={{
                background: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: 8,
                padding: "8px 16px",
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              Refresh
            </button>
          </div>

          {loading && (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div>Loading messages...</div>
            </div>
          )}

          {error && (
            <div style={{ 
              background: '#fee2e2', 
              color: '#dc2626', 
              padding: '1rem', 
              borderRadius: '0.5rem', 
              marginBottom: '1rem' 
            }}>
              {error}
            </div>
          )}

          {!loading && !error && messages.length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              padding: '2rem', 
              color: '#64748b',
              background: 'white',
              borderRadius: '0.5rem',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>
              No messages received yet.
            </div>
          )}

          {!loading && !error && messages.length > 0 && (
            <>
              <div className="flex flex-col gap-4">
                {currentMessages.map((message) => (
                  <MessageItem
                    key={message.id}
                    id={message.id}
                    senderId={message.senderId}
                    receiverId={message.receiverId}
                    description={message.description}
                    resourceType={message.resourceType}
                    resourceId={message.resourceId}
                    date={message.date}
                    displayDate={message.displayDate}
                    senderName={doctorNames[message.senderId]}
                    onUpdate={handleRefresh}
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
                Showing {startIndex + 1} to {Math.min(endIndex, messages.length)} of {messages.length} messages
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 
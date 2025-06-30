import React, { useEffect, useState } from "react";
import SideBar from "../components/sideBar";
import DashboardActionsBar from "../components/DashboardActionsBar";
import MessageItem from "../components/MessageItem";
import MessageListItem from "../components/MessageListItem";
import MessageContent from "../components/MessageContent";
import { fetchReceivedMessages, updateMessageSeen, deleteMessage, getMedicalRecordIdFromDocument, getPatientIdFromMedicalRecord, getPatientIdByDocumentId } from "../services/messagesService";
import { fetchDocumentById, fetchDoctorName } from "../services/medicalRecordService";
import { FaEnvelopeOpenText, FaTrash } from "react-icons/fa";
import PdfCard from "../components/PdfCard";
import PdfCardReadOnly from "../components/PdfCardReadOnly";
import { useNavigate } from "react-router-dom";

export default function MessagesPage() {
  const userName = localStorage.getItem("userName") || "Doctor";
  const receiverId = Number(localStorage.getItem("specificId"));
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<any | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [messagesPerPage] = useState(10); // 10 messages par page
  const navigate = useNavigate();

  useEffect(() => {
    if (!receiverId) return;
    setLoading(true);
    fetchReceivedMessages(receiverId)
      .then(async (msgs) => {
        // Trier les messages par date d'envoi (du plus récent au plus ancien)
        const sortedMsgs = msgs.sort((a: any, b: any) => {
          const dateA = new Date(a.sendingDate || a.date || 0);
          const dateB = new Date(b.sendingDate || b.date || 0);
          return dateB.getTime() - dateA.getTime();
        });
        
        // Pour chaque message, récupérer le nom du sender
        const msgsWithNames = await Promise.all(
          sortedMsgs.map(async (msg: any) => {
            const senderName = await fetchDoctorName(msg.senderId);
            return { ...msg, senderName };
          })
        );
        setMessages(msgsWithNames);
      })
      .catch(() => setMessages([]))
      .finally(() => setLoading(false));
  }, [receiverId]);

  useEffect(() => {
    if (selectedMessage && selectedMessage.resourceType === "DOCUMENT") {
      fetchDocumentById(selectedMessage.resourceId)
        .then(async (doc) => {
          // Récupérer le nom du médecin si besoin
          let doctorName = doc.uploadedById
            ? await fetchDoctorName(doc.uploadedById)
            : "Unknown";
          setSelectedDocument({ 
            ...doc, 
            doctorName,
            patientId: selectedMessage.patientId
          });
        })
        .catch(() => setSelectedDocument(null));
    } else {
      setSelectedDocument(null);
    }
  }, [selectedMessage]);

  // Calcul de la pagination pour les messages
  const indexOfLastMessage = currentPage * messagesPerPage;
  const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
  const currentMessages = messages.slice(indexOfFirstMessage, indexOfLastMessage);
  const totalPages = Math.ceil(messages.length / messagesPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div style={{ height: "auto", display: "flex" }}>
      <SideBar />
      <div style={{ flex: 1, background: "#f5f6fa", position: "relative", minHeight: "100vh" }}>
        <DashboardActionsBar userName={userName} />
        <div style={{ display: "flex", height: "100%", width:'100%', margin: "0", background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px #0001", overflow: "hidden" }}>
          {/* Liste des messages à gauche */}
          <div style={{ width: 350, borderRight: "1px solid #e5e7eb", background: "#f8fafc", display: "flex", flexDirection: "column" }}>
            <input
              type="text"
              placeholder="Rechercher un message…"
              style={{
                margin: 16,
                padding: "10px 16px",
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                fontSize: 15,
                outline: "none"
              }}
              disabled
            />
            <div style={{ flex: 1, overflowY: "auto" }}>
              {loading ? (
                <div style={{ color: "#888", textAlign: "center", marginTop: 40 }}>Loading...</div>
              ) : messages.length === 0 ? (
                <div style={{ color: "#888", textAlign: "center", marginTop: 40 }}>No messages recieved yet.</div>
              ) : (
                <>
                  {currentMessages.map(msg => (
                    <div key={msg.id} style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                      <MessageListItem
                        sender={msg.senderName}
                        date={new Date(msg.sendingDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        message={msg.description}
                        seen={msg.seen}
                        selected={selectedMessage?.id === msg.id}
                        onClick={async () => {
                          setSelectedMessage(msg);
                          if (!msg.seen) {
                            try {
                              await updateMessageSeen(msg);
                              setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, seen: true } : m));
                            } catch {}
                          }
                        }}
                      />
                      <button
                        style={{
                          position: 'absolute',
                          right: 8,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          color: '#e11d48',
                          cursor: 'pointer',
                          fontSize: 18,
                          zIndex: 2
                        }}
                        title="Supprimer le message"
                        onClick={async (e) => {
                          e.stopPropagation();
                          try {
                            await deleteMessage(msg.id);
                            setMessages(prev => prev.filter(m => m.id !== msg.id));
                            if (selectedMessage?.id === msg.id) setSelectedMessage(null);
                          } catch {}
                        }}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                  
                  {/* Pagination pour les messages */}
                  {totalPages > 1 && (
                    <div style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '20px',
                      borderTop: '1px solid #e5e7eb',
                      marginTop: '20px'
                    }}>
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          border: '1px solid #e5e7eb',
                          background: currentPage === 1 ? '#f3f4f6' : '#fff',
                          color: currentPage === 1 ? '#9ca3af' : '#374151',
                          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                          fontWeight: 500,
                          fontSize: '14px'
                        }}
                      >
                        Précédent
                      </button>
                      
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            style={{
                              padding: '6px 10px',
                              borderRadius: '4px',
                              border: '1px solid #e5e7eb',
                              background: currentPage === page ? '#28a6a7' : '#fff',
                              color: currentPage === page ? '#fff' : '#374151',
                              cursor: 'pointer',
                              fontWeight: 500,
                              fontSize: '14px',
                              minWidth: '32px'
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
                          padding: '6px 12px',
                          borderRadius: '6px',
                          border: '1px solid #e5e7eb',
                          background: currentPage === totalPages ? '#f3f4f6' : '#fff',
                          color: currentPage === totalPages ? '#9ca3af' : '#374151',
                          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                          fontWeight: 500,
                          fontSize: '14px'
                        }}
                      >
                        Suivant
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          {/* Affichage du message sélectionné à droite */}
          <div style={{ flex: 1, background: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {selectedMessage ? (
              selectedMessage.resourceType === "DOCUMENT" && selectedDocument ? (
                <div style={{ width:'100%', height:'800px' , marginTop:'0px', margin:'0' ,padding:'0'}}>
                  {/* Affichage du message comme avant */}
                  <MessageContent
                    senderName={selectedMessage.senderName}
                    senderEmail={selectedMessage.senderEmail}
                    subject={selectedMessage.subject || selectedMessage.description?.split(" ").slice(0, 4).join(" ")}
                    date={new Date(selectedMessage.sendingDate).toLocaleDateString()}
                    message={selectedMessage.description}
                    senderId={selectedMessage.senderId}
                    documentId={selectedMessage.resourceId}
                    resourceType={selectedMessage.resourceType}
                  >
                    <div style={{ marginTop: 32, width: "100%", padding: "0 20px" }}>
                      <div onClick={async () => {
                        let patientId = selectedDocument.patientId;
                        if (!patientId && selectedDocument.id) {
                          try {
                            patientId = await getPatientIdByDocumentId(selectedDocument.id);
                            console.log('patientId from new API:', patientId);
                          } catch (e) {
                            console.error('Erreur lors de la récupération du patientId via nouvelle API:', e);
                            return;
                          }
                        } else {
                          console.log('patientId direct from document:', patientId);
                        }
                        if (patientId && selectedDocument.id) {
                          navigate(`/doctor/patient/${patientId}/medical-record?openDocumentId=${selectedDocument.id}`);
                        } else if (patientId) {
                          navigate(`/doctor/patient/${patientId}/medical-record`);
                        }
                      }} style={{ cursor: 'pointer' }}>
                        <PdfCardReadOnly
                          documentTitle={selectedDocument.name}
                          noteTitle={selectedDocument.note?.title || ""}
                          noteDescription={selectedDocument.note?.description || ""}
                          creator={selectedDocument.doctorName}
                          creationDate={selectedDocument.creationDate}
                          contentUrl={selectedDocument.content?.[0] || ""}
                          doctorId={selectedDocument.uploadedById}
                          patientId={selectedDocument.patientId}
                        />
                      </div>
                    </div>
                  </MessageContent>
                </div>
              ) : (
                <MessageContent
                  senderName={selectedMessage.senderName}
                  senderEmail={selectedMessage.senderEmail}
                  subject={selectedMessage.subject || selectedMessage.description?.split(" ").slice(0, 4).join(" ")}
                  date={new Date(selectedMessage.sendingDate).toLocaleDateString()}
                  message={selectedMessage.description}
                  senderId={selectedMessage.senderId}
                  documentId={selectedMessage.resourceId}
                  resourceType={selectedMessage.resourceType}
                />
              )
            ) : (
              <div style={{ textAlign: "center", color: "#6b7280" }}>
                <FaEnvelopeOpenText style={{ fontSize: 48, marginBottom: 16 }} />
                <div style={{ fontWeight: 600, fontSize: 22, marginBottom: 8 }}>Aucun message sélectionné</div>
                <div style={{ color: "#888" }}>Sélectionnez un message dans la liste pour le lire</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
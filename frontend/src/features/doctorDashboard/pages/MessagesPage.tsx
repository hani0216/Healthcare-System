import React, { useEffect, useState } from "react";
import SideBar from "../components/sideBar";
import DashboardActionsBar from "../components/DashboardActionsBar";
import MessageItem from "../components/MessageItem";
import MessageListItem from "../components/MessageListItem";
import MessageContent from "../components/MessageContent";
import { fetchReceivedMessages } from "../services/messagesService";
import { fetchDocumentById, fetchDoctorName } from "../services/medicalRecordService";
import { FaEnvelopeOpenText } from "react-icons/fa";
import PdfCard from "../components/PdfCard";
import PdfCardReadOnly from "../components/PdfCardReadOnly";

export default function MessagesPage() {
  const userName = localStorage.getItem("userName") || "Doctor";
  const receiverId = Number(localStorage.getItem("specificId"));
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<any | null>(null);

  useEffect(() => {
    if (!receiverId) return;
    setLoading(true);
    fetchReceivedMessages(receiverId)
      .then(async (msgs) => {
        // Pour chaque message, récupérer le nom du sender
        const msgsWithNames = await Promise.all(
          msgs.map(async (msg: any) => {
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
                <div style={{ color: "#888", textAlign: "center", marginTop: 40 }}>Chargement…</div>
              ) : messages.length === 0 ? (
                <div style={{ color: "#888", textAlign: "center", marginTop: 40 }}>Aucun message partagé pour le moment.</div>
              ) : (
                messages.map(msg => (
                  <MessageListItem
                  key={msg.id}
                  sender={msg.senderName}
                  date={new Date(msg.sendingDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  message={msg.description}
                  seen={msg.seen}
                  selected={selectedMessage?.id === msg.id}
                  onClick={() => setSelectedMessage(msg)}
                />
                ))
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
                  >
                    <div style={{ marginTop: 32, width: "100%", padding: "0 20px" }}>
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
                  </MessageContent>
                </div>
              ) : (
                <MessageContent
                  senderName={selectedMessage.senderName}
                  senderEmail={selectedMessage.senderEmail}
                  subject={selectedMessage.subject || selectedMessage.description?.split(" ").slice(0, 4).join(" ")}
                  date={new Date(selectedMessage.sendingDate).toLocaleDateString()}
                  message={selectedMessage.description}
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
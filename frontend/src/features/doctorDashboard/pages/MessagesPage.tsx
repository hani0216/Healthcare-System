import React, { useEffect, useState } from "react";
import SideBar from "../components/sideBar";
import DashboardActionsBar from "../components/DashboardActionsBar";
import MessageItem from "../components/MessageItem";
import MessageListItem from "../components/MessageListItem";
import { fetchReceivedMessages } from "../services/messagesService";
import { fetchDoctorName } from "../services/medicalRecordService";
import { FaEnvelopeOpenText } from "react-icons/fa";

export default function MessagesPage() {
  const userName = localStorage.getItem("userName") || "Doctor";
  const receiverId = Number(localStorage.getItem("specificId"));
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);

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
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "#f9fafb" }}>
            {selectedMessage ? (
              <div style={{ maxWidth: 500, width: "100%", background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px #0001", padding: 32 }}>
                <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 8, color: "#2563eb" }}>
                  Message de : {selectedMessage.senderId}
                </div>
                <div style={{ fontSize: 13, color: "#888", marginBottom: 16 }}>
                  {new Date(selectedMessage.sendingDate).toLocaleString()}
                </div>
                <div style={{ marginBottom: 16 }}>{selectedMessage.description}</div>
                {selectedMessage.resourceType === "DOCUMENT" && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#f1f5f9", borderRadius: 6, padding: "6px 12px", width: "fit-content" }}>
                    <FaEnvelopeOpenText style={{ color: "#e11d48" }} />
                    <span style={{ fontSize: 15 }}>Document ID: {selectedMessage.resourceId}</span>
                  </div>
                )}
              </div>
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
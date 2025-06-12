import React, { useEffect, useState } from "react";
import SideBar from "../components/sideBar";
import DashboardActionsBar from "../components/DashboardActionsBar";
import MessageItem from "../components/MessageItem";
import { fetchReceivedMessages } from "../services/messagesService";

export default function MessagesPage() {
  const userName = localStorage.getItem("userName") || "Doctor";
  const receiverId = Number(localStorage.getItem("specificId"));
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!receiverId) return;
    setLoading(true);
    fetchReceivedMessages(receiverId)
      .then(setMessages  )
      .catch(() => setMessages([]))
      .finally(() => setLoading(false));
  }, [receiverId]);

  return (
    <div style={{ height: "auto", display: "flex" }}>
      <SideBar />
      <div style={{ flex: 1, background: "#f5f6fa", position: "relative", minHeight: "100vh" }}>
        <DashboardActionsBar userName={userName} />
        <div style={{ maxWidth: 700, margin: "40px auto", background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px #0001", padding: 24 }}>
          <h2 style={{ fontWeight: 700, fontSize: 24, marginBottom: 24, color: "#28A6A7" }}>Messages partagés</h2>
          <div>
            {loading ? (
              <div style={{ color: "#888", textAlign: "center", marginTop: 40 }}>Chargement...</div>
            ) : messages.length === 0 ? (
              <div style={{ color: "#888", textAlign: "center", marginTop: 40 }}>Aucun message partagé pour le moment.</div>
            ) : (
              messages.map(msg => <MessageItem key={msg.id} message={msg} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
import React, { useState } from "react";
import { sendDocument } from '../services/medicalRecordService';

interface MessageContentProps {
  senderName: string;
  senderEmail?: string;
  subject?: string;
  date?: string;
  message: string;
  senderId: number;
  documentId?: number;
  children?: React.ReactNode;
  resourceType?: string;
}

const MessageContent: React.FC<MessageContentProps> = ({
  senderName,
  senderEmail,
  subject,
  date,
  message,
  senderId,
  documentId,
  children,
  resourceType,
}) => {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleReply = () => setShowReply((v) => !v);

  const handleSend = async () => {
    setSending(true);
    setSuccess("");
    setError("");
    try {
      const myId = localStorage.getItem("specificId");
      if (resourceType === "DOCUMENT" && documentId) {
        // Utiliser la fonction sendDocument exactement comme pour le partage
        await sendDocument(Number(myId), senderId, replyText, documentId);
      } else {
        // Message simple (fallback, mais on utilise aussi sendDocument pour garder la même logique)
        await sendDocument(Number(myId), senderId, replyText, documentId ?? 0);
      }
      setSuccess("Message envoyé !");
      setReplyText("");
      setShowReply(false);
    } catch (e) {
      setError("Erreur lors de l'envoi du message");
      if (e instanceof Error) {
        console.error('Erreur lors de l\'envoi du message:', e.message, e);
      } else {
        console.error('Erreur inconnue lors de l\'envoi du message:', e);
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ padding: 40, width: "100%", boxSizing: "border-box" }}>
      <div style={{ fontWeight: 700, fontSize: 24, marginBottom: 18 }}>
        {subject || "Sujet du message"}
      </div>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "#e0e7ff",
            color: "#2563eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: 20,
            marginRight: 16,
          }}
        >
          {senderName.charAt(0).toUpperCase()}
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 17 }}>{senderName}</div>
          <div style={{ color: "#888", fontSize: 15 }}>
            {senderEmail || ""}
          </div>
        </div>
        <div style={{ marginLeft: "auto", color: "#888", fontSize: 15 }}>
          {date || ""}
        </div>
      </div>
      <div style={{ fontSize: 17, color: "#222", lineHeight: 1.7, marginBottom: 40, whiteSpace: "pre-line" }}>
        {message}
      </div>
      <div style={{ display: "flex", gap: 16, marginBottom: 0 }}>
        <button
          style={{
            background: "#6366f1",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "10px 32px",
            fontWeight: 600,
            fontSize: 16,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
          onClick={handleReply}
        >
          <span style={{ fontSize: 18 }}>↩</span> Répondre
        </button>
      </div>
      {showReply && (
        <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 8 }}>
          <textarea
            style={{ width: "100%", minHeight: 60, borderRadius: 8, border: "1px solid #e5e7eb", padding: 10, fontSize: 16 }}
            placeholder="Écrire une réponse..."
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
            disabled={sending}
          />
          <button
            style={{ alignSelf: "flex-end", background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, padding: "8px 24px", fontWeight: 600, fontSize: 16, cursor: sending ? "not-allowed" : "pointer" }}
            onClick={handleSend}
            disabled={sending || !replyText.trim()}
          >
            {sending ? "Envoi..." : "Send"}
          </button>
          {success && <div style={{ color: "green", marginTop: 4 }}>{success}</div>}
          {error && <div style={{ color: "red", marginTop: 4 }}>{error}</div>}
        </div>
      )}
      {/* Ajoute le PDF juste sous les boutons */}
      {children}
    </div>
  );
};

export default MessageContent;
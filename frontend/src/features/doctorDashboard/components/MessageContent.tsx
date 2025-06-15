import React from "react";

interface MessageContentProps {
  senderName: string;
  senderEmail?: string;
  subject?: string;
  date?: string;
  message: string;
  children?: React.ReactNode; // Ajouté
}

const MessageContent: React.FC<MessageContentProps> = ({
  senderName,
  senderEmail,
  subject,
  date,
  message,
  children, // Ajouté
}) => {
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
        >
          <span style={{ fontSize: 18 }}>↩</span> Répondre
        </button>
        <button
          style={{
            background: "#fff",
            color: "#222",
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            padding: "10px 32px",
            fontWeight: 600,
            fontSize: 16,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span style={{ fontSize: 18 }}>⤴</span> Transférer
        </button>
      </div>
      {/* Ajoute le PDF juste sous les boutons */}
      {children}
    </div>
  );
};

export default MessageContent;
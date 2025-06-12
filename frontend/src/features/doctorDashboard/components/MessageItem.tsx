import React from "react";
import { FaFilePdf } from "react-icons/fa";

interface MessageItemProps {
  message: {
    id: number;
    resourceId: number;
    senderId: number;
    receiverId: number;
    resourceType: string;
    sendingDate: string;
    seen: boolean;
    description: string;
  };
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  return (
    <div
      style={{
        borderBottom: "1px solid #e5e7eb",
        padding: "18px 0",
        display: "flex",
        alignItems: "flex-start",
        gap: 16,
        background: message.seen ? "#fff" : "#e0f2fe"
      }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, color: "#2563eb" }}>
          De: {message.senderId}
        </div>
        <div style={{ fontSize: 13, color: "#888", marginBottom: 6 }}>
          {new Date(message.sendingDate).toLocaleString()}
        </div>
        <div style={{ marginBottom: 8 }}>{message.description}</div>
        {message.resourceType === "DOCUMENT" && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#f1f5f9", borderRadius: 6, padding: "6px 12px", width: "fit-content" }}>
            <FaFilePdf style={{ color: "#e11d48" }} />
            <span style={{ fontSize: 15 }}>Document ID: {message.resourceId}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageItem;
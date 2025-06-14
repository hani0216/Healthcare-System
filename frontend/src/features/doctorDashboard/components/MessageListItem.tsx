import React from "react";

interface MessageListItemProps {
  sender: string;
  date: string;
  message: string;
  seen?: boolean;
  selected?: boolean;
  onClick?: () => void;
}

const MessageListItem: React.FC<MessageListItemProps> = ({
  sender,
  date,
  message,
  seen = false,
  selected = false,
  onClick,
}) => {
  // Couleur de fond selon l'état (sélectionné > non lu > lu)
  let bgColor = "#f8fafc";
  if (selected) bgColor = "#e0e7ff";
  else if (!seen) bgColor = "#e0f2fe";

  return (
    <div
      onClick={onClick}
      style={{
        cursor: "pointer",
        background: bgColor,
        padding: "14px 20px 10px 20px",
        borderBottom: "1px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        transition: "background 0.2s",
      }}
    >
      {/* Cercle avec initiale */}
      <div
        style={{
          width: 38,
          height: 38,
          minWidth: 38,
          minHeight: 38,
          borderRadius: "50%",
          background: "#e0e7ff",
          color: "#2563eb",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
          fontSize: 18,
          marginRight: 16,
          flexShrink: 0,
          boxSizing: "border-box",
        }}
      >
        {sender.charAt(0).toUpperCase()}
      </div>
      {/* Infos message */}
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontWeight: 600, color: "#222", fontSize: 15 }}>{sender}</span>
          <span style={{ color: "#888", fontSize: 13 }}>{date}</span>
        </div>
        <div style={{ color: "#555", fontSize: 14, marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {
            message
              .split(" ")
              .slice(0, 3)
              .join(" ")
              + (message.split(" ").length > 3 ? "..." : "")
          }
        </div>
      </div>
    </div>
  );
};

export default MessageListItem;


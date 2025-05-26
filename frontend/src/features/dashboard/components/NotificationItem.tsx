import React from "react";
import '../style/dash.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/en';

// Props pour le composant NotificationItem
interface NotificationItemProps {
  title: string;
  message: string;
  seen: boolean;
  time: string;
  type: "message" | "appointment" | "results" | "prescription" | "payment" | "system" | string;
  onDelete?: () => void;
  onMarkAsRead?: () => void;
}

// Mapping type -> couleur de fond et icône FontAwesome
const typeStyles: Record<string, { color: string; icon: string }> = {
  message:      { color: "bg-blue-500",    icon: "fa-envelope" },
  appointment:  { color: "bg-purple-500",  icon: "fa-calendar-day" },
  results:      { color: "bg-green-500",   icon: "fa-file-medical" },
  prescription: { color: "bg-yellow-500",  icon: "fa-prescription-bottle-medical" },
  payment:      { color: "bg-indigo-500",  icon: "fa-receipt" },
  system:       { color: "bg-red-500",     icon: "fa-bell" },
  info:         { color: "bg-blue-500",    icon: "fa-info-circle" },
  warning:      { color: "bg-yellow-500",  icon: "fa-exclamation-triangle" },
  success:      { color: "bg-green-500",   icon: "fa-check-circle" },
  error:        { color: "bg-red-500",     icon: "fa-times-circle" },
  default:      { color: "bg-cyan-500",    icon: "fa-bell" }
};

dayjs.extend(relativeTime);

export default function NotificationItem({
  title,
  message,
  seen,
  time,
  type,
  onDelete,
  onMarkAsRead
}: NotificationItemProps) {
  const { color, icon } = typeStyles[type] || typeStyles.default;
  // Formatage du temps relatif en anglais
  const relativeTimeStr = dayjs(time).locale('en').fromNow();

  return (
    <div
      className={`notification-item p-3 hover:bg-gray-50 relative rounded-xl shadow-sm mb-2 transition-all duration-300 ${!seen ? "unread" : ""}`}
      style={{
        backgroundColor: !seen ? "#f0f9ff" : "#fff",
        opacity: seen ? 0.7 : 1,
        borderLeft: `4px solid var(--tw-${color.replace("bg-", "")}-500, #06b6d4)`
      }}
    >
      <div className="flex items-center justify-between w-full" >
        <div className="flex items-start">
          <div className={`${color} text-white p-2 rounded-lg mr-3 flex items-center justify-center`}>
            <i className={`fas ${icon} text-base`}></i>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900" style={{ fontSize: "0.97rem" }}>{title}</h3>
            <p className="text-xs text-gray-600 mt-1" style={{ fontSize: "0.90rem" }}>{message}</p>
            <span className="text-xs text-gray-500 mt-1 block" style={{ fontSize: "0.80rem" }}>{relativeTimeStr}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2 ml-4" >
          {/* Bouton marquer comme lu */}
          <button
            title="Mark as read"
            style={{
              background: "transparent",
              border: "none",
              color: "#28A6A7",
              cursor: "pointer",
              fontSize: "1.1rem",
            }}
            onClick={onMarkAsRead}
          >
            <FontAwesomeIcon icon={faCheck} />
          </button>
          <button
            title="Delete"
            style={{
              background: "transparent",
              border: "none",
              color: "red",
              cursor: "pointer",
              fontSize: "1.1rem",
            }}
            onClick={onDelete}
          >
            <FontAwesomeIcon icon={faTrashAlt} />
          </button>
        </div>
      </div>
      {!seen && (
        <span
          className="absolute top-3 right-3 bg-blue-500 rounded-full w-2 h-2"
          title="Non lu"
        />
      )}
    </div>
  );
}
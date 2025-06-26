import { useState, useRef, useEffect } from "react";
import { FaBell, FaCalendarAlt, FaUserCircle } from "react-icons/fa";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useNavigate } from 'react-router-dom';

export default function DashboardActionsBar({ userName }: { userName: string }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const navigate = useNavigate();
  const notifRef = useRef<HTMLDivElement>(null);
  const calRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target as Node) &&
        calRef.current &&
        !calRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
        setShowCalendar(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        background: "#fff",
        display: "flex",
        justifyContent: "flex-end",
        gap: "32px",
        alignItems: "center",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        padding: "0.5rem 2rem"
      }}
    >
      {/* Profil utilisateur */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginLeft: "24px" }}>
        <span style={{ fontWeight: 500, color: "#28a6a7" }}>{userName}</span>
        <FaUserCircle size={32} color="#28a6a7" />
      </div>
    </div>
  );
}
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
      {/* Icône Notification */}
      <div style={{ position: "relative" }} ref={notifRef}>
        <FaBell
          style={{ color: '#28A6A7', fontSize: "2.2rem", cursor: "pointer" }}
          onClick={() => {
            setShowNotifications((v) => !v);
            setShowCalendar(false);
          }}
        />
        {showNotifications && (
          <div
            style={{
              position: "absolute",
              right: 0,
              top: "120%",
              background: "#fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              borderRadius: "8px",
              minWidth: "260px",
              padding: "16px 0 0 0",
              zIndex: 10,
            }}
          >
            <div style={{ color: "#656ED3", fontWeight: "bold", padding: '0 16px 8px 16px' }}>
              Notifications (à personnaliser)
            </div>
            <div style={{ color: "#888", margin: "8px 0 16px 0", padding: '0 16px' }}>
              No notifications yet.
            </div>
          </div>
        )}
      </div>
      {/* Icône Calendrier */}
      <div style={{ position: "relative" }} ref={calRef}>
        <FaCalendarAlt
          style={{ color: "#28A6A7", fontSize: "2.2rem", cursor: "pointer" }}
          onClick={() => {
            setShowCalendar((v) => !v);
            setShowNotifications(false);
          }}
        />
        {showCalendar && (
          <div
            style={{
              position: "absolute",
              right: 0,
              top: "20%",
              background: "#fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              borderRadius: "8px",
              zIndex: 10,
              padding: 0,
              minWidth: "unset",
              margin: 0
            }}
          >
            <div style={{ margin: 0, padding: 0 }}>
              <Calendar
                locale="en-US"
                onChange={() => {}}
                value={new Date()}
                showNeighboringMonth={false}
                prev2Label={null}
                next2Label={null}
              />
            </div>
          </div>
        )}
      </div>
      {/* Profil utilisateur */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginLeft: "24px" }}>
        <span style={{ fontWeight: 500, color: "#28a6a7" }}>{userName}</span>
        <FaUserCircle size={32} color="#28a6a7" />
      </div>
    </div>
  );
}
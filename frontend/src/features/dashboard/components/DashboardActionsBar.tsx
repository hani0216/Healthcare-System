import { useState, useRef, useEffect } from "react";
import { FaBell, FaCalendarAlt } from "react-icons/fa";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // à importer pour le style de base
import "../style/dashbord.css";
import '../../../index.css' // adapte le chemin si besoin

// Style local pour forcer le texte du calendrier en noir
const calendarStyle = `
  .react-calendar,
  .react-calendar *,
  .react-calendar button,
  .react-calendar abbr {
    color: #111 !important;
  }
`;

export default function DashboardActionsBar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

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
    <>
      <style>{calendarStyle}</style>
      <div
        style={{
          position: "absolute",
          top: "24px",
          right: "40px",
          display: "flex",
          gap: "32px",
          zIndex: 10,
        }}
      >
        {/* Icône Notification */}
        <div style={{ position: "relative" }} ref={notifRef}>
          <FaBell
            style={{ color: 'var(--primary-color)', fontSize: "1.8rem", cursor: "pointer" }}
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
                minWidth: "220px",
                padding: "16px",
                zIndex: 10,
              }}
            >
              <div style={{ color: "#656ED3", fontWeight: "bold" }}>
                Notifications
              </div>
              <div style={{ color: "#888", marginTop: "8px" }}>
                No notifications yet.
              </div>
            </div>
          )}
        </div>
        {/* Icône Calendrier */}
        <div style={{ position: "relative" }} ref={calRef}>
          <FaCalendarAlt
            style={{ color: "var(--primary-color)", fontSize: "1.8rem", cursor: "pointer" }}
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
              <div style={{   margin: 0, padding: 0 }}>
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
      </div>
    </>
  );  
}

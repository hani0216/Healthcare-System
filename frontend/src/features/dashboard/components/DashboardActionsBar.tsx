import { useState, useRef, useEffect } from "react";
import { FaBell, FaCalendarAlt, FaUserCircle } from "react-icons/fa";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../style/dashbord.css";
import '../../../index.css';
import { useNavigate } from 'react-router-dom';
import { fetchNotificationsByReceiverId, getDisplayableNotifications } from '../services/patientNotificationService';

// Style local pour forcer le texte du calendrier en noir
const calendarStyle = `
  .react-calendar,
  .react-calendar *,
  .react-calendar button,
  .react-calendar abbr {
    color: #111 !important;
  }
`;

export default function DashboardActionsBar({ userName }: { userName: string }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const navigate = useNavigate();

  const notifRef = useRef<HTMLDivElement>(null);
  const calRef = useRef<HTMLDivElement>(null);

  // Récupération régulière des notifications
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    let interval: NodeJS.Timeout;
    async function fetchNotifs() {
      if (userId) {
        try {
          const data = await fetchNotificationsByReceiverId(userId);
          setNotifications(getDisplayableNotifications(data));
        } catch {
          setNotifications([]);
        }
      }
    }
    fetchNotifs();
    interval = setInterval(fetchNotifs, 60000); // toutes les minutes
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter((n: any) => !n.seen).length;
  const last4 = notifications.slice(0, 4);

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
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute',
              top: 2,
              right: 2,
              width: 12,
              height: 12,
              background: 'red',
              borderRadius: '50%',
              display: 'block',
              border: '2px solid #fff',
              zIndex: 20
            }} />
          )}
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
                Notifications
              </div>
              {last4.length === 0 ? (
                <div style={{ color: "#888", margin: "8px 0 16px 0", padding: '0 16px' }}>
                  No notifications yet.
                </div>
              ) : (
                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                  {last4.map((notif: any, idx: number) => (
                    <li
                      key={idx}
                      style={{
                        padding: '10px 16px',
                        cursor: 'pointer',
                        background: notif.seen ? '#f9fafb' : '#e0f2fe',
                        borderBottom: idx !== last4.length - 1 ? '1px solid #f1f1f1' : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8
                      }}
                      onClick={() => navigate('/patientNotification')}
                    >
                      <span style={{
                        fontWeight: 600,
                        color: '#28A6A7',
                        fontSize: 14,
                        marginRight: 8
                      }}>{notif.notificationType || notif.type}</span>
                      <span style={{ fontSize: 14, color: '#222', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{notif.title}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
        {/* Icône Calendrier */}
        <div style={{ position: "relative" }} ref={calRef}>
          <FaCalendarAlt
            style={{ color: "#28A6A7", fontSize: "2.2rem", cursor: "pointer"  }}
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
    </>
  );
}

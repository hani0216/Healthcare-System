import React, { useEffect, useState } from "react";
import SideBar from "../components/sideBar";
import DashboardActionsBar from "../components/DashboardActionsBar";
import NotificationItem from "../../dashboard/components/NotificationItem";
import Seen from "../../../assets/seen.png";
import '../../dashboard/style/dash.css';
import { fetchNotificationsByReceiverId, getDisplayableNotifications, markNotificationAsSeen, deleteNotification } from "../services/insuranceService";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

export default function InsuranceNotification() {
  const userName = localStorage.getItem("userName") || "Insurance Admin";
  const userId = localStorage.getItem("userId");
  const [notifications, setNotifications] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    if (userId) {
      fetchNotificationsByReceiverId(userId)
        .then((data) => {
          setNotifications(getDisplayableNotifications(data));
        })
        .catch((err) => {
          setNotifications([]);
        });
    }
  }, [userId]);

  const unreadCount = notifications.filter(n => !n.seen).length;

  // Pagination logic
  const totalPages = Math.ceil(notifications.length / itemsPerPage);
  const paginatedNotifications = notifications.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // Rafraîchir les notifications
  const refreshNotifications = async () => {
    if (userId) {
      try {
        const data = await fetchNotificationsByReceiverId(userId);
        setNotifications(getDisplayableNotifications(data));
      } catch {
        setNotifications([]);
      }
    }
  };

  // Marquer une notification comme vue
  const handleMarkAsRead = async (notifId: string) => {
    try {
      await markNotificationAsSeen(notifId);
      refreshNotifications();
    } catch {
      toast.error('Error marking notification as read');
    }
  };

  // Supprimer une notification
  const handleDelete = async (notifId: string, frequency?: string) => {
    if (frequency && frequency !== 'Single') {
      toast.info("This is an important notification and can't be deleted !");
      return;
    }
    try {
      await deleteNotification(notifId);
      refreshNotifications();
    } catch {
      toast.error('Error deleting notification');
    }
  };

  // Tout marquer comme vu
  const handleMarkAllAsRead = async () => {
    const unread = notifications.filter(n => !n.seen);
    try {
      await Promise.all(unread.map((n) => markNotificationAsSeen(n.id)));
      refreshNotifications();
    } catch {
      toast.error('Error marking all as read');
    }
  };

  return (
    <div style={{ height: "auto", display: "flex" }}>
      <SideBar />
      <div style={{ flex: 1, background: "#f5f6fa", position: "relative", minHeight: "100vh" }}>
        <DashboardActionsBar userName={userName} />
        <div className="container mx-auto p-6 max-w-3xl" style={{ marginTop: "20px", width: "60%" }}>
          <div className="bg-white rounded-xl shadow-md overflow-hidden" >
            {/* Section header notifications */}
            <section className="notification-header-section" style={{ background: "linear-gradient(90deg, #28A6A7 0%, #38bdf8 100%)", borderRadius: '20px', height: '110px' }}>
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white"  >
                <div className="flex justify-between items-center"  >
                  <h2 className="text-2xl font-bold" style={{ margin: '26px', width: '1%' }}>Notifications</h2>
                  <p className="text-blue-100" style={{ marginLeft: '70vh', marginTop: '20px' }}>
                    {unreadCount > 0
                      ? `${unreadCount} new notifications`
                      : "No new notifications"}
                  </p>
                  <div className="relative" >
                    <button
                      className="rounded-full transition flex items-center justify-center"
                      style={{
                        width: 66,
                        height: 66,
                        background: "transparent",
                        padding: 0,
                        border: "none",
                        overflow: "hidden",
                      }}
                      onClick={handleMarkAllAsRead}
                    >
                      <img src={Seen} alt="Vu" style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                        borderRadius: "70%",
                        clipPath: "polygon(10% 0, 90% 0, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0 90%, 0 10%)",
                      }} />
                    </button>
                    {unreadCount > 0 && (
                      <span className="notification-badge bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center" >
                        {unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </section>
            {/* Section liste notifications */}
            <section className="notification-list-section divide-y divide-gray-100" style={{background:'#F5F6FA'}}>
              {paginatedNotifications.map((notif, idx) => (
                <NotificationItem
                  key={notif.id || idx}
                  notifId={notif.id}
                  title={notif.title}
                  message={notif.message}
                  seen={notif.seen}
                  time={notif.timeToSend || notif.time}
                  type={notif.notificationType || notif.type}
                  frequency={notif.frequency}
                  onMarkAsRead={handleMarkAsRead}
                  onDelete={handleDelete}
                />
              ))}
            </section>
            {/* Pagination */}
            <div
              className="px-6 py-3 flex justify-center items-center space-x-4"
              style={{ background:'#F5F6FA'}}
            >
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                style={{
                  minWidth: 100,
                  color: "#28A6A7",
                  border: "1px solid #28A6A7",
                  background: "transparent",
                  fontSize: "1rem",
                  fontWeight: 500,
                  padding: "6px 18px",
                  borderRadius: 6,
                  cursor: page === 1 ? "not-allowed" : "pointer",
                  opacity: page === 1 ? 0.5 : 1,
                  transition: "all 0.2s",
                }}
                onMouseOver={e => { if (page !== 1) (e.currentTarget.style.background = "#28A6A7", e.currentTarget.style.color = "#fff"); }}
                onMouseOut={e => { if (page !== 1) (e.currentTarget.style.background = "transparent", e.currentTarget.style.color = "#28A6A7"); }}
              >
                Précédent
              </button>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages || totalPages === 0}
                style={{
                  minWidth: 100,
                  color: "#28A6A7",
                  border: "1px solid #28A6A7",
                  background: "transparent",
                  fontSize: "1rem",
                  fontWeight: 500,
                  padding: "6px 18px",
                  borderRadius: 6,
                  cursor: (page === totalPages || totalPages === 0) ? "not-allowed" : "pointer",
                  opacity: (page === totalPages || totalPages === 0) ? 0.5 : 1,
                  transition: "all 0.2s",
                }}
                onMouseOver={e => { if (!(page === totalPages || totalPages === 0)) (e.currentTarget.style.background = "#28A6A7", e.currentTarget.style.color = "#fff"); }}
                onMouseOut={e => { if (!(page === totalPages || totalPages === 0)) (e.currentTarget.style.background = "transparent", e.currentTarget.style.color = "#28A6A7"); }}
              >
                Suivant
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
} 
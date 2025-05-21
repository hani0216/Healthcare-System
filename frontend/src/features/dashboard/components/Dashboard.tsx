import React from "react";

// Exemple de Header avec notifications et calendrier
function DashboardHeader() {
  return (
    <div
      style={{
        width: "100%",
        background: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: "1rem 2rem 0.5rem 2rem",
        boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
        minHeight: "64px",
        gap: "1.5rem",
      }}
    >
      {/* Notification Icon */}
      <button
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "1.4rem",
          color: "#2563eb",
        }}
        title="Notifications"
      >
        <i className="fas fa-bell"></i>
      </button>
      {/* Calendar Icon */}
      <button
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "1.4rem",
          color: "#2563eb",
        }}
        title="Calendar"
      >
        <i className="fas fa-calendar-alt"></i>
      </button>
    </div>
  );
}

export default function Dashboard() {
  const userName = localStorage.getItem("userName") || "Patient";

  return (
    <div>
      <DashboardHeader />

      {/* Welcome Banner */}
      <div
        style={{
          background: "#57c1a5",
          borderRadius: "1rem",
          padding: "2rem 2.5rem",
          color: "#fff",
          margin: "2rem 2rem 1.5rem 2rem",
          boxShadow: "0 4px 24px 0 rgba(59,130,246,0.10)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "2rem",
          }}
        >
          <div>
            <h2 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
              Welcome back, {userName}!
            </h2>
              <p style={{ opacity: 0.9 }}>
        Stay updated. Access your health records anytime, anywhere, and take charge of your care effortlessly.
        </p>
          </div>
          <button
            style={{
                color: "#fff",
              backgroundColor: "var(--primary-color)", // Utilisation de la couleur principale pour le texte
              padding: "0.5rem 1.5rem",
              borderRadius: "0.5rem",
              fontWeight: 500,
              border: "none",
              cursor: "pointer",
              transition: "background 0.2s",
              boxShadow: "0 2px 8px rgba(37,99,235,0.08)",
              whiteSpace: "nowrap",
            }}
          >
            <i className="fas fa-calendar-plus" style={{ marginRight: 8 }}></i>
            Book an appointment
          </button>
        </div>
      </div>

      {/* Stats Cards Section */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "1.5rem",
          margin: "0 2rem 2rem 2rem",
        }}
      >
        {/* Next Appointment */}
        <div style={{
          background: "#fff",
          borderRadius: "1rem",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          padding: "1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div>
            <p style={{ color: "#6b7280", fontSize: "0.95rem" }}>Next Appointment</p>
            <h3 style={{ fontSize: "1.3rem", fontWeight: "bold", marginTop: 6 }}>June 15, 2023</h3>
            <p style={{ color: "#6b7280", fontSize: "0.95rem", marginTop: 6 }}>10:30 AM - Dr. Smith</p>
          </div>
          <div style={{
            background: "#dbeafe",
            padding: "0.75rem",
            borderRadius: "9999px"
          }}>
            <i className="fas fa-calendar-day" style={{ color: "#2563eb", fontSize: "1.4rem" }}></i>
          </div>
        </div>

        {/* Current Medications */}
        <div style={{
          background: "#fff",
          borderRadius: "1rem",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          padding: "1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div>
            <p style={{ color: "#6b7280", fontSize: "0.95rem" }}>Current Medications</p>
            <h3 style={{ fontSize: "1.3rem", fontWeight: "bold", marginTop: 6 }}>3</h3>
            <p style={{ color: "#6b7280", fontSize: "0.95rem", marginTop: 6 }}>1 to take today</p>
          </div>
          <div style={{
            background: "#d1fae5",
            padding: "0.75rem",
            borderRadius: "9999px"
          }}>
            <i className="fas fa-pills" style={{ color: "#059669", fontSize: "1.4rem" }}></i>
          </div>
        </div>

        {/* Heart Rate */}
        <div style={{
          background: "#fff",
          borderRadius: "1rem",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          padding: "1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div>
            <p style={{ color: "#6b7280", fontSize: "0.95rem" }}>Heart Rate</p>
            <h3 style={{ fontSize: "1.3rem", fontWeight: "bold", marginTop: 6 }}>
              72 <span style={{ fontSize: "1rem", fontWeight: "normal" }}>bpm</span>
            </h3>
            <p style={{ color: "#6b7280", fontSize: "0.95rem", marginTop: 6 }}>Normal</p>
          </div>
          <div style={{
            background: "#fee2e2",
            padding: "0.75rem",
            borderRadius: "9999px"
          }}>
            <i className="fas fa-heart" style={{ color: "#ef4444", fontSize: "1.4rem" }}></i>
          </div>
        </div>

        {/* Unread Messages */}
        <div style={{
          background: "#fff",
          borderRadius: "1rem",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          padding: "1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div>
            <p style={{ color: "#6b7280", fontSize: "0.95rem" }}>Unread Messages</p>
            <h3 style={{ fontSize: "1.3rem", fontWeight: "bold", marginTop: 6 }}>5</h3>
            <p style={{ color: "#6b7280", fontSize: "0.95rem", marginTop: 6 }}>2 urgent</p>
          </div>
          <div style={{
            background: "#ede9fe",
            padding: "0.75rem",
            borderRadius: "9999px"
          }}>
            <i className="fas fa-comment-medical" style={{ color: "#7c3aed", fontSize: "1.4rem" }}></i>
          </div>
        </div>
      </div>
    </div>
  );
}
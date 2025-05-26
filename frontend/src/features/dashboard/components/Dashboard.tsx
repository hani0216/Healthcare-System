import React, { useState, useEffect } from "react";
import '../style/dash.css';
import bannerImg from '../../../assets/banner3.svg';
import cardioImg from '../../../assets/vectors/bone.svg';
import dermatoImg from '../../../assets/vectors/emergency.svg';
import pediatryImg from '../../../assets/vectors/kidney.svg';
import orthoImg from '../../../assets/vectors/liver.svg';
import HealthTip from "./HealthTip";  
import { getAppointments, getNextAppointment } from "../services/appointmentService";
import appointmentImg from '../../../assets/appointment.png';
import DashboardActionBar from "./DashboardActionsBar";

export default function Dashboard({ sidebarCollapsed = true }) {
  const userName = localStorage.getItem("userName") || "Patient";
  const firstName = userName.split(" ")[0];
  const specialists = [
    { img: cardioImg, title: "Cardiology" },
    { img: dermatoImg, title: "Dermatology" },
    { img: pediatryImg, title: "Pediatrics" },
    { img: orthoImg, title: "Orthopedics" },
  ];

  const specificId = localStorage.getItem("specificId"); 
  const [nextAppointment, setNextAppointment] = useState(null);

  useEffect(() => {
    if (specificId) {
      getAppointments(specificId)
        .then(list => {
          const next = getNextAppointment(list);
          setNextAppointment(next);
        })
        .catch(() => setNextAppointment(null));
    }
  }, [specificId]);

  function formatDate(dateStr: string) {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

    


  return (
    <div>
      <DashboardActionBar userName={userName} />

      {/* Welcome Banner + Specialists section */}
      <div
        className={
          sidebarCollapsed
            ? "bannerContainer"
            : "bannerContainerColumn"
        }
      >
        {/* Welcome Banner */}
        <div
          className="welcomeBanner"
          style={{ backgroundImage: `url(${bannerImg})`, width: sidebarCollapsed ? "50%" : "100%" }}
        >
          <div className="welcomeContent">
            <h2 className="welcomeTitle">
              Welcome back, {firstName}!
            </h2>
            <p className="welcomeText">
              Stay updated. Access your health records anytime, anywhere, and take charge of your care effortlessly.
            </p>
            <button className="bookBtn">
              <i className="fas fa-calendar-plus" style={{ marginRight: 8 }}></i>
              Book an appointment
            </button>
          </div>
        </div>

        {/* Specialists section */}
        <div
          className={
            "specialistsSection" +
            (!sidebarCollapsed ? " specialistsSectionMargin" : "")
          }
        >
          <h3 className="specialistsTitle">Our Specialists</h3>
          <div className="specialistsList">
            {specialists.map((spec, idx) => (
              <div key={idx} className="specialistCard">
                <img
                  src={spec.img}
                  alt={spec.title}
                  className="specialistImg"
                />
                <span className="specialistLabel">{spec.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Cards Section */}
      <div className="statsGrid">
        {/* Next Appointment */}
        <div className="statsCard">
          <div>
            <p className="statsCardTitle">Next Appointment</p>
            <h3 className="statsCardValue">
              {nextAppointment ? formatDate(nextAppointment.date) : "No upcoming"}
            </h3>            
            <p className="statsCardSub">
              {nextAppointment ? nextAppointment.title : ""}
            </p>
          </div>
          <div className="statsCardIconBlue">
            <img
              src={appointmentImg}
              alt="Next Appointment"
              style={{ width: "2rem", height: "2rem", display: "block" }}
            />
          </div>
        </div>

        {/* Current Medications */}
        <div className="statsCard">
          <div>
            <p className="statsCardTitle">Current Medications</p>
            <h3 className="statsCardValue">3</h3>
            <p className="statsCardSub">1 to take today</p>
          </div>
          <div className="statsCardIconGreen">
            <i className="fas fa-pills" style={{ color: "#059669", fontSize: "1.4rem" }}></i>
          </div>
        </div>

        {/* Heart Rate */}
        <div className="statsCard">
          <div>
            <p className="statsCardTitle">Heart Rate</p>
            <h3 className="statsCardValue">
              72 <span style={{ fontSize: "1rem", fontWeight: "normal" }}>bpm</span>
            </h3>
            <p className="statsCardSub">Normal</p>
          </div>
          <div className="statsCardIconRed">
            <i className="fas fa-heart" style={{ color: "#ef4444", fontSize: "1.4rem" }}></i>
          </div>
        </div>

        {/* Unread Messages */}
        <div className="statsCard">
          <div>
            <p className="statsCardTitle">Unread Messages</p>
            <h3 className="statsCardValue">5</h3>
            <p className="statsCardSub">2 urgent</p>
          </div>
          <div className="statsCardIconPurple">
            <i className="fas fa-comment-medical" style={{ color: "#7c3aed", fontSize: "1.4rem" }}></i>
          </div>
        </div>
      </div>

      {/* Health Tips Section */}
      <div className="healthTipsContainer" style={{ background: "#E1F8F8", margin: '25px 40px', borderRadius: "1rem", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", padding: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
          <h3 style={{ fontSize: "1.125rem", fontWeight: 600 }}>Health Tips</h3>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
          <HealthTip
            title="Activité physique"
            paragraph="Essayez de bouger régulièrement chaque jour pour améliorer votre santé cardiovasculaire."
            iconBg="#eff6ff"
          />
          <HealthTip
            title="Nutrition"
            paragraph="Privilégiez une alimentation variée et équilibrée, riche en fruits et légumes."
            iconBg="#ecfdf5"
          />
          <HealthTip
            title="Sommeil"
            paragraph="Un sommeil de qualité favorise la récupération et le bien-être général."
            iconBg="#f5f3ff"
          />
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import '../style/dash.css';
import bannerImg from '../../../assets/banner3.svg';
import cardioImg from '../../../assets/vectors/bone.svg';
import dermatoImg from '../../../assets/vectors/emergency.svg';
import pediatryImg from '../../../assets/vectors/kidney.svg';
import orthoImg from '../../../assets/vectors/liver.svg';
import HealthTip from "./HealthTip";  
import { getAppointments, getNextAppointment, fetchMedicalRecord } from "../services/appointmentService";
import appointmentImg from '../../../assets/appointment.png';
import DashboardActionBar from "./DashboardActionsBar";
import { fetchNotificationsByReceiverId, getDisplayableNotifications } from '../services/patientNotificationService';
import notifImg from '../../../assets/notif.png'
import { useNavigate } from 'react-router-dom';
import { fetchInvoicesByMedicalRecordId, fetchReimbursementByInvoiceId } from '../services/medicalRecordService';
import invoiceImg from '../../../assets/invoice.png';
import messageImg from '../../../assets/message.png';

interface Appointment {
  id: number;
  date: string;
  title: string;
  status: string;
  type: string;
}

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
  const [nextAppointment, setNextAppointment] = useState<Appointment | null>(null);
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);
  const [approvedReimbursements, setApprovedReimbursements] = useState(0);
  const navigate = useNavigate();

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

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    let interval: NodeJS.Timeout;
    async function fetchNotifs() {
      if (userId) {
        try {
          const data = await fetchNotificationsByReceiverId(userId);
          const notifs = getDisplayableNotifications(data);
          setUnreadNotifCount(notifs.filter((n: any) => !n.seen).length);
        } catch {
          setUnreadNotifCount(0);
        }
      }
    }
    fetchNotifs();
    interval = setInterval(fetchNotifs, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function fetchApprovedReimbursements() {
      try {
        const specificId = localStorage.getItem('specificId');
        if (!specificId) return;
        const mr = await fetchMedicalRecord(specificId);
        if (!mr?.id) return;
        const invoices = await fetchInvoicesByMedicalRecordId(mr.id.toString());
        let count = 0;
        for (const inv of invoices) {
          const reimbursements = await fetchReimbursementByInvoiceId(inv.id.toString());
          if (Array.isArray(reimbursements) && reimbursements.some(r => r.status === 'APPROVED')) {
            count++;
          }
        }
        setApprovedReimbursements(count);
      } catch {
        setApprovedReimbursements(0);
      }
    }
    fetchApprovedReimbursements();
  }, []);

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
            <button className="bookBtn" onClick={() => navigate('/search')}>
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

        {/* Notifications non lues */}
        <div className="statsCard">
          <div>
            <p className="statsCardTitle">Unread Notifications</p>
            <h3 className="statsCardValue">{unreadNotifCount}</h3>
            <p className="statsCardSub">Stay up to date</p>
          </div>
          <img
              src={notifImg}
              alt="Next Appointment"
              style={{ width: "2rem", height: "2rem", display: "block" }}
            />
        </div>

        {/* Approved Reimbursements */}
        <div className="statsCard">
          <div>
            <p className="statsCardTitle">Approved Reimbursements</p>
            <h3 className="statsCardValue">{approvedReimbursements}</h3>
            <p className="statsCardSub">Total approved</p>
          </div>
          <div className="statsCardIconRed">
            <img
              src={invoiceImg}
              alt="Approved Reimbursements"
              style={{ width: "2rem", height: "2rem", display: "block" }}
            />
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
            <img
              src={messageImg}
              alt="Unread Messages"
              style={{ width: "2rem", height: "2rem", display: "block" }}
            />
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

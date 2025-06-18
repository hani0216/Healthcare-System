import React, { useEffect, useState } from "react";
import SideBar from "../components/sideBar";
import DashboardActionsBar from "../components/DashboardActionsBar";
import MessageItem from "../components/MessageItem";
import { fetchReceivedMessages, fetchDoctorName } from "../services/insuranceService";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function InsuranceHome() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [doctorNames, setDoctorNames] = useState<Record<number, string>>({});

  useEffect(() => {
    const loadMessages = async () => {
      try {
        setLoading(true);
        const specificId = localStorage.getItem("specificId");
        if (!specificId) {
          throw new Error("No specific ID found");
        }

        const receivedMessages = await fetchReceivedMessages(parseInt(specificId));
        setMessages(receivedMessages);

        // Récupérer les noms des médecins expéditeurs
        const uniqueDoctorIds = Array.from(new Set(receivedMessages.map((msg: any) => msg.senderId)));
        const doctorNamesMap: Record<number, string> = {};
        
        for (const doctorId of uniqueDoctorIds) {
          try {
            const doctorName = await fetchDoctorName(doctorId);
            doctorNamesMap[doctorId] = doctorName;
          } catch (error) {
            console.error(`Error fetching doctor name for ID ${doctorId}:`, error);
            doctorNamesMap[doctorId] = "Unknown Doctor";
          }
        }
        
        setDoctorNames(doctorNamesMap);
      } catch (error) {
        console.error("Error loading messages:", error);
        setError(error instanceof Error ? error.message : "Failed to load messages");
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div style={{ height: "auto", display: "flex" }}>
      <SideBar />
      <div style={{ flex: 1, background: "#f5f6fa", position: "relative", minHeight: "100vh" }}>
        <DashboardActionsBar userName={localStorage.getItem("userName") || "Insurance Admin"} />
        <ToastContainer position="top-center" autoClose={2000} />
        
        <div className="container mx-auto p-6 max-w-6xl" style={{ marginTop: "20px" }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 className="text-2xl font-bold" style={{ color: '#28A6A7' }}>Received Messages</h2>
            <button
              onClick={handleRefresh}
              style={{
                background: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: 8,
                padding: "8px 16px",
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              Refresh
            </button>
          </div>

          {loading && (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div>Loading messages...</div>
            </div>
          )}

          {error && (
            <div style={{ 
              background: '#fee2e2', 
              color: '#dc2626', 
              padding: '1rem', 
              borderRadius: '0.5rem', 
              marginBottom: '1rem' 
            }}>
              {error}
            </div>
          )}

          {!loading && !error && messages.length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              padding: '2rem', 
              color: '#64748b',
              background: 'white',
              borderRadius: '0.5rem',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>
              No messages received yet.
            </div>
          )}

          {!loading && !error && messages.length > 0 && (
            <div className="flex flex-col gap-4">
              {messages.map((message) => (
                <MessageItem
                  key={message.id}
                  id={message.id}
                  senderId={message.senderId}
                  receiverId={message.receiverId}
                  description={message.description}
                  resourceType={message.resourceType}
                  resourceId={message.resourceId}
                  date={message.date}
                  senderName={doctorNames[message.senderId]}
                  onUpdate={handleRefresh}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
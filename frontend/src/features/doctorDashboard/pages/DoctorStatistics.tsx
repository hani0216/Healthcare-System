import React, { useEffect, useState } from 'react';
import SideBar from '../components/sideBar';
import DashboardActionsBar from '../components/DashboardActionsBar';
import { fetchAllPatients } from '../services/patientService';
import { fetchReceivedMessages } from '../services/messagesService';

export default function DoctorStatistics() {
  const userName = localStorage.getItem('userName') || 'Doctor';
  const [patients, setPatients] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [patientsData, messagesData] = await Promise.all([
          fetchAllPatients(),
          fetchReceivedMessages(Number(localStorage.getItem("specificId")))
        ]);
        setPatients(patientsData);
        setMessages(messagesData);
      } catch (error) {
        console.error('Error loading statistics:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Calculs des statistiques
  const totalPatients = patients.length;
  const totalMessages = messages.length;
  const unreadMessages = messages.filter(msg => !msg.seen).length;
  const readMessages = messages.filter(msg => msg.seen).length;
  const documentMessages = messages.filter(msg => msg.resourceType === 'DOCUMENT').length;

  // Statistiques par mois (exemple)
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const messagesThisMonth = messages.filter(msg => {
    const msgDate = new Date(msg.sendingDate);
    return msgDate.getMonth() === currentMonth && msgDate.getFullYear() === currentYear;
  }).length;

  const StatCard = ({ title, value, subtitle, color }: { title: string; value: number; subtitle?: string; color: string }) => (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      flex: 1,
      minWidth: '200px'
    }}>
      <div style={{ color: '#6b7280', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
        {title}
      </div>
      <div style={{ fontSize: '32px', fontWeight: 'bold', color: color, marginBottom: '4px' }}>
        {value}
      </div>
      {subtitle && (
        <div style={{ color: '#9ca3af', fontSize: '12px' }}>
          {subtitle}
        </div>
      )}
    </div>
  );

  const ChartCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      marginTop: '24px'
    }}>
      <h3 style={{ margin: '0 0 20px 0', color: '#1f2937', fontSize: '18px', fontWeight: '600' }}>
        {title}
      </h3>
      {children}
    </div>
  );

  if (loading) {
    return (
      <div style={{ height: 'auto', display: 'flex' }}>
        <SideBar />
        <div style={{ flex: 1, background: '#f5f6fa', position: 'relative', minHeight: '100vh' }}>
          <DashboardActionsBar userName={userName} />
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <div style={{ color: '#6b7280', fontSize: '18px' }}>Loading statistics...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: 'auto', display: 'flex' }}>
      <SideBar />
      <div style={{ flex: 1, background: '#f5f6fa', position: 'relative', minHeight: '100vh' }}>
        <DashboardActionsBar userName={userName} />
        <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ 
            color: '#1f2937', 
            fontSize: '28px', 
            fontWeight: 'bold', 
            marginBottom: '32px',
            textAlign: 'center'
          }}>
            Dashboard Statistics
          </h1>

          {/* Cartes de statistiques principales */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '24px',
            marginBottom: '32px'
          }}>
            <StatCard 
              title="Total Patients" 
              value={totalPatients} 
              subtitle="Registered patients"
              color="#28a6a7"
            />
            <StatCard 
              title="Total Messages" 
              value={totalMessages} 
              subtitle="Received messages"
              color="#2563eb"
            />
            <StatCard 
              title="Unread Messages" 
              value={unreadMessages} 
              subtitle="Pending review"
              color="#dc2626"
            />
            <StatCard 
              title="Documents Shared" 
              value={documentMessages} 
              subtitle="Document messages"
              color="#059669"
            />
          </div>

          {/* Graphiques et visualisations */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
            {/* Messages par statut */}
            <ChartCard title="Message Status Distribution">
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Read</span>
                    <span style={{ fontSize: '14px', fontWeight: '600' }}>{readMessages}</span>
                  </div>
                  <div style={{ 
                    background: '#e5e7eb', 
                    height: '8px', 
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{ 
                      background: '#28a6a7', 
                      height: '100%', 
                      width: `${totalMessages > 0 ? (readMessages / totalMessages) * 100 : 0}%`
                    }} />
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '16px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Unread</span>
                    <span style={{ fontSize: '14px', fontWeight: '600' }}>{unreadMessages}</span>
                  </div>
                  <div style={{ 
                    background: '#e5e7eb', 
                    height: '8px', 
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{ 
                      background: '#dc2626', 
                      height: '100%', 
                      width: `${totalMessages > 0 ? (unreadMessages / totalMessages) * 100 : 0}%`
                    }} />
                  </div>
                </div>
              </div>
            </ChartCard>

            {/* Messages ce mois */}
            <ChartCard title="Messages This Month">
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#2563eb', marginBottom: '8px' }}>
                  {messagesThisMonth}
                </div>
                <div style={{ color: '#6b7280', fontSize: '14px' }}>
                  Messages received in {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </div>
              </div>
            </ChartCard>
          </div>

          {/* Tableau des derniers messages */}
          <ChartCard title="Recent Messages">
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {messages.slice(0, 10).map((msg, index) => (
                <div key={msg.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 0',
                  borderBottom: index < 9 ? '1px solid #e5e7eb' : 'none'
                }}>
                  <div>
                    <div style={{ fontWeight: '500', color: '#1f2937' }}>
                      {msg.senderName || `Sender ${msg.senderId}`}
                    </div>
                    <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
                      {msg.description.substring(0, 50)}...
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                      {new Date(msg.sendingDate).toLocaleDateString()}
                    </div>
                    <div style={{ 
                      fontSize: '10px', 
                      padding: '2px 6px', 
                      borderRadius: '4px',
                      background: msg.seen ? '#d1fae5' : '#fef3c7',
                      color: msg.seen ? '#065f46' : '#92400e',
                      marginTop: '4px'
                    }}>
                      {msg.seen ? 'Read' : 'Unread'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  );
} 
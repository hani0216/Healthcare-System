import React, { useEffect, useState } from 'react';
import SideBar from '../components/sideBar';
import DashboardActionsBar from '../components/DashboardActionsBar';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import invoiceImg from '../../../assets/invoice.png';
import messageImg from '../../../assets/message.png';
import { fetchReimbursementsByInsuredId } from '../services/insuranceService';

const COLORS = ['#28A6A7', '#fbbf24', '#ef4444'];

function getMonthName(date) {
  return date.toLocaleString('default', { month: 'short' });
}

export default function InsuranceStatistics() {
  const userName = localStorage.getItem('userName') || 'Insurance';
  const specificId = localStorage.getItem('specificId');

  // Données dynamiques
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [statusPie, setStatusPie] = useState([]);
  const [amountStats, setAmountStats] = useState([]);
  const [barStats, setBarStats] = useState([]);

  useEffect(() => {
    async function fetchStats() {
      if (!specificId) return;
      try {
        const reimbursements = await fetchReimbursementsByInsuredId(specificId);
        // Agrégation par mois et statut
        const monthMap = {};
        const statusMap = { Approved: 0, Processing: 0, Pending: 0, Rejected: 0 };
        reimbursements.forEach(r => {
          // Pour la courbe par mois/statut
          const date = r.createdAt ? new Date(r.createdAt) : new Date();
          const month = getMonthName(date);
          if (!monthMap[month]) monthMap[month] = { month, Approved: 0, Processing: 0, Pending: 0, Rejected: 0, amount: 0, total: 0 };
          const status = (r.status || '').charAt(0).toUpperCase() + (r.status || '').slice(1).toLowerCase();
          if (monthMap[month][status] !== undefined) monthMap[month][status]++;
          monthMap[month].amount += r.amount || 0;
          monthMap[month].total++;
          // Pour le pie chart
          if (statusMap[status] !== undefined) statusMap[status]++;
        });
        // Générer les datasets
        const months = Object.values(monthMap).sort((a, b) => new Date('2023 ' + a.month) - new Date('2023 ' + b.month));
        setMonthlyStats(months);
        setBarStats(months.map(m => ({ month: m.month, total: m.total })));
        setAmountStats(months.map(m => ({ month: m.month, amount: m.amount })));
        setStatusPie(Object.entries(statusMap).filter(([k, v]) => v > 0).map(([name, value]) => ({ name, value })));
      } catch {
        setMonthlyStats([]);
        setStatusPie([]);
        setAmountStats([]);
        setBarStats([]);
      }
    }
    fetchStats();
  }, [specificId]);

  return (
    <div style={{ height: 'auto', display: 'flex' }}>
      <SideBar />
      <div style={{ flex: 1, background: '#f5f6fa', position: 'relative', minHeight: '100vh' }}>
        <DashboardActionsBar userName={userName} />
        <div className="container mx-auto p-6 max-w-6xl" style={{ marginTop: '40px' }}>
          <h2 className="text-2xl font-bold mb-8 text-center" style={{ color: '#28A6A7' }}>Insurance Dashboard</h2>
          <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 40 }}>
            {/* Courbe du nombre de remboursements par statut par mois */}
            <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px #0001', padding: 24, minWidth: 400 }}>
              <h3 style={{ color: '#28A6A7', marginBottom: 16 }}>Reimbursements by Status (per month)</h3>
              <ResponsiveContainer width={400} height={220}>
                <LineChart data={monthlyStats} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="Approved" stroke="#28A6A7" strokeWidth={3} />
                  <Line type="monotone" dataKey="Processing" stroke="#fbbf24" strokeWidth={3} />
                  <Line type="monotone" dataKey="Pending" stroke="#8884d8" strokeWidth={3} />
                  <Line type="monotone" dataKey="Rejected" stroke="#ef4444" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            {/* Bar chart du nombre de remboursements par mois */}
            <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px #0001', padding: 24, minWidth: 400 }}>
              <h3 style={{ color: '#28A6A7', marginBottom: 16 }}>Total Reimbursements (per month)</h3>
              <ResponsiveContainer width={400} height={220}>
                <BarChart data={barStats} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total" fill="#28A6A7" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Pie chart des statuts */}
            <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px #0001', padding: 24, minWidth: 320 }}>
              <h3 style={{ color: '#28A6A7', marginBottom: 16 }}>Status Distribution</h3>
              <ResponsiveContainer width={320} height={220}>
                <PieChart>
                  <Pie data={statusPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {statusPie.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Montant total remboursé par mois */}
            <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px #0001', padding: 24, minWidth: 400 }}>
              <h3 style={{ color: '#28A6A7', marginBottom: 16 }}>Total Amount Reimbursed (per month)</h3>
              <ResponsiveContainer width={400} height={220}>
                <LineChart data={amountStats} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="amount" stroke="#ef4444" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
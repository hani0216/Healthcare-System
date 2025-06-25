import React, { useEffect, useState } from 'react';
import { Line, Pie, Bar, Doughnut } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend, BarElement } from 'chart.js';
// @ts-ignore
import Mermaid from 'react-mermaid2';
import { fetchAllUsers, fetchAllDoctors, fetchAllPatients, fetchAllInsuranceAdmins, fetchAllInvoices, fetchAllReimbursements } from './userService';
import { useNavigate } from 'react-router-dom';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend, BarElement);

const lineData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Patients per Month',
      data: [120, 150, 170, 140, 180, 200, 220, 210, 190, 230, 250, 270],
      fill: false,
      borderColor: '#2563eb',
      backgroundColor: '#2563eb',
      tension: 0.3,
    },
  ],
};

const mermaidDiagram = `graph TD;
  A[Patients] -->|Consultations| B(Doctors)
  B -->|Prescriptions| C[Pharmacy]
  B -->|Invoices| D[Insurance]
  D -->|Reimbursements| A
  A -->|Notifications| E[Notification System]
  B -->|Medical Records| F[Medical Records System]
  F -->|History| A
`;

const sectionCardStyle = {
  background: 'white',
  borderRadius: 12,
  boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
  padding: 24,
  marginBottom: 32,
  minWidth: 320,
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse' as const,
  marginTop: 12,
};
const thStyle = {
  background: '#f1f5f9',
  color: '#2563eb',
  fontWeight: 700,
  padding: '8px 12px',
  borderBottom: '1px solid #e5e7eb',
};
const tdStyle = {
  padding: '8px 12px',
  borderBottom: '1px solid #e5e7eb',
  color: '#334155',
};

const PAGE_SIZE = 10;

function getAge(birthDate: string) {
  if (!birthDate) return null;
  const birth = new Date(birthDate);
  if (isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [userStats, setUserStats] = useState({ doctors: 0, patients: 0, insuranceAdmins: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [insurances, setInsurances] = useState<any[]>([]);
  const [loadingEntities, setLoadingEntities] = useState(true);
  const [errorEntities, setErrorEntities] = useState<string | null>(null);
  const [activeList, setActiveList] = useState<'doctors' | 'patients' | 'insurances'>('doctors');
  const [currentPage, setCurrentPage] = useState(1);

  // Statistiques supplémentaires
  const [specialityStats, setSpecialityStats] = useState<{ [key: string]: number }>({});
  const [cityStats, setCityStats] = useState<{ [key: string]: number }>({});
  const [insuranceCompanyStats, setInsuranceCompanyStats] = useState<{ [key: string]: number }>({});
  // Nouveaux états pour invoices et reimbursements
  const [invoices, setInvoices] = useState<any[]>([]);
  const [reimbursements, setReimbursements] = useState<any[]>([]);
  const [loadingFinance, setLoadingFinance] = useState(true);
  const [errorFinance, setErrorFinance] = useState<string | null>(null);
  // Stats naissance
  const [ageStats, setAgeStats] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const users = await fetchAllUsers();
        let doctors = 0, patients = 0, insuranceAdmins = 0;
        users.forEach((u: any) => {
          if (u.role === 'DOCTOR') doctors++;
          else if (u.role === 'PATIENT') patients++;
          else if (u.role === 'INSURANCE_ADMIN') insuranceAdmins++;
        });
        setUserStats({
          doctors,
          patients,
          insuranceAdmins,
          total: users.length,
        });
      } catch (e) {
        setError('Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  useEffect(() => {
    const loadEntities = async () => {
      try {
        setLoadingEntities(true);
        setErrorEntities(null);
        const [doctorsRes, patientsRes, insurancesRes] = await Promise.all([
          fetchAllDoctors(),
          fetchAllPatients(),
          fetchAllInsuranceAdmins(),
        ]);
        setDoctors(doctorsRes);
        setPatients(patientsRes);
        setInsurances(insurancesRes);

        // Statistiques par spécialité
        const specialityCount: { [key: string]: number } = {};
        doctorsRes.forEach((doc: any) => {
          if (doc.speciality) {
            specialityCount[doc.speciality] = (specialityCount[doc.speciality] || 0) + 1;
          }
        });
        setSpecialityStats(specialityCount);

        // Statistiques par ville (patients)
        const cityCount: { [key: string]: number } = {};
        patientsRes.forEach((pat: any) => {
          const city = pat.patientInfo?.address || 'Unknown';
          cityCount[city] = (cityCount[city] || 0) + 1;
        });
        setCityStats(cityCount);

        // Statistiques par compagnie d'assurance
        const insuranceCompanyCount: { [key: string]: number } = {};
        insurancesRes.forEach((adm: any) => {
          const company = adm.insuranceCompany || 'Unknown';
          insuranceCompanyCount[company] = (insuranceCompanyCount[company] || 0) + 1;
        });
        setInsuranceCompanyStats(insuranceCompanyCount);

        // Statistiques par tranche d'âge (patients)
        const ageCount: { [key: string]: number } = { '<20': 0, '20-29': 0, '30-39': 0, '40-49': 0, '50+': 0 };
        patientsRes.forEach((pat: any) => {
          const age = getAge(pat.birthDate);
          if (age === null) return;
          if (age < 20) ageCount['<20']++;
          else if (age < 30) ageCount['20-29']++;
          else if (age < 40) ageCount['30-39']++;
          else if (age < 50) ageCount['40-49']++;
          else ageCount['50+']++;
        });
        setAgeStats(ageCount);
      } catch (e) {
        setErrorEntities('Failed to load doctors/patients/insurances');
      } finally {
        setLoadingEntities(false);
      }
    };
    loadEntities();
  }, []);

  useEffect(() => {
    const loadFinance = async () => {
      try {
        setLoadingFinance(true);
        setErrorFinance(null);
        const [invoicesRes, reimbursementsRes] = await Promise.all([
          fetchAllInvoices(),
          fetchAllReimbursements(),
        ]);
        setInvoices(invoicesRes);
        setReimbursements(reimbursementsRes);
      } catch (e) {
        setErrorFinance('Failed to load invoices/reimbursements');
      } finally {
        setLoadingFinance(false);
      }
    };
    loadFinance();
  }, []);

  // Données pour les graphiques
  const pieData = {
    labels: ['Doctors', 'Patients', 'Insurance Admins'],
    datasets: [
      {
        label: 'User Roles',
        data: [userStats.doctors, userStats.patients, userStats.insuranceAdmins],
        backgroundColor: [
          '#2563eb',
          '#22c55e',
          '#eab308',
        ],
        borderWidth: 1,
      },
    ],
  };

  const specialityPieData = {
    labels: Object.keys(specialityStats),
    datasets: [
      {
        label: 'Doctors by Speciality',
        data: Object.values(specialityStats),
        backgroundColor: [
          '#2563eb', '#22c55e', '#eab308', '#f59e42', '#a855f7', '#f43f5e', '#0ea5e9', '#fbbf24', '#14b8a6', '#6366f1', '#f472b6', '#84cc16', '#e11d48', '#7c3aed', '#facc15', '#10b981', '#f87171', '#818cf8', '#fcd34d', '#f472b6',
        ],
      },
    ],
  };

  const cityBarData = {
    labels: Object.keys(cityStats),
    datasets: [
      {
        label: 'Patients by City',
        data: Object.values(cityStats),
        backgroundColor: '#2563eb',
      },
    ],
  };

  const insuranceCompanyDoughnutData = {
    labels: Object.keys(insuranceCompanyStats),
    datasets: [
      {
        label: 'Insurance Admins by Company',
        data: Object.values(insuranceCompanyStats),
        backgroundColor: [
          '#2563eb', '#22c55e', '#eab308', '#f59e42', '#a855f7', '#f43f5e', '#0ea5e9', '#fbbf24', '#14b8a6', '#6366f1', '#f472b6', '#84cc16', '#e11d48', '#7c3aed', '#facc15', '#10b981', '#f87171', '#818cf8', '#fcd34d', '#f472b6',
        ],
      },
    ],
  };

  // Diagramme par tranche d'âge
  const ageBarData = {
    labels: Object.keys(ageStats),
    datasets: [
      {
        label: 'Patients by Age Group',
        data: Object.values(ageStats),
        backgroundColor: '#a855f7',
      },
    ],
  };

  // Invoices: nombre par mois (année en cours)
  const now = new Date();
  const currentYear = now.getFullYear();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const invoicesByMonth = Array(12).fill(0);
  let totalInvoiceAmount = 0;
  const invoiceStatusCount: { [key: string]: number } = {};
  invoices.forEach((inv) => {
    if (inv.amount) totalInvoiceAmount += inv.amount;
    if (inv.status) invoiceStatusCount[inv.status] = (invoiceStatusCount[inv.status] || 0) + 1;
    if (inv.invoiceDate) {
      const d = new Date(inv.invoiceDate);
      if (d.getFullYear() === currentYear) {
        invoicesByMonth[d.getMonth()]++;
      }
    }
  });
  const invoiceLineData = {
    labels: months,
    datasets: [
      {
        label: 'Invoices per Month',
        data: invoicesByMonth,
        borderColor: '#0ea5e9',
        backgroundColor: '#bae6fd',
        tension: 0.3,
      },
    ],
  };
  const invoiceStatusBarData = {
    labels: Object.keys(invoiceStatusCount),
    datasets: [
      {
        label: 'Invoices by Status',
        data: Object.values(invoiceStatusCount),
        backgroundColor: '#f59e42',
      },
    ],
  };
  // Reimbursements: total amount et par status
  let totalReimbursementAmount = 0;
  const reimbursementStatusCount: { [key: string]: number } = {};
  reimbursements.forEach((remb) => {
    if (remb.amount) totalReimbursementAmount += remb.amount;
    if (remb.status) reimbursementStatusCount[remb.status] = (reimbursementStatusCount[remb.status] || 0) + 1;
  });
  const reimbursementStatusBarData = {
    labels: Object.keys(reimbursementStatusCount),
    datasets: [
      {
        label: 'Reimbursements by Status',
        data: Object.values(reimbursementStatusCount),
        backgroundColor: '#22c55e',
      },
    ],
  };

  // Pagination helpers
  const getActiveList = () => {
    if (activeList === 'doctors') return doctors;
    if (activeList === 'patients') return patients;
    return insurances;
  };
  const totalPages = Math.ceil(getActiveList().length / PAGE_SIZE);
  const paginatedList = getActiveList().slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Table columns by type
  const renderTableHeader = () => {
    if (activeList === 'doctors') {
      return (
        <tr>
          <th style={thStyle}>Name</th>
          <th style={thStyle}>Speciality</th>
          <th style={thStyle}>Email</th>
          <th style={thStyle}>Phone</th>
        </tr>
      );
    } else if (activeList === 'patients') {
      return (
        <tr>
          <th style={thStyle}>Name</th>
          <th style={thStyle}>Email</th>
          <th style={thStyle}>Phone</th>
          <th style={thStyle}>Birth Date</th>
          <th style={thStyle}>Insurance</th>
        </tr>
      );
    } else {
      return (
        <tr>
          <th style={thStyle}>Name</th>
          <th style={thStyle}>Email</th>
          <th style={thStyle}>Company</th>
        </tr>
      );
    }
  };

  const renderTableRow = (item: any) => {
    if (activeList === 'doctors') {
      return (
        <tr key={item.id}>
          <td style={tdStyle}>{item.doctorInfo?.name}</td>
          <td style={tdStyle}>{item.speciality}</td>
          <td style={tdStyle}>{item.doctorInfo?.email}</td>
          <td style={tdStyle}>{item.doctorInfo?.phone}</td>
        </tr>
      );
    } else if (activeList === 'patients') {
      return (
        <tr key={item.id}>
          <td style={tdStyle}>{item.patientInfo?.name}</td>
          <td style={tdStyle}>{item.patientInfo?.email}</td>
          <td style={tdStyle}>{item.patientInfo?.phone}</td>
          <td style={tdStyle}>{item.birthDate}</td>
          <td style={tdStyle}>{item.insurance}</td>
        </tr>
      );
    } else {
      return (
        <tr key={item.id}>
          <td style={tdStyle}>{item.userInfo?.name}</td>
          <td style={tdStyle}>{item.userInfo?.email}</td>
          <td style={tdStyle}>{item.insuranceCompany || '-'}</td>
        </tr>
      );
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f6fa', padding: '2rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 0 }}>
          <h1 style={{ color: '#2563eb', fontSize: '2.5rem', fontWeight: 700 }}>Admin Dashboard</h1>
          <button
            onClick={() => {
              localStorage.clear();
              navigate('/login');
            }}
            style={{
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              padding: '10px 28px',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
            }}
          >
            Logout
          </button>
        </div>
        <p style={{ color: '#64748b', fontSize: '1.2rem', marginTop: 8, marginBottom: 32 }}>
          Welcome, Admin! Here are some key statistics and system flows.
        </p>

        {/* Statistiques et diagrammes */}
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: 40 }}>
          <div style={{ flex: 1, ...sectionCardStyle, minWidth: 320 }}>
            <h2 style={{ color: '#2563eb', fontSize: '1.1rem', marginBottom: 16 }}>User Roles</h2>
            {loading ? (
              <div style={{ color: '#64748b', textAlign: 'center', margin: '2rem 0' }}>Loading...</div>
            ) : error ? (
              <div style={{ color: '#ef4444', textAlign: 'center', margin: '2rem 0' }}>{error}</div>
            ) : (
              <>
                <div style={{ textAlign: 'center', marginBottom: 12, color: '#2563eb', fontWeight: 600 }}>
                  Total users: {userStats.total}
                </div>
                <Pie data={pieData} />
                <div style={{ marginTop: 16, fontSize: '1rem', color: '#64748b', textAlign: 'center' }}>
                  <span style={{ marginRight: 12 }}>Doctors: <b>{userStats.doctors}</b></span>
                  <span style={{ marginRight: 12 }}>Patients: <b>{userStats.patients}</b></span>
                  <span>Insurance Admins: <b>{userStats.insuranceAdmins}</b></span>
                </div>
              </>
            )}
          </div>
          <div style={{ flex: 1, ...sectionCardStyle, minWidth: 320 }}>
            <h2 style={{ color: '#2563eb', fontSize: '1.1rem', marginBottom: 16 }}>Doctors by Speciality</h2>
            <Pie data={specialityPieData} />
          </div>
          <div style={{ flex: 1, ...sectionCardStyle, minWidth: 320 }}>
            <h2 style={{ color: '#2563eb', fontSize: '1.1rem', marginBottom: 16 }}>Patients by City</h2>
            <Bar data={cityBarData} options={{ plugins: { legend: { display: false } } }} />
          </div>
          <div style={{ flex: 1, ...sectionCardStyle, minWidth: 220, maxWidth: 220, padding: 12 }}>
            <h2 style={{ color: '#2563eb', fontSize: '1.1rem', marginBottom: 16 }}>Insurance Admins by Company</h2>
            <Doughnut data={insuranceCompanyDoughnutData} width={180} height={180} />
          </div>
          <div style={{ flex: 1, ...sectionCardStyle, minWidth: 320 }}>
            <h2 style={{ color: '#a855f7', fontSize: '1.1rem', marginBottom: 16 }}>Patients by Age Group</h2>
            <Bar data={ageBarData} options={{ plugins: { legend: { display: false } } }} />
          </div>
          {/* Invoices & Reimbursements */}
          <div style={{ flex: 2, ...sectionCardStyle, minWidth: 320 }}>
            <h2 style={{ color: '#0ea5e9', fontSize: '1.1rem', marginBottom: 16 }}>Invoices per Month ({currentYear})</h2>
            <Line data={invoiceLineData} />
            <div style={{ marginTop: 12, color: '#0ea5e9', fontWeight: 600 }}>Total Invoice Amount: {totalInvoiceAmount.toFixed(2)} €</div>
          </div>
          <div style={{ flex: 1, ...sectionCardStyle, minWidth: 320 }}>
            <h2 style={{ color: '#f59e42', fontSize: '1.1rem', marginBottom: 16 }}>Invoices by Status</h2>
            <Bar data={invoiceStatusBarData} options={{ plugins: { legend: { display: false } } }} />
          </div>
          <div style={{ flex: 2, ...sectionCardStyle, minWidth: 320 }}>
            <h2 style={{ color: '#22c55e', fontSize: '1.1rem', marginBottom: 16 }}>Reimbursements by Status</h2>
            <Bar data={reimbursementStatusBarData} options={{ plugins: { legend: { display: false } } }} />
            <div style={{ marginTop: 12, color: '#22c55e', fontWeight: 600 }}>Total Reimbursement Amount: {totalReimbursementAmount.toFixed(2)} €</div>
          </div>
        </div>

        {/* Diagramme de flux */}
        <div style={{ ...sectionCardStyle }}>
          <h2 style={{ color: '#2563eb', fontSize: '1.3rem', marginBottom: 16 }}>Patient Journey (Flow Diagram)</h2>
          <div style={{ background: '#f1f5f9', borderRadius: 8, padding: 16 }}>
            <Mermaid chart={`graph TD;\n  A[Patients] -->|Consultations| B(Doctors)\n  B -->|Prescriptions| C[Pharmacy]\n  B -->|Invoices| D[Insurance]\n  D -->|Reimbursements| A\n  A -->|Notifications| E[Notification System]\n  B -->|Medical Records| F[Medical Records System]\n  F -->|History| A\n`} />
          </div>
        </div>

        {/* Liste utilisateurs avec boutons et pagination */}
        <div style={{ ...sectionCardStyle }}>
          <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
            <button
              style={{
                background: activeList === 'doctors' ? '#2563eb' : '#f1f5f9',
                color: activeList === 'doctors' ? 'white' : '#2563eb',
                border: 'none',
                borderRadius: 6,
                padding: '8px 20px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
              onClick={() => { setActiveList('doctors'); setCurrentPage(1); }}
            >
              Doctors
            </button>
            <button
              style={{
                background: activeList === 'patients' ? '#2563eb' : '#f1f5f9',
                color: activeList === 'patients' ? 'white' : '#2563eb',
                border: 'none',
                borderRadius: 6,
                padding: '8px 20px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
              onClick={() => { setActiveList('patients'); setCurrentPage(1); }}
            >
              Patients
            </button>
            <button
              style={{
                background: activeList === 'insurances' ? '#2563eb' : '#f1f5f9',
                color: activeList === 'insurances' ? 'white' : '#2563eb',
                border: 'none',
                borderRadius: 6,
                padding: '8px 20px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
              onClick={() => { setActiveList('insurances'); setCurrentPage(1); }}
            >
              Insurance Admins
            </button>
          </div>
          {loadingEntities ? (
            <div style={{ color: '#64748b', textAlign: 'center', margin: '1rem 0' }}>Loading...</div>
          ) : errorEntities ? (
            <div style={{ color: '#ef4444', textAlign: 'center', margin: '1rem 0' }}>{errorEntities}</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={tableStyle}>
                <thead>{renderTableHeader()}</thead>
                <tbody>
                  {paginatedList.map(renderTableRow)}
                </tbody>
              </table>
              {/* Pagination */}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 16 }}>
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 6,
                    border: '1px solid #d1d5db',
                    background: currentPage === 1 ? '#f1f5f9' : 'white',
                    color: currentPage === 1 ? '#94a3b8' : '#2563eb',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    fontWeight: 600,
                  }}
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 6,
                      border: '1px solid #d1d5db',
                      background: currentPage === page ? '#2563eb' : 'white',
                      color: currentPage === page ? 'white' : '#2563eb',
                      cursor: 'pointer',
                      fontWeight: currentPage === page ? 700 : 400,
                    }}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 6,
                    border: '1px solid #d1d5db',
                    background: currentPage === totalPages ? '#f1f5f9' : 'white',
                    color: currentPage === totalPages ? '#94a3b8' : '#2563eb',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    fontWeight: 600,
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 
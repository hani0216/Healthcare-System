import React, { useEffect, useState } from "react";
import SideBar from "../components/sideBar";
import DashboardActionsBar from "../components/DashboardActionsBar";
import '../style/dash.css';
import { fetchMedicalRecord } from '../services/appointmentService';

// Mapping type -> message anglais
const historyMessages: Record<string, (log: any) => string> = {
  APPOINTMENT_UPDATE: log => `Your appointment was updated in your medical record at ${new Date(log.date).toLocaleString()}.`,
  MEDICAL_RECORD_UPDATE: log => `Your medical record was updated at ${new Date(log.date).toLocaleString()}.`,
  MAIN_NOTE_UPDATED: log => `A main note was updated in your medical record at ${new Date(log.date).toLocaleString()}.`,
  INVOICE_GENERATED: log => `An invoice was generated in your medical record at ${new Date(log.date).toLocaleString()}.`,
  DOCUMENT_UPLOADED: log => `A document was uploaded to your medical record at ${new Date(log.date).toLocaleString()}.`,
  DOCUMENT_DELETED: log => `A document was deleted from your medical record at ${new Date(log.date).toLocaleString()}.`,
  DOCUMENT_SHARED: log => `A document was shared from your medical record at ${new Date(log.date).toLocaleString()}.`,
  NOTE_CREATED: log => `A note was created in your medical record at ${new Date(log.date).toLocaleString()}.`,
  NOTE_DELETED: log => `A note was deleted from your medical record at ${new Date(log.date).toLocaleString()}.`,
  MEDICAL_RECORD_CREATED: log => `Your medical record was created at ${new Date(log.date).toLocaleString()}.`,
  MEDICAL_RECORD_DELETED: log => `Your medical record was deleted at ${new Date(log.date).toLocaleString()}.`,
  APPOINTMENT_ADDED: log => `An appointment was added to your medical record at ${new Date(log.date).toLocaleString()}.`,
  APPOINTMENT_DELETED: log => `An appointment was deleted from your medical record at ${new Date(log.date).toLocaleString()}.`,
  NOTE_UPDATED: log => `A note was updated in your medical record at ${new Date(log.date).toLocaleString()}.`,
  DOCUMENT_UPDATED: log => `A document was updated in your medical record at ${new Date(log.date).toLocaleString()}.`,
  APPOINTMENT_UPDATED: log => `An appointment was updated in your medical record at ${new Date(log.date).toLocaleString()}.`,
  NOTE_UPDATEDD: log => `A note was updated in your medical record at ${new Date(log.date).toLocaleString()}.`,
  DOCUMENT_NOTE_UPDATED: log => `A document note was updated in your medical record at ${new Date(log.date).toLocaleString()}.`,
  INVOICE_CREATED: log => `An invoice was created in your medical record at ${new Date(log.date).toLocaleString()}.`,
  INVOICE_UPDATED: log => `An invoice was updated in your medical record at ${new Date(log.date).toLocaleString()}.`,
  INVOICE_DELETED: log => `An invoice was deleted from your medical record at ${new Date(log.date).toLocaleString()}.`,
  INVOICE_PAID: log => `An invoice was paid in your medical record at ${new Date(log.date).toLocaleString()}.`,
  INVOICE_CANCELLED: log => `An invoice was cancelled in your medical record at ${new Date(log.date).toLocaleString()}.`,
  REIMBURSEMENT_UPDATED: log => `A reimbursement was updated in your medical record at ${new Date(log.date).toLocaleString()}.`,
  REIMBURSEMENT_GENERATED: log => `A reimbursement was generated in your medical record at ${new Date(log.date).toLocaleString()}.`,
  REIMBURSEMENT_DELETED: log => `A reimbursement was deleted from your medical record at ${new Date(log.date).toLocaleString()}.`,
};

export default function HistoryPage() {
  const userName = localStorage.getItem("userName") || "Patient";
  const [logs, setLogs] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 4;
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["NOTE", "DOCUMENT", "INVOICE"]);

  // Liste des types filtrables
  const FILTER_TYPES = [
    { label: "Note", value: "NOTE" },
    { label: "Document", value: "DOCUMENT" },
    { label: "Invoice", value: "INVOICE" },
  ];

  // Mapping des types d'historique vers les valeurs de filtre
  const typeMapping: Record<string, string> = {
    NOTE_CREATED: "NOTE",
    NOTE_DELETED: "NOTE",
    NOTE_UPDATED: "NOTE",
    NOTE_UPDATEDD: "NOTE",
    MAIN_NOTE_UPDATED: "NOTE",
    DOCUMENT_UPLOADED: "DOCUMENT",
    DOCUMENT_DELETED: "DOCUMENT",
    DOCUMENT_SHARED: "DOCUMENT",
    DOCUMENT_UPDATED: "DOCUMENT",
    DOCUMENT_NOTE_UPDATED: "DOCUMENT",
    INVOICE_GENERATED: "INVOICE",
    INVOICE_CREATED: "INVOICE",
    INVOICE_UPDATED: "INVOICE",
    INVOICE_DELETED: "INVOICE",
    INVOICE_PAID: "INVOICE",
    INVOICE_CANCELLED: "INVOICE",
    REIMBURSEMENT_UPDATED: "INVOICE",
    REIMBURSEMENT_GENERATED: "INVOICE",
    REIMBURSEMENT_DELETED: "INVOICE",
  };

  useEffect(() => {
    const specificId = localStorage.getItem("specificId");
    let interval: NodeJS.Timeout;
    async function fetchLogs() {
      if (specificId) {
        try {
          const record = await fetchMedicalRecord(specificId);
          setLogs((record.logs || []).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        } catch {
          setLogs([]);
        }
      }
    }
    fetchLogs();
    interval = setInterval(fetchLogs, 60000);
    return () => clearInterval(interval);
  }, []);

  // Filtrage des logs selon le type sélectionné
  const filteredLogs = logs.filter(log => selectedTypes.includes(typeMapping[log.historyType]));
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div style={{ height: "auto", display: "flex" }}>
      <SideBar />
      <div style={{ flex: 1, background: "#f5f6fa", position: "relative", minHeight: "100vh" }}>
        <DashboardActionsBar userName={userName} />
        <div className="container mx-auto p-6 max-w-3xl" style={{ marginTop: "20px", width: "60%" }}>
          <div className="bg-white rounded-xl shadow-md overflow-hidden" >
            <section className="notification-header-section" style={{ background: "linear-gradient(90deg, #28A6A7 0%, #38bdf8 100%)", borderRadius: '20px', height: '110px' }}>
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white"  >
                <div className="flex justify-between items-center"  >
                  <h2 className="text-2xl font-bold" style={{ margin: '26px', width: '1%' }}>History</h2>
                </div>
              </div>
            </section>
            {/* Filtre par type d'historique */}
            <div className="flex gap-4 justify-center items-center my-4">
              {FILTER_TYPES.map(type => (
                <label key={type.value} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(type.value)}
                    onChange={e => {
                      if (e.target.checked) {
                        setSelectedTypes([...selectedTypes, type.value]);
                      } else {
                        setSelectedTypes(selectedTypes.filter(t => t !== type.value));
                      }
                    }}
                  />
                  {type.label}
                </label>
              ))}
            </div>
            <section className="notification-list-section divide-y divide-gray-100" style={{background:'#F5F6FA'}}>
              {paginatedLogs.map((log, idx) => (
                <div key={log.id || idx} className="notification-item p-3 hover:bg-gray-50 relative rounded-xl shadow-sm mb-2 transition-all duration-300" style={{ backgroundColor: '#f8fafc', borderLeft: '4px solid #38bdf8' }}>
                  <div className="flex items-start">
                    <div className="bg-blue-500 text-white p-2 rounded-lg mr-3 flex items-center justify-center">
                      <i className="fas fa-history text-base"></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900" style={{ fontSize: "0.97rem" }}>{log.historyType.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (l: string) => l.toUpperCase())}</h3>
                      <p className="text-xs text-gray-600 mt-1" style={{ fontSize: "0.90rem" }}>{historyMessages[log.historyType]?.(log) || log.medicalRecord || ''}</p>
                      <span className="text-xs text-gray-500 mt-1 block" style={{ fontSize: "0.80rem" }}>{new Date(log.date).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </section>
            {/* Pagination */}
            <div className="px-6 py-3 flex justify-center items-center space-x-4" style={{ background:'#F5F6FA'}}>
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
    </div>
  );
} 
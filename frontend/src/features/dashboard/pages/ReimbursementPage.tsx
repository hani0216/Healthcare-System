import React, { useState, useEffect } from "react";
import SideBar from "../components/sideBar";
import DashboardActionsBar from "../components/DashboardActionsBar";
import '../style/dash.css';
import BillingItem from '../components/BillingItem';
import { fetchMedicalRecord } from '../services/appointmentService';
import { fetchInvoicesByMedicalRecordId, fetchDoctorName, fetchReimbursementByInvoiceId } from '../services/medicalRecordService';

export default function BillingPage() {
  const userName = localStorage.getItem("userName") || "Patient";
  const specificId = localStorage.getItem('specificId');
  const [medicalRecordId, setMedicalRecordId] = useState<string | null>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [doctorNames, setDoctorNames] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [invoicesPerPage] = useState(4); // 4 factures par page

  // Récupérer l'id du medical record
  useEffect(() => {
    async function fetchMrId() {
      if (!specificId) return;
      try {
        const mr = await fetchMedicalRecord(specificId);
        setMedicalRecordId(mr.id?.toString());
      } catch (e: any) {
        setError('Erreur lors de la récupération du dossier médical');
      }
    }
    fetchMrId();
  }, [specificId]);

  // Récupérer les factures et les noms des médecins
  useEffect(() => {
    async function fetchInvoices() {
      if (!medicalRecordId) return;
      setLoading(true);
      setError(null);
      try {
        const invs = await fetchInvoicesByMedicalRecordId(medicalRecordId);
        // Trier les factures par date de facture (du plus récent au plus ancien)
        const sortedInvs = invs.sort((a: any, b: any) => {
          const dateA = new Date(a.invoiceDate || 0);
          const dateB = new Date(b.invoiceDate || 0);
          return dateB.getTime() - dateA.getTime();
        });
        setInvoices(sortedInvs);
        // Récupérer les noms des médecins pour chaque facture
        const uniqueDoctorIds: number[] = Array.from(new Set(invs.map((inv: any) => inv.generatedBy)));
        const names: Record<number, string> = {};
        await Promise.all(uniqueDoctorIds.map(async (id) => {
          try {
            names[id] = await fetchDoctorName(id);
          } catch {
            names[id] = 'Unknown';
          }
        }));
        setDoctorNames(names);
      } catch (e: any) {
        setError(e.message || 'Erreur');
      } finally {
        setLoading(false);
      }
    }
    fetchInvoices();
  }, [medicalRecordId]);

  // Pagination logic
  const totalPages = Math.ceil(invoices.length / invoicesPerPage);
  const paginatedInvoices = invoices.slice((currentPage - 1) * invoicesPerPage, currentPage * invoicesPerPage);

  return (
    <div style={{ height: "auto", display: "flex" }}>
      <SideBar />
      <div style={{ flex: 1, background: "#f5f6fa", position: "relative", minHeight: "100vh" }}>
        <DashboardActionsBar userName={userName} />
        <div className="container mx-auto p-6 max-w-3xl" style={{ marginTop: "40px" , background: "#f5f6fa" , width:'60%'   }}>
          <div className=" rounded-xl shadow-md overflow-hidden p-8"  style={{background: "#f5f6fa"}}>
            <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: '#28A6A7' , background: "#f5f6fa"  }}>Invoices And Reimbursement</h2>
            {loading && <div>Loading invoices...</div>}
            {error && <div className="text-red-500">{error}</div>}
            <div style={{background: "#f5f6fa", borderRadius:'10%'}}>
              {paginatedInvoices.map(inv => (
                <BillingItem
                  key={inv.id}
                  date={inv.invoiceDate}
                  price={inv.amount}
                  description={inv.description}
                  doctorName={doctorNames[inv.generatedBy] || 'Unknown'}
                  invoiceId={inv.id}
                  fetchReimbursement={fetchReimbursementByInvoiceId}
                />
              ))}
            </div>
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4 mt-8">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  style={{
                    minWidth: 100,
                    color: "#28A6A7",
                    border: "1px solid #28A6A7",
                    background: "transparent",
                    fontSize: "1rem",
                    fontWeight: 500,
                    padding: "6px 18px",
                    borderRadius: 6,
                    cursor: currentPage === 1 ? "not-allowed" : "pointer",
                    opacity: currentPage === 1 ? 0.5 : 1,
                    transition: "all 0.2s",
                  }}
                  onMouseOver={e => { if (currentPage !== 1) (e.currentTarget.style.background = "#28A6A7", e.currentTarget.style.color = "#fff"); }}
                  onMouseOut={e => { if (currentPage !== 1) (e.currentTarget.style.background = "transparent", e.currentTarget.style.color = "#28A6A7"); }}
                >
                  Précédent
                </button>
                <span style={{ color: "#28A6A7", fontWeight: 500 }}>
                  Page {currentPage} sur {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages || totalPages === 0}
                  style={{
                    minWidth: 100,
                    color: "#28A6A7",
                    border: "1px solid #28A6A7",
                    background: "transparent",
                    fontSize: "1rem",
                    fontWeight: 500,
                    padding: "6px 18px",
                    borderRadius: 6,
                    cursor: (currentPage === totalPages || totalPages === 0) ? "not-allowed" : "pointer",
                    opacity: (currentPage === totalPages || totalPages === 0) ? 0.5 : 1,
                    transition: "all 0.2s",
                  }}
                  onMouseOver={e => { if (!(currentPage === totalPages || totalPages === 0)) (e.currentTarget.style.background = "#28A6A7", e.currentTarget.style.color = "#fff"); }}
                  onMouseOut={e => { if (!(currentPage === totalPages || totalPages === 0)) (e.currentTarget.style.background = "transparent", e.currentTarget.style.color = "#28A6A7"); }}
                >
                  Suivant
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 
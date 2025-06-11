import React, { useState, useEffect } from "react";
import SideBar from "../components/sideBar";
import DashboardActionsBar from "../components/DashboardActionsBar";
import '../style/dash.css';
import PDFViewer from '../components/PDFViewer';
import PdfCard from '../components/PdfCard';
import { fetchPatientDocuments, fetchDoctorName } from '../services/medicalRecordService';
import { fetchMedicalRecord } from '../services/appointmentService';
import { emphasize } from "@mui/material";

const dummyMedicalRecord = {
  id: 13,
  patientId: 40,
  note: { title: "General Checkup", description: "Patient in good health.", date: new Date().toLocaleDateString() },
  documents: [
    { id: 1, name: "Blood Test.pdf", date: new Date().toLocaleDateString(), url: "https://ec-bievres.ac-versailles.fr/IMG/pdf/test_pdf.pdf" },
    { id: 2, name: "X-Ray.pdf", date: new Date().toLocaleDateString(), url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
  ],
};

export default function MedicalRecordPage() {
  const userName = localStorage.getItem("userName") || "Patient";
  const [documents, setDocuments] = useState<any[]>([]);
  const [selectedPdfBytes, setSelectedPdfBytes] = useState<number[] | null>(null);
  const [selectedPdfBase64, setSelectedPdfBase64] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [medicalRecordId, setMedicalRecordId] = useState<string | null>(null);
  const specificId = localStorage.getItem('specificId');

  // Récupérer l'id du medical record au chargement
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

  // Récupérer les documents quand on a l'id du dossier
  useEffect(() => {
    async function fetchDocs() {
      if (!medicalRecordId) return;
      setLoading(true);
      setError(null);
      try {
        const docs = await fetchPatientDocuments(medicalRecordId);
        const docsWithCreator = await Promise.all(
          docs.map(async (doc: any) => {
            let creator = 'Unknown';
            try {
              creator = await fetchDoctorName(doc.note.authorId);
            } catch (e){
              // ignore
            }
            return {
              ...doc,
              creator,
            };
          })
        );
        setDocuments(docsWithCreator);
      } catch (e: any) {
        setError(e.message || 'Erreur');
      } finally {
        setLoading(false);
      }
    }
    fetchDocs();
  }, [medicalRecordId]);

  return (
    <div style={{ height: "auto", display: "flex" }}>
      <SideBar />
      <div style={{ flex: 1, background: "#f5f6fa", position: "relative", minHeight: "100vh" }}>
        <DashboardActionsBar userName={userName} />
        <div className="container mx-auto p-6 max-w-6xl flex gap-8" style={{ marginTop: "20px"  }}>
          {/* Liste des documents à gauche */}
          <div className="flex flex-col gap-4" style={{ width: '420px', minWidth: 320    }}>
            <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: '#28A6A7'  }}>My Medical Record</h2>
            <div className="mb-6" style={{  backgroundColor: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        transition: 'all 0.3s ease-in-out',
        cursor: 'pointer',
}}>
              <h3 className="text-lg font-semibold mb-2" style={{margin:'4vh' }}>Main Note</h3>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="font-semibold text-blue-700">{dummyMedicalRecord.note.title}</div>
                <div className="text-gray-500 mb-2">{dummyMedicalRecord.note.date}</div>
                <div>{dummyMedicalRecord.note.description}</div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Documents</h3>
              {loading && <div>Loading documents...</div>}
              {error && <div className="text-red-500">{error}</div>}
              <div className="flex flex-col gap-4">
                {documents.map(doc => (
                  <PdfCard
                    key={doc.id}
                    documentTitle={doc.name}
                    noteTitle={doc.note?.title || ''}
                    noteDescription={doc.note?.description || ''}
                    doctorId={doc.uploadedById}
                    contentUrl={doc.content?.[0] || ''}
                    creator={doc.creator}
                    creationDate={doc.creationDate}
                    onClick={() => {
                      if (Array.isArray(doc.content)) {
                        setSelectedPdfBytes(doc.content);
                        setSelectedPdfBase64(undefined);
                      } else if (typeof doc.content === "string") {
                        setSelectedPdfBase64(doc.content);
                        setSelectedPdfBytes(null);
                      }
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
          {/* PDF Viewer à droite */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {selectedPdfBytes && Array.isArray(selectedPdfBytes) && selectedPdfBytes.length > 0 ? (
              <PDFViewer bytes={selectedPdfBytes} onClose={() => setSelectedPdfBytes(null)} />
            ) : selectedPdfBase64 ? (
              <PDFViewer base64={selectedPdfBase64} onClose={() => setSelectedPdfBase64(undefined)} />
            ) : (
              <div style={{ textAlign: 'center', color: '#888', marginTop: 80 }}>Select document to view</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
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
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
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
                console.log("en train de recuperer")

        const docsWithCreator = await Promise.all(
          docs.map(async (doc: any) => {
            let creator = 'Unknown';
            try {
              creator = await fetchDoctorName(doc.note.authorId);
              console.log("rec")
              console.log(doc.note.authorId)
            } catch (e){
              console.log("erreur de recuperation" , e)
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
        <div className="container mx-auto p-6 max-w-3xl" style={{ marginTop: "20px"  }}>
          <div className=" rounded-xl shadow-md overflow-hidden p-8" style={{backgroundColor:'#f5f6fa' ,marginBottom:'12vh'}} >
            <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: '#28A6A7' }}>My Medical Record</h2>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Main Note</h3>
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
              <div className="flex flex-col gap-4"  style={{width:'70vh'}}>
                {documents.map(doc => (
                  <PdfCard
                    key={doc.id}
                    title={doc.note?.title || doc.name}
                    contentUrl={doc.content?.[0] || ''}
                    creator={doc.creator}
                    noteDescription={doc.note?.description || ''}
                    creationDate={doc.creationDate}
                    onClick={() => setSelectedPdf(doc.content?.[0] || '')}
                  />
                ))}
              </div>
              {selectedPdf && (
                <div className="mt-6">
                  <PDFViewer url={selectedPdf} onClose={() => setSelectedPdf(null)} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
import React, { useState } from "react";
import SideBar from "../components/sideBar";
import DashboardActionsBar from "../components/DashboardActionsBar";
import '../style/dash.css';
import PDFViewer from '../components/PDFViewer';

const dummyMedicalRecord = {
  id: 13,
  patientId: 40,
  note: { title: "General Checkup", description: "Patient in good health.", date: new Date().toLocaleDateString() },
  documents: [
    { id: 1, name: "Blood Test.pdf", date: new Date().toLocaleDateString(), url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
    { id: 2, name: "X-Ray.pdf", date: new Date().toLocaleDateString(), url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
  ],
};

export default function MedicalRecordPage() {
  const userName = localStorage.getItem("userName") || "Patient";
  const [record] = useState(dummyMedicalRecord);
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);

  return (
    <div style={{ height: "auto", display: "flex" }}>
      <SideBar />
      <div style={{ flex: 1, background: "#f5f6fa", position: "relative", minHeight: "100vh" }}>
        <DashboardActionsBar userName={userName} />
        <div className="container mx-auto p-6 max-w-3xl" style={{ marginTop: "20px" }}>
          <div className="bg-white rounded-xl shadow-md overflow-hidden p-8" >
            <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: '#28A6A7' }}>My Medical Record</h2>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Main Note</h3>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="font-semibold text-blue-700">{record.note.title}</div>
                <div className="text-gray-500 mb-2">{record.note.date}</div>
                <div>{record.note.description}</div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Documents</h3>
              <ul>
                {record.documents.map(doc => (
                  <li key={doc.id} className="mb-2 p-3 rounded-lg bg-blue-50 flex items-center gap-4">
                    <span className="font-semibold text-blue-700">{doc.name}</span>
                    <span className="text-gray-500">{doc.date}</span>
                    <button className="btn" style={{padding: '6px 16px', fontSize: 14}} onClick={() => setSelectedPdf(doc.url)}>View PDF</button>
                  </li>
                ))}
              </ul>
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
import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import SideBar from "../components/sideBar";
import DashboardActionsBar from "../components/DashboardActionsBar";
import PdfCard from "../components/PdfCard";
import PDFViewer from "../components/PDFViewer";
import InvoiceItem from "../components/InvoiceItem";
import { fetchMedicalRecord, fetchPatientDocuments, fetchDoctorName, fetchNoteIdFromMedicalRecord, updateMainNote, deleteDocument, addAppointment, createInvoice, fetchInvoices } from "../services/medicalRecordService";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPen, faUpload, faCheck, faCalendar, faFileInvoice } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Calendar as BigCalendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { format } from 'date-fns/format';
import { parse } from 'date-fns/parse';
import { startOfWeek } from 'date-fns/startOfWeek';
import { getDay } from 'date-fns/getDay';
import { enUS } from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getAppointments } from '../../dashboard/services/appointmentService';

// Déplacer la déclaration des variables de calendrier en dehors du composant
const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

export default function DoctorMedicalRecordPage() {
  const { patientId } = useParams();
  const location = useLocation();
  const userName = localStorage.getItem("userName") || "Doctor";
  const [medicalRecord, setMedicalRecord] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPdfBytes, setSelectedPdfBytes] = useState<number[] | null>(null);
  const [selectedPdfBase64, setSelectedPdfBase64] = useState<string | null>(null);
  const [selectedDocumentId, setSelectedDocumentId] = useState<number | null>(null); // AJOUT
  const [doctorName, setDoctorName] = useState<string>("");
  const [doctorNames, setDoctorNames] = useState<Record<number, string>>({});
  // States pour l'upload
  const [showUpload, setShowUpload] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadNote, setUploadNote] = useState("");
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [documentTitle, setDocumentTitle] = useState("");

  // Nouveaux états pour l'édition de note
  const [editNoteMode, setEditNoteMode] = useState(false);
  const [editNoteTitle, setEditNoteTitle] = useState("");
  const [editNoteDescription, setEditNoteDescription] = useState("");
  const [noteUpdateLoading, setNoteUpdateLoading] = useState(false);

  const [showUploadSection, setShowUploadSection] = useState(false);
  const [showAppointmentSection, setShowAppointmentSection] = useState(false);
  const [appointmentTitle, setAppointmentTitle] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentType, setAppointmentType] = useState("MEDICAL_APPOINTMENT");

  const [showInvoiceSection, setShowInvoiceSection] = useState(false);
  const [invoiceAmount, setInvoiceAmount] = useState("");
  const [invoiceDescription, setInvoiceDescription] = useState("");
  const [invoiceStatus, setInvoiceStatus] = useState("DRAFT");

  const [activeTab, setActiveTab] = useState<'documents' | 'invoices'>('documents');
  const [invoices, setInvoices] = useState<any[]>([]);
  const [invoicesLoading, setInvoicesLoading] = useState(false);
  const [invoicesError, setInvoicesError] = useState<string | null>(null);

  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    if (!patientId) return;
    setLoading(true);
    fetchMedicalRecord(patientId)
      .then((mr) => {
        console.log("Medical Record Data:", mr);  
        setMedicalRecord(mr);
        if (mr?.note?.authorId) {
          fetchDoctorName(mr.note.authorId)
            .then(setDoctorName)
            .catch(() => setDoctorName("Unknown"));
        }
        if (mr && mr.id) {
          return fetchPatientDocuments(mr.id);
        } else {
          throw new Error("Medical record not found");
        }
      })
      .then((docs) => {
        setDocuments(docs);
        const uniqueDoctorIds = Array.from(new Set(docs.map((doc: any) => doc.uploadedById))) as number[];
        uniqueDoctorIds.forEach((id: number) => {
          if (id && !doctorNames[id]) {
            fetchDoctorName(id)
              .then((name) => setDoctorNames(prev => ({ ...prev, [id]: name })))
              .catch(() => setDoctorNames(prev => ({ ...prev, [id]: "Unknown" })));
          }
        });
        // Ouvre le PDF si openDocumentId est dans l'URL
        const params = new URLSearchParams(location.search);
        const openDocId = params.get('openDocumentId');
        if (openDocId) {
          const doc = docs.find((d: any) => String(d.id) === String(openDocId));
          if (doc) {
            handlePdfClick(doc);
          }
        } else {
          // Ancienne logique par nom (si besoin)
          const docTitle = params.get('documentId');
          if (docTitle) {
            const doc = docs.find((d: any) => d.name === docTitle);
            if (doc) {
              handlePdfClick(doc);
            }
          }
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
    // eslint-disable-next-line
  }, [patientId, location.search]);

  // Synchronise les champs d'édition avec la note actuelle
  useEffect(() => {
    if (medicalRecord?.note) {
      setEditNoteTitle(medicalRecord.note.title || "");
      setEditNoteDescription(medicalRecord.note.description || "");
    }
  }, [medicalRecord?.note]);

  // Fonction pour valider la modification de la note principale
  const handleSubmitNoteUpdate = async () => {
    let timeoutTriggered = false;
    // Lance un timeout qui forcera le reload après 1 seconde
    const timeout = setTimeout(() => {
      timeoutTriggered = true;
      window.location.reload();
    }, 1000);

    try {
      setNoteUpdateLoading(true);
      const token = localStorage.getItem("accessToken") || "";
      const mrId = medicalRecord?.id?.toString();
      const specificId = localStorage.getItem("specificId") || "";
      if (!mrId || !specificId) throw new Error("Identifiants manquants");
      const noteId = await fetchNoteIdFromMedicalRecord(mrId, token);
      await updateMainNote(noteId, specificId, editNoteTitle, editNoteDescription, token);
      if (!timeoutTriggered) {
        clearTimeout(timeout);
        window.location.reload();
      }
    } catch (e: any) {
      // Ne rien afficher, pas d'alert ni de console.error
    } finally {
      setNoteUpdateLoading(false);
    }
  };
  

  // Nouvelle fonction d'upload adaptée à l'API demandée
  const handleUpload = async () => {
    let timeoutTriggered = false;
    // Timeout qui forcera le reload après 2 secondes
    const timeout = setTimeout(() => {
      timeoutTriggered = true;
      window.location.reload();
    }, 2000);

    if (!uploadFile || !medicalRecord?.id || !documentTitle) {
      setUploadError("Please select a PDF file and enter a document title.");
      clearTimeout(timeout);
      return;
    }
    setUploadLoading(true);
    setUploadError(null);
    try {
      const arrayBuffer = await uploadFile.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const specificId = localStorage.getItem("specificId");

      const payload = {
        content: Array.from(uint8Array),
        name: documentTitle,
        uploadedById: specificId ? parseInt(specificId) : 0,
      };
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`http://localhost:8088/medical-records/${medicalRecord.id}/addDocument`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        // Essayer de lire le message d'erreur retourné par l'API
        let errorMsg = "Upload failed";
        try {
          const errorData = await res.json();
          errorMsg = errorData.message || JSON.stringify(errorData) || errorMsg;
          console.log("Erreur API (json):", errorData);
        } catch {
          try {
            errorMsg = await res.text();
            console.log("Erreur API (texte):", errorMsg);
          } catch (e) {
            console.log("Erreur API (exception):", e);
          }
        }
        throw new Error(errorMsg);
      }
      setShowUpload(false);
      setUploadFile(null);
      setDocumentTitle("");
      // Refresh documents (optionnel, car reload va tout recharger)
      if (!timeoutTriggered) {
        clearTimeout(timeout);
        window.location.reload();
      }
    } catch (err: any) {
      // Ne rien afficher, pas d'alert ni de console.error
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDeleteDocument = async (documentId: number) => {
    try {
      const token = localStorage.getItem("accessToken") || "";
      await deleteDocument(documentId, token);
      // Rafraîchir la liste après suppression
      if (medicalRecord?.id) {
        const docs = await fetchPatientDocuments(medicalRecord.id);
        setDocuments(docs);
      }
    } catch (e: any) {
      // Optionnel : afficher une erreur
    }
  };

  const handleAddAppointment = async () => {
    if (isConflict(appointmentDate)) {
      toast.error('This time slot is already booked for the patient!', {
        position: 'top-center',
        autoClose: 2000,
        hideProgressBar: true,
      });
      return;
    }
    try {
      const appointmentData = {
        date: appointmentDate,
        title: appointmentTitle,
        status: "SCHEDULED",
        type: appointmentType
      };

      // Fermer la section et réinitialiser les champs immédiatement
      setShowAppointmentSection(false);
      setAppointmentTitle("");
      setAppointmentDate("");
      setAppointmentType("MEDICAL_APPOINTMENT");
      
      // Afficher le message de succès
      toast.success("Appointment added successfully!", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Envoyer la requête en arrière-plan
      await addAppointment(medicalRecord.id, appointmentData);
    } catch (error) {
      console.error("Error adding appointment:", error);
      toast.error("Failed to add appointment", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handlePdfClick = (doc: any) => {
    if (Array.isArray(doc.content)) {
      setSelectedPdfBytes(doc.content);
      setSelectedPdfBase64(null);
    } else if (typeof doc.content === "string") {
      setSelectedPdfBase64(doc.content);
      setSelectedPdfBytes(null);
    }
    setSelectedDocumentId(doc.id);
  };

  const handleCreateInvoice = async () => {
    try {
      const specificId = localStorage.getItem("specificId");
      if (!specificId) {
        throw new Error("No specific ID found");
      }

      const invoiceData = {
        amount: parseFloat(invoiceAmount),
        description: invoiceDescription,
        status: invoiceStatus
      };

      // Fermer la section et réinitialiser les champs immédiatement
      setShowInvoiceSection(false);
      setInvoiceAmount("");
      setInvoiceDescription("");
      setInvoiceStatus("DRAFT");
      
      // Afficher le message de succès
      toast.success("Invoice generated successfully!", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Envoyer la requête en arrière-plan
      await createInvoice(medicalRecord.id, parseInt(specificId), invoiceData);
    } catch (error) {
      console.error("Error creating invoice:", error);
      toast.error("Failed to generate invoice", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  useEffect(() => {
    if (activeTab === 'invoices' && medicalRecord?.id) {
      setInvoicesLoading(true);
      const specificId = localStorage.getItem("specificId");
      if (!specificId) {
        setInvoicesError("No specific ID found");
        setInvoicesLoading(false);
        return;
      }

      fetchInvoices(medicalRecord.id, parseInt(specificId))
        .then(setInvoices)
        .catch(err => setInvoicesError(err.message))
        .finally(() => setInvoicesLoading(false));
    }
  }, [activeTab, medicalRecord?.id]);

  useEffect(() => {
    if (medicalRecord?.patientId) {
      getAppointments(medicalRecord.patientId.toString()).then((apps) => {
        setAppointments(
          apps.map((a: any) => ({
            id: a.id,
            title: a.title,
            start: new Date(a.date),
            end: new Date(new Date(a.date).getTime() + 60 * 60 * 1000),
            type: a.type,
            status: a.status,
          }))
        );
      });
    }
  }, [medicalRecord?.patientId]);

  const isConflict = (date: string) => {
    const newStart = new Date(date);
    const newEnd = new Date(newStart.getTime() + 60 * 60 * 1000);
    return appointments.some(app => {
      const appStart = new Date(app.start);
      const appEnd = new Date(app.end);
      return (newStart < appEnd && newEnd > appStart);
    });
  };

  return (
    <div style={{ height: "auto", display: "flex" }}>
      <SideBar />
      <div style={{ flex: 1, background: "#f5f6fa", position: "relative", minHeight: "100vh" }}>
        <DashboardActionsBar userName={userName} />
        <ToastContainer position="top-center" autoClose={2000} />
        <div className="container mx-auto p-6 max-w-6xl flex gap-8" style={{ marginTop: "20px" }}>
          {/* Colonne de gauche */}
          <div className="flex flex-col gap-4" style={{ width: '420px', minWidth: 320 }}>
            <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: '#28A6A7' }}>Medical Record</h2>
            {/* Main Note */}
            <div className="mb-6" style={{
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
              transition: 'all 0.3s ease-in-out',
              position: 'relative' // <-- cursor retiré ici
            }}>
              <h3 className="text-lg font-semibold mb-2" style={{ margin: '4vh' }}>Main Note</h3>
              <div className="bg-blue-50 p-4 rounded-lg">
                {/* Title */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{
                    backgroundColor: '#dbeafe',
                    color: '#1e40af',
                    fontSize: '0.75rem',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem',
                    textDecoration: 'none',
                    fontWeight: 500,
                  }}>Title:</span>
                  {editNoteMode ? (
                    <input
                      type="text"
                      value={editNoteTitle}
                      onChange={e => setEditNoteTitle(e.target.value)}
                      style={{ fontSize: 16, fontWeight: 600, borderRadius: 4, border: '1px solid #d1d5db', padding: 4, width: 220 }}
                    />
                  ) : (
                    <span className="font-semibold text-blue-700" style={{ fontSize: 16 }}>
                      {medicalRecord?.note?.title || "No note"}
                    </span>
                  )}
                </div>
                {/* Description */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{
                    backgroundColor: '#dbeafe',
                    color: '#1e40af',
                    fontSize: '0.75rem',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem',
                    textDecoration: 'none',
                    fontWeight: 500,
                  }}>Note Description:</span>
                  {editNoteMode ? (
                    <textarea
                      value={editNoteDescription}
                      onChange={e => setEditNoteDescription(e.target.value)}
                      style={{ fontSize: 15, borderRadius: 4, border: '1px solid #d1d5db', padding: 4, width: 220, minHeight: 40 }}
                    />
                  ) : (
                    <span style={{ fontSize: 15, color: "#222" }}>
                      {medicalRecord?.note?.description || ""}
                    </span>
                  )}
                </div>
                {/* Last update */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{
                    backgroundColor: '#dbeafe',
                    color: '#1e40af',
                    fontSize: '0.75rem',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem',
                    textDecoration: 'none',
                    fontWeight: 500,
                  }}>Last update:</span>
                  <span style={{ color: "#888", fontSize: 14 }}>
                    {medicalRecord?.note?.date ? new Date(medicalRecord.note.date).toLocaleString() : "-"}
                  </span>
                </div>
                {/* Author Name */}
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{
                    backgroundColor: '#dbeafe',
                    color: '#1e40af',
                    fontSize: '0.75rem',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem',
                    textDecoration: 'none',
                    fontWeight: 500,
                  }}>Last author:</span>
                  <span style={{ color: "#888", fontSize: 14 }}>
                    {doctorName || "-"}
                  </span>
                </div>
              </div>
              {/* Icons en bas à droite */}
              <div style={{
                position: 'absolute',
                right: 16,
                bottom: 16,
                display: 'flex',
                gap: 16
              }}>
                {editNoteMode ? (
                  <>
                    <span
                      style={{ cursor: 'pointer', color: '#22c55e', fontSize: 22 }}
                      title="Valider"
                      onClick={handleSubmitNoteUpdate
                        
                      }
                    >
                      <FontAwesomeIcon icon={faCheck} />
                    </span>
                   
                  </>
                ) : (
                  <span
                    style={{ cursor: 'pointer', color: '#2563eb', fontSize: 22 }}
                    title="Edit"
                    onClick={() => {
                      setEditNoteTitle(medicalRecord?.note?.title || "");
                      setEditNoteDescription(medicalRecord?.note?.description || "");
                      setEditNoteMode(true);
                    }}
                  >
                    <FontAwesomeIcon icon={faPen} />
                  </span>
                )}
                <span style={{ cursor: 'pointer', color: '#e11d48', fontSize: 22 }} title="Delete">
                  <FontAwesomeIcon icon={faTrash} />
                </span>
              </div>
            </div>
            {/* Documents/Invoices Section */}
            <div>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <button
                  onClick={() => setActiveTab('documents')}
                  style={{
                    background: activeTab === 'documents' ? '#2563eb' : '#e2e8f0',
                    color: activeTab === 'documents' ? 'white' : '#64748b',
                    border: 'none',
                    borderRadius: '0.5rem',
                    padding: '0.5rem 1rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  Documents
                </button>
                <button
                  onClick={() => setActiveTab('invoices')}
                  style={{
                    background: activeTab === 'invoices' ? '#2563eb' : '#e2e8f0',
                    color: activeTab === 'invoices' ? 'white' : '#64748b',
                    border: 'none',
                    borderRadius: '0.5rem',
                    padding: '0.5rem 1rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  Invoices
                </button>
              </div>

              {activeTab === 'documents' ? (
                <>
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
                        creator={doctorNames[doc.uploadedById] || "-"}
                        creationDate={doc.creationDate}
                        documentId={doc.id}
                        noteId={doc.note?.id}
                        onClick={() => handlePdfClick(doc)}
                        onDelete={() => handleDeleteDocument(doc.id)}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <>
                  {invoicesLoading && <div>Loading invoices...</div>}
                  {invoicesError && <div className="text-red-500">{invoicesError}</div>}
                  <div className="flex flex-col gap-4">
                    {invoices.map(invoice => (
                      <InvoiceItem
                        key={invoice.id}
                        id={invoice.id}
                        invoiceDate={invoice.invoiceDate}
                        amount={invoice.amount}
                        description={invoice.description}
                        status={invoice.status}
                        medicalRecordId={medicalRecord.id}
                        onUpdate={() => {
                          if (medicalRecord?.id) {
                            const specificId = localStorage.getItem("specificId");
                            if (specificId) {
                              fetchInvoices(medicalRecord.id, parseInt(specificId))
                                .then(setInvoices)
                                .catch(err => setInvoicesError(err.message));
                            }
                          }
                        }}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
          {/* PDF Viewer à droite + Upload */}
          <div style={{ flex: 1, minWidth: 0  }}>
            {/* Section Upload, Appointment et Invoice */}
            <div style={{ marginBottom: 24, background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px #0001", padding: 20, marginTop: 70, paddingTop: '20px' }}>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <button
                  style={{
                    background: "#2563eb",
                    color: "white",
                    border: "none",
                    borderRadius: 8,
                    padding: "8px 18px",
                    fontWeight: 600,
                    fontSize: 16,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                  onClick={() => setShowUpload(v => !v)}
                >
                  <FontAwesomeIcon icon={faUpload} />
                  Upload new document
                </button>
                <button
                  style={{
                    background: "#2563eb",
                    color: "white",
                    border: "none",
                    borderRadius: 8,
                    padding: "8px 18px",
                    fontWeight: 600,
                    fontSize: 16,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                  onClick={() => setShowAppointmentSection(v => !v)}
                >
                  <FontAwesomeIcon icon={faCalendar} />
                  Add new appointment
                </button>
                <button
                  style={{
                    background: "#2563eb",
                    color: "white",
                    border: "none",
                    borderRadius: 8,
                    padding: "8px 18px",
                    fontWeight: 600,
                    fontSize: 16,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                  onClick={() => setShowInvoiceSection(v => !v)}
                >
                  <FontAwesomeIcon icon={faFileInvoice} />
                  Generate invoice
                </button>
              </div>

              {showUpload && (
                <div style={{ marginTop: 12 }}>
                  <div style={{ marginBottom: 12 }}>
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={e => setUploadFile(e.target.files?.[0] || null)}
                    />
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <input
                      type="text"
                      placeholder="Document title..."
                      value={documentTitle}
                      onChange={e => setDocumentTitle(e.target.value)}
                      style={{ width: "100%", borderRadius: 6, border: "1px solid #d1d5db", padding: 8, fontSize: 15 }}
                    />
                  </div>
                  {uploadError && <div style={{ color: "#e11d48", marginBottom: 8 }}>{uploadError}</div>}
                  <button
                    onClick={handleUpload}
                    disabled={uploadLoading}
                    style={{
                      background: "#22c55e",
                      color: "white",
                      border: "none",
                      borderRadius: 8,
                      padding: "8px 18px",
                      fontWeight: 600,
                      fontSize: 16,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      width: "100%"
                    }}
                  >
                    {uploadLoading ? "Uploading..." : "Submit"}
                  </button>
                </div>
              )}

              {showAppointmentSection && (
                <div style={{ marginTop: 12 }}>
                  {/* Calendrier des rendez-vous du patient (lecture seule) */}
                  <div style={{ marginBottom: 24 }}>
                    <BigCalendar
                      localizer={localizer}
                      events={appointments}
                      startAccessor="start"
                      endAccessor="end"
                      style={{ height: 300, background: 'white', borderRadius: '1rem', padding: 10 }}
                      views={[Views.WEEK, Views.DAY, Views.MONTH]}
                      popup
                      selectable={false}
                      eventPropGetter={(event) => ({
                        style: {
                          backgroundColor: '#38bdf8',
                          borderRadius: '8px',
                          color: '#fff',
                          border: 'none',
                          fontWeight: 600,
                          fontSize: 15,
                          padding: 4,
                        },
                      })}
                      components={{
                        event: ({ event }: any) => (
                          <div>
                            <div style={{ fontWeight: 700 }}>{event.title}</div>
                            <div style={{ fontSize: 12 }}>{event.status}</div>
                          </div>
                        ),
                      }}
                    />
                  </div>
                  {/* Formulaire d'ajout de rendez-vous */}
                  <div style={{ marginBottom: 12 }}>
                    <input
                      type="text"
                      placeholder="Appointment title..."
                      value={appointmentTitle}
                      onChange={e => setAppointmentTitle(e.target.value)}
                      style={{ width: "100%", borderRadius: 6, border: "1px solid #d1d5db", padding: 8, fontSize: 15 }}
                    />
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <input
                      type="datetime-local"
                      value={appointmentDate}
                      onChange={e => setAppointmentDate(e.target.value)}
                      style={{ width: "100%", borderRadius: 6, border: "1px solid #d1d5db", padding: 8, fontSize: 15 }}
                    />
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <select
                      value={appointmentType}
                      onChange={e => setAppointmentType(e.target.value)}
                      style={{ width: "100%", borderRadius: 6, border: "1px solid #d1d5db", padding: 8, fontSize: 15 }}
                    >
                      <option value="MEDICAL_APPOINTMENT">Medical Appointment</option>
                      <option value="TREATMENT">Treatment</option>
                      <option value="VACCINATION">Vaccination</option>
                    </select>
                  </div>
                  <button
                    onClick={handleAddAppointment}
                    style={{
                      background: "#22c55e",
                      color: "white",
                      border: "none",
                      borderRadius: 8,
                      padding: "8px 18px",
                      fontWeight: 600,
                      fontSize: 16,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      width: "100%"
                    }}
                  >
                    Submit Appointment
                  </button>
                </div>
              )}

              {showInvoiceSection && (
                <div style={{ marginTop: 12 }}>
                  <div style={{ marginBottom: 12 }}>
                    <input
                      type="number"
                      placeholder="Amount..."
                      value={invoiceAmount}
                      onChange={e => setInvoiceAmount(e.target.value)}
                      style={{ width: "100%", borderRadius: 6, border: "1px solid #d1d5db", padding: 8, fontSize: 15 }}
                    />
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <input
                      type="text"
                      placeholder="Description..."
                      value={invoiceDescription}
                      onChange={e => setInvoiceDescription(e.target.value)}
                      style={{ width: "100%", borderRadius: 6, border: "1px solid #d1d5db", padding: 8, fontSize: 15 }}
                    />
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <select
                      value={invoiceStatus}
                      onChange={e => setInvoiceStatus(e.target.value)}
                      style={{ width: "100%", borderRadius: 6, border: "1px solid #d1d5db", padding: 8, fontSize: 15 }}
                    >
                      <option value="DRAFT">Draft</option>
                      <option value="PENDING">Pending</option>
                      <option value="PAID">Paid</option>
                      <option value="CANCELED">Canceled</option>
                    </select>
                  </div>
                  <button
                    onClick={handleCreateInvoice}
                    style={{
                      background: "#22c55e",
                      color: "white",
                      border: "none",
                      borderRadius: 8,
                      padding: "8px 18px",
                      fontWeight: 600,
                      fontSize: 16,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      width: "100%"
                    }}
                  >
                    Submit Invoice
                  </button>
                </div>
              )}
            </div>

            {/* PDF Viewer */}
            {selectedPdfBytes && Array.isArray(selectedPdfBytes) && selectedPdfBytes.length > 0 ? (
              <PDFViewer documentId={selectedDocumentId ?? 0} bytes={selectedPdfBytes} onClose={() => { setSelectedPdfBytes(null); setSelectedDocumentId(null); }} />
            ) : selectedPdfBase64 ? (
              <PDFViewer documentId={selectedDocumentId ?? 0} base64={selectedPdfBase64} onClose={() => { setSelectedPdfBase64(null); setSelectedDocumentId(null); }} />
            ) : (
              <div style={{ textAlign: 'center', color: '#888', marginTop: 80 }}>No PDF to display</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
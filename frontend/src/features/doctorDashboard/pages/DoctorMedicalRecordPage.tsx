import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SideBar from "../components/sideBar";
import DashboardActionsBar from "../components/DashboardActionsBar";
import PdfCard from "../components/PdfCard";
import PDFViewer from "../components/PDFViewer";
import InvoiceItem from "../components/InvoiceItem";
import { fetchMedicalRecord, fetchPatientDocuments, fetchDoctorName, fetchNoteIdFromMedicalRecord, updateMainNote, deleteDocument, addAppointment, createInvoice, fetchInvoices } from "../services/medicalRecordService";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPen, faUpload, faCheck, faCalendar, faFileInvoice, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function DoctorMedicalRecordPage() {
  const { patientId } = useParams();
  const userName = localStorage.getItem("userName") || "Doctor";
  const [medicalRecord, setMedicalRecord] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPdfBytes, setSelectedPdfBytes] = useState<Uint8Array | null>(null);
  const [selectedPdfBase64, setSelectedPdfBase64] = useState<string | null>(null);
  const [selectedDocumentId, setSelectedDocumentId] = useState<number | null>(null);
  const [doctorName, setDoctorName] = useState<string>("");
  const [doctorNames, setDoctorNames] = useState<Record<number, string>>({});
  const [showUpload, setShowUpload] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadNote, setUploadNote] = useState("");
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [documentTitle, setDocumentTitle] = useState("");
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

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
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [patientId]);

  useEffect(() => {
    if (medicalRecord?.note) {
      setEditNoteTitle(medicalRecord.note.title || "");
      setEditNoteDescription(medicalRecord.note.description || "");
    }
  }, [medicalRecord?.note]);

  const handleSubmitNoteUpdate = async () => {
    try {
      if (!medicalRecord?.note?.id) {
        throw new Error("Note ID not found");
      }

      const specificId = localStorage.getItem("specificId");
      if (!specificId) {
        throw new Error("No specific ID found");
      }

      const token = localStorage.getItem("accessToken") || "";
      await updateMainNote(medicalRecord.note.id, specificId, editNoteTitle, editNoteDescription, token);

      toast.success("Note updated successfully!", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setEditNoteMode(false);
    } catch (error) {
      console.error("Error updating note:", error);
      toast.error("Failed to update note", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleUpload = async () => {
    let timeoutTriggered = false;
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
      if (!timeoutTriggered) {
        clearTimeout(timeout);
        window.location.reload();
      }
    } catch (err: any) {
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDeleteDocument = async (documentId: number) => {
    try {
      const token = localStorage.getItem("accessToken") || "";
      await deleteDocument(documentId, token);
      if (medicalRecord?.id) {
        const docs = await fetchPatientDocuments(medicalRecord.id);
        setDocuments(docs);
      }
    } catch (e: any) {
    }
  };

  const handleAddAppointment = async () => {
    try {
      const appointmentData = {
        date: appointmentDate,
        title: appointmentTitle,
        status: "SCHEDULED",
        type: appointmentType
      };

      setShowAppointmentSection(false);
      setAppointmentTitle("");
      setAppointmentDate("");
      setAppointmentType("MEDICAL_APPOINTMENT");
      
      toast.success("Appointment added successfully!", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      await addAppointment(medicalRecord.id, appointmentData);
    } catch (error) {
      console.error("Error adding appointment:", error);
      toast.error("Failed to add appointment", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
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

      setShowInvoiceSection(false);
      setInvoiceAmount("");
      setInvoiceDescription("");
      setInvoiceStatus("DRAFT");
      
      toast.success("Invoice generated successfully!", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      await createInvoice(medicalRecord.id, parseInt(specificId), invoiceData);
    } catch (error) {
      console.error("Error creating invoice:", error);
      toast.error("Failed to generate invoice", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
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

  const totalPages = Math.ceil(invoices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentInvoices = invoices.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div style={{ height: "auto", display: "flex" }}>
        <SideBar />
        <div style={{ flex: 1, background: "#f5f6fa", position: "relative", minHeight: "100vh" }}>
          <DashboardActionsBar userName={userName} />
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
            <div>Loading medical record...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ height: "auto", display: "flex" }}>
        <SideBar />
        <div style={{ flex: 1, background: "#f5f6fa", position: "relative", minHeight: "100vh" }}>
          <DashboardActionsBar userName={userName} />
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
            <div style={{ color: "#e11d48" }}>{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: "auto", display: "flex" }}>
      <SideBar />
      <div style={{ flex: 1, background: "#f5f6fa", position: "relative", minHeight: "100vh" }}>
        <DashboardActionsBar userName={userName} />
        <ToastContainer position="top-center" autoClose={2000} />
        <div style={{ display: "flex", height: "calc(100vh - 80px)", marginTop: "40px" }}>
          <div style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
            <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px #0001", padding: 20, marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h2 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 600, color: "#1e293b" }}>
                  Medical Record - Patient {patientId}
                </h2>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={() => setActiveTab('documents')}
                    style={{
                      background: activeTab === 'documents' ? "#2563eb" : "#f1f5f9",
                      color: activeTab === 'documents' ? "white" : "#64748b",
                      border: "none",
                      borderRadius: 8,
                      padding: "8px 16px",
                      fontWeight: 600,
                      cursor: "pointer"
                    }}
                  >
                    Documents
                  </button>
                  <button
                    onClick={() => setActiveTab('invoices')}
                    style={{
                      background: activeTab === 'invoices' ? "#2563eb" : "#f1f5f9",
                      color: activeTab === 'invoices' ? "white" : "#64748b",
                      border: "none",
                      borderRadius: 8,
                      padding: "8px 16px",
                      fontWeight: 600,
                      cursor: "pointer"
                    }}
                  >
                    Invoices
                  </button>
                </div>
              </div>

              {medicalRecord?.note && (
                <div style={{ marginBottom: 20, padding: 16, background: "#f8fafc", borderRadius: 8, border: "1px solid #e2e8f0" }}>
                  {!editNoteMode ? (
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 600, color: "#1e293b" }}>
                          {medicalRecord.note.title || "Main Note"}
                        </h3>
                        <button
                          onClick={() => setEditNoteMode(true)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#2563eb",
                            cursor: "pointer",
                            padding: "4px 8px",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px"
                          }}
                        >
                          <FontAwesomeIcon icon={faPen} style={{ fontSize: "0.9rem" }} />
                          Edit
                        </button>
                      </div>
                      <p style={{ margin: 0, color: "#64748b", lineHeight: 1.5 }}>
                        {medicalRecord.note.description || "No description available"}
                      </p>
                      <div style={{ marginTop: 8, fontSize: "0.9rem", color: "#94a3b8" }}>
                        By: {doctorName} | Created: {new Date(medicalRecord.note.creationDate).toLocaleDateString()}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ marginBottom: 12 }}>
                        <input
                          type="text"
                          value={editNoteTitle}
                          onChange={(e) => setEditNoteTitle(e.target.value)}
                          placeholder="Note title"
                          style={{ width: "100%", borderRadius: 6, border: "1px solid #d1d5db", padding: 8, fontSize: 15 }}
                        />
                      </div>
                      <div style={{ marginBottom: 12 }}>
                        <textarea
                          value={editNoteDescription}
                          onChange={(e) => setEditNoteDescription(e.target.value)}
                          placeholder="Note description"
                          rows={3}
                          style={{ width: "100%", borderRadius: 6, border: "1px solid #d1d5db", padding: 8, fontSize: 15, resize: "vertical" }}
                        />
                      </div>
                      <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                        <button
                          onClick={() => setEditNoteMode(false)}
                          style={{
                            padding: "6px 12px",
                            borderRadius: 6,
                            border: "1px solid #d1d5db",
                            background: "white",
                            color: "#64748b",
                            cursor: "pointer"
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSubmitNoteUpdate}
                          style={{
                            padding: "6px 12px",
                            borderRadius: 6,
                            border: "none",
                            background: "#2563eb",
                            color: "white",
                            cursor: "pointer"
                          }}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div>
                {activeTab === 'documents' ? (
                  <>
                    {loading && <div>Loading documents...</div>}
                    {error && <div className="text-red-500">{error}</div>}
                    {documents.length === 0 ? (
                      <div style={{ textAlign: "center", padding: "2rem", color: "#64748b" }}>
                        No documents uploaded yet.
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4">
                        {documents.map((doc) => (
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
                    )}
                  </>
                ) : (
                  <>
                    {invoicesLoading && <div>Loading invoices...</div>}
                    {invoicesError && <div className="text-red-500">{invoicesError}</div>}
                    {!invoicesLoading && !invoicesError && invoices.length === 0 && (
                      <div style={{ textAlign: "center", padding: "2rem", color: "#64748b" }}>
                        No invoices found.
                      </div>
                    )}
                    {!invoicesLoading && !invoicesError && invoices.length > 0 && (
                      <>
                        <div className="flex flex-col gap-4">
                          {currentInvoices.map(invoice => (
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

                        {totalPages > 1 && (
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'center', 
                            alignItems: 'center', 
                            gap: '1rem',
                            marginTop: '2rem',
                            padding: '1rem'
                          }}>
                            <button
                              onClick={() => handlePageChange(currentPage - 1)}
                              disabled={currentPage === 1}
                              style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '0.25rem',
                                border: '1px solid #d1d5db',
                                background: currentPage === 1 ? '#f1f5f9' : 'white',
                                color: currentPage === 1 ? '#94a3b8' : '#64748b',
                                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                              }}
                            >
                              <FontAwesomeIcon icon={faChevronLeft} />
                              Previous
                            </button>

                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                                <button
                                  key={page}
                                  onClick={() => handlePageChange(page)}
                                  style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '0.25rem',
                                    border: '1px solid #d1d5db',
                                    background: currentPage === page ? '#2563eb' : 'white',
                                    color: currentPage === page ? 'white' : '#64748b',
                                    cursor: 'pointer',
                                    fontWeight: currentPage === page ? 600 : 400
                                  }}
                                >
                                  {page}
                                </button>
                              ))}
                            </div>

                            <button
                              onClick={() => handlePageChange(currentPage + 1)}
                              disabled={currentPage === totalPages}
                              style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '0.25rem',
                                border: '1px solid #d1d5db',
                                background: currentPage === totalPages ? '#f1f5f9' : 'white',
                                color: currentPage === totalPages ? '#94a3b8' : '#64748b',
                                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                              }}
                            >
                              Next
                              <FontAwesomeIcon icon={faChevronRight} />
                            </button>
                          </div>
                        )}

                        <div style={{ 
                          textAlign: 'center', 
                          marginTop: '1rem',
                          color: '#64748b',
                          fontSize: '0.9rem'
                        }}>
                          Showing {startIndex + 1} to {Math.min(endIndex, invoices.length)} of {invoices.length} invoices
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 0  }}>
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

            {(selectedPdfBytes || selectedPdfBase64) && selectedDocumentId && (
              <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px #0001", padding: 20, height: "calc(100vh - 400px)", overflow: "hidden" }}>
                <PDFViewer
                  bytes={selectedPdfBytes ? Array.from(selectedPdfBytes) : undefined}
                  base64={selectedPdfBase64 || undefined}
                  documentId={selectedDocumentId}
                  onClose={() => {
                    setSelectedPdfBytes(null);
                    setSelectedPdfBase64(null);
                    setSelectedDocumentId(null);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
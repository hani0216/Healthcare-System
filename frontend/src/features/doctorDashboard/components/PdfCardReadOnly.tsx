import React, { useState } from "react";
import PdfImg from "../../../assets/pdf.png";
// @ts-ignore
import { DoctorCard } from "../../dashboard/pages/SearchPage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { fetchDoctorInfo } from "../services/medicalRecordService";
import { useNavigate } from "react-router-dom";

interface PdfCardReadOnlyProps {
  noteTitle: string;
  noteDescription: string;
  contentUrl: string;
  creator: string;
  creationDate: any;
  documentTitle: string;
  doctorId: number;
  patientId?: number;
}

const Modal = ({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) => {
  if (!open) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "10vh",
        background: "rgba(0,0,0,0.1)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "transparent",
          borderRadius: 16,
          padding: 24,
          minWidth: 350,
          maxWidth: "90vw",
          maxHeight: "70vh",
          overflowY: "auto",
          boxShadow: "none",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            float: "right",
            background: "none",
            border: "none",
            fontSize: 22,
            cursor: "pointer",
            color: "#222",
          }}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

const PdfCardReadOnly: React.FC<PdfCardReadOnlyProps> = ({
  noteTitle,
  noteDescription,
  contentUrl,
  creator,
  creationDate,
  documentTitle,
  doctorId,
  patientId,
}) => {
  const navigate = useNavigate();
  const dateObj = creationDate?.toDate
    ? creationDate.toDate()
    : new Date(creationDate);
  const formattedDate = dateObj.toLocaleDateString("fr-FR");

  const [modalOpen, setModalOpen] = useState(false);
  const [doctorInfo, setDoctorInfo] = useState<any>(null);
  const [showDescription, setShowDescription] = useState(false);

  const handleTitleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDescription((prev) => !prev);
  };

  const handleCreatorClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const data = await fetchDoctorInfo(doctorId);
      setDoctorInfo(data);
      setModalOpen(true);
    } catch (err) {
      setDoctorInfo(null);
      setModalOpen(true);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "0.5rem",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
        transition: "all 0.3s ease-in-out",
        cursor: "pointer",
        marginBottom: showDescription ? 16 : 0,
        position: "relative",
      }}
    >
      <div style={{ display: "flex" }}>
        <div
          style={{
            width: "6rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundImage: `url(${PdfImg})`,
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            margin: "4px",
            
          }}
        >
          <i
            className="fas fa-file-pdf"
            style={{
              fontSize: "2.25rem",
              color: "#ef4444",
              
            }}
          />
        </div>
        <div style={{ padding: "1rem", flex: 1 }}>
          <h4
            style={{
              fontWeight: 500,
              color: "#1f2937",
              marginBottom: 8,
              userSelect: "none",
              
            }}
          >
            {documentTitle}
          </h4>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "0.5rem",
              fontSize: "0.875rem",
              color: "#6b7280",
            }}
          >
            <span>{formattedDate}</span>
          </div>
          <div
            style={{
              marginTop: "0.75rem",
              display: "flex",
              gap: "0.5rem",
            }}
          >
            <span
              style={{
                backgroundColor: "#dbeafe",
                color: "#1e40af",
                fontSize: "0.75rem",
                padding: "0.25rem 0.5rem",
                borderRadius: "0.25rem",
                cursor: "pointer",
                textDecoration: "none",
                fontWeight: 500,
                
              }}
              onClick={handleCreatorClick}
            >
              Author : {creator}
            </span>
            <span
              style={{
                backgroundColor: "#dbeafe",
                color: "#1e40af",
                fontSize: "0.75rem",
                padding: "0.25rem 0.5rem",
                borderRadius: "0.25rem",
                cursor: "pointer",
                textDecoration: "none",
                fontWeight: 500,
                position: "relative",
                display: "inline-block",
                minWidth: 90,
              }}
              onClick={handleTitleClick}
            >
              Note : {noteTitle}
              {/* Icône crayon affichée mais non interactive */}
             
            </span>
          </div>
        </div>
      </div>

      {/* Modal DoctorCard */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        {doctorInfo && (
          <DoctorCard
            name={doctorInfo.name}
            email={doctorInfo.email}
            speciality={doctorInfo.speciality}
            address={doctorInfo.address}
            phone={doctorInfo.phone}
          />
        )}
      </Modal>
      
    </div>
  );
};

export default PdfCardReadOnly;
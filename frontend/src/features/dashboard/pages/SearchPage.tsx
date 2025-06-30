import React, { useState } from "react";
import SideBar from "../components/sideBar";
import DashboardActionsBar from "../components/DashboardActionsBar";
import "../style/dash.css";
import { FaBrain, FaTooth, FaChild, FaHeartbeat, FaLungs, FaUserMd, FaEye, FaBone, FaStethoscope, FaUserNurse, FaXRay, FaVial, FaUser, FaSyringe, FaNotesMedical, FaMicroscope, FaRadiation, FaVenus, FaRibbon } from "react-icons/fa";
import DoctorSpecialityCard from "../components/DoctorSpecialityCard";
import {  FaStar, FaComment } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// Liste des spécialités
const SPECIALITIES = [
  { key: "ORTHODONTICS", name: "Orthodontics", desc: "This specialist helps you to align your teeth and improve your smile." },
  { key: "GENERAL_DENTISTRY", name: "General Dentistry", desc: "This specialist helps you to maintain your oral health and treat common dental issues." },
  { key: "PERIODONTICS", name: "Periodontics", desc: "This specialist helps you to care for your gums and treat gum diseases." },
  { key: "ENDODONTICS", name: "Endodontics", desc: "This specialist helps you to save your teeth through root canal treatments." },
  { key: "PROSTHODONTICS", name: "Prosthodontics", desc: "This specialist helps you to restore your smile with dental prostheses." },
  { key: "PEDIATRIC_DENTISTRY", name: "Pediatric Dentistry", desc: "This specialist helps you to care for your children's teeth." },
  { key: "ORAL_AND_MAXILLOFACIAL_SURGERY", name: "Oral & Maxillofacial Surgery", desc: "This specialist helps you to treat complex mouth, jaw, and face conditions." },
  { key: "ORAL_PATHOLOGY", name: "Oral Pathology", desc: "This specialist helps you to diagnose and manage oral diseases." },
  { key: "IMPLANTOLOGY", name: "Implantology", desc: "This specialist helps you to replace missing teeth with implants." },
  { key: "CARDIOLOGY", name: "Cardiology", desc: "This specialist helps you to keep your heart healthy and treat cardiovascular diseases." },
  { key: "DERMATOLOGY", name: "Dermatology", desc: "This specialist helps you to care for your skin and treat skin conditions." },
  { key: "NEUROLOGY", name: "Neurology", desc: "This specialist helps you to manage brain and nervous system disorders." },
  { key: "OPHTHALMOLOGY", name: "Ophthalmology", desc: "This specialist helps you to maintain your vision and treat eye diseases." },
  { key: "ORTHOPEDICS", name: "Orthopedics", desc: "This specialist helps you to treat bone, joint, and muscle problems." },
  { key: "PEDIATRICS", name: "Pediatrics", desc: "This specialist helps you to ensure your child's health and development." },
  { key: "RADIOLOGY", name: "Radiology", desc: "This specialist helps you to diagnose diseases using medical imaging." },
  { key: "ANESTHESIOLOGY", name: "Anesthesiology", desc: "This specialist helps you to manage pain and anesthesia during procedures." },
  { key: "PSYCHIATRY", name: "Psychiatry", desc: "This specialist helps you to care for your mental health." },
  { key: "GYNECOLOGY", name: "Gynecology", desc: "This specialist helps you to manage women's reproductive health." },
  { key: "ONCOLOGY", name: "Oncology", desc: "This specialist helps you to treat and manage cancer." },
  { key: "PULMONOLOGY", name: "Pulmonology", desc: "This specialist helps you to care for your lungs and breathing." },
  { key: "GASTROENTEROLOGY", name: "Gastroenterology", desc: "This specialist helps you to manage digestive system disorders." },
  { key: "RHEUMATOLOGY", name: "Rheumatology", desc: "This specialist helps you to treat joint and autoimmune diseases." },
  { key: "ENDOCRINOLOGY", name: "Endocrinology", desc: "This specialist helps you to manage hormonal and metabolic disorders." },
  { key: "GENERAL", name: "General", desc: "This specialist helps you to address a wide range of health issues." },
];

// Mapping spécialité -> icône
const SPECIALITY_ICONS: Record<string, React.ReactNode> = {
  ORTHODONTICS: <FaTooth className="text-2xl" />,
  GENERAL_DENTISTRY: <FaTooth className="text-2xl" />,
  PERIODONTICS: <FaTooth className="text-2xl" />,
  ENDODONTICS: <FaTooth className="text-2xl" />,
  PROSTHODONTICS: <FaTooth className="text-2xl" />,
  PEDIATRIC_DENTISTRY: <FaChild className="text-2xl" />,
  ORAL_AND_MAXILLOFACIAL_SURGERY: <FaUserMd className="text-2xl" />,
  ORAL_PATHOLOGY: <FaMicroscope className="text-2xl" />,
  IMPLANTOLOGY: <FaTooth className="text-2xl" />,
  CARDIOLOGY: <FaHeartbeat className="text-2xl" />,
  DERMATOLOGY: <FaUserNurse className="text-2xl" />,
  NEUROLOGY: <FaBrain className="text-2xl" />,
  OPHTHALMOLOGY: <FaEye className="text-2xl" />,
  ORTHOPEDICS: <FaBone className="text-2xl" />,
  PEDIATRICS: <FaChild className="text-2xl" />,
  RADIOLOGY: <FaXRay className="text-2xl" />,
  ANESTHESIOLOGY: <FaSyringe className="text-2xl" />,
  PSYCHIATRY: <FaBrain className="text-2xl" />,
  GYNECOLOGY: <FaVenus className="text-2xl" />,
  ONCOLOGY: <FaRibbon className="text-2xl" />,
  PULMONOLOGY: <FaLungs className="text-2xl" />,
  GASTROENTEROLOGY: <FaStethoscope className="text-2xl" />,
  RHEUMATOLOGY: <FaNotesMedical className="text-2xl" />,
  ENDOCRINOLOGY: <FaVial className="text-2xl" />,
  GENERAL: <FaUser className="text-2xl" />,
};
type DoctorCardProps = {
  name: string;
  email: string;
  speciality: string;
  address: string;
  phone: string;
};

function DoctorSpecialityGrid({
  specialities,
  onSpecialityClick,
}: {
  specialities: typeof SPECIALITIES;
  onSpecialityClick: (key: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-6 justify-center">
      {specialities.map((spec) => (
        <div key={spec.key} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
          <DoctorSpecialityCard
            name={spec.name}
            desc={spec.desc}
          
            onClick={() => onSpecialityClick(spec.key)}
          />
        </div>
      ))}
    </div>
  );
}

// Nouveau composant pour afficher un médecin sous forme de carte
export function DoctorCard({ name, email, speciality, address, phone }: DoctorCardProps) {
  const handleBookNow = () => {
    toast.info(
      <div style={{ fontWeight: 600, fontSize: 18, color: '#1B7B2C', textAlign: 'center' }}>
        <span style={{ fontSize: 15, color: '#222' }}>Doctor's phone:</span><br />
        <span style={{ fontSize: 22 }}>{phone || 'No phone number'}</span>
      </div>,
      {
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        style: { borderRadius: 16, background: '#e6f9ed', color: '#1B7B2C', fontWeight: 600, fontSize: 18 },
        icon: <FaUserMd style={{ color: '#22c55e', fontSize: 28 }} />,
      }
    );
  };
  return (
    <div style={{ background: 'none', padding: '40px 0', display: 'flex', justifyContent: 'center' }}>
      <div style={{
        borderRadius: '15px',
        backgroundColor: '#93e2bb',
        padding: '24px',
        color: '#000',
        width: '100%',
        maxWidth: '500px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <h4 style={{ marginBottom: '16px' }}>{speciality}</h4>

        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ flexShrink: 0 }}>
            <div style={{
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              backgroundColor: '#22c55e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '3px solid #000',
            }}>
              <FaUserMd style={{ color: 'white', fontSize: '30px' }} />
            </div>
          </div>

          <div style={{ marginLeft: '16px', flexGrow: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <p style={{ margin: 0, marginRight: '8px' }}>{name}</p>
              
            </div>

            <p style={{ margin: '4px 0', fontSize: '14px' }}>email : {email}</p>
            <p style={{ margin: '4px 0', fontSize: '14px' }}>Phone number :{phone}</p>
          </div>
        </div>

        <hr />

        <p style={{ margin: '16px 0' }}>Adress :{address}</p>

        <button
          style={{
            width: '100%',
            backgroundColor: '#16a34a',
            color: 'white',
            padding: '12px',
            borderRadius: '999px',
            border: 'none',
            fontSize: '16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={handleBookNow}
        >
          <FaComment style={{ marginRight: '8px' }} /> Contact now !
        </button>
      </div>
    </div>
  );
}

export default function SearchPage() {
  const userName = localStorage.getItem("userName") || "Patient";
  const [selectedSpeciality, setSelectedSpeciality] = useState<string | null>(null);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [doctorsPerPage] = useState(8); // 8 médecins par page

  async function handleSpecialityClick(key: string) {
    setSelectedSpeciality(key);
    setLoading(true);
    setCurrentPage(1); // Reset to first page when selecting new speciality
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`http://localhost:8088/doctors/speciality/${key}`, {
      });
      const data = await res.json();
      setDoctors(data);
    } catch {
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  }

  const filteredSpecialities = SPECIALITIES.filter((spec) =>
    spec.name.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination logic for doctors
  const totalPages = Math.ceil(doctors.length / doctorsPerPage);
  const paginatedDoctors = doctors.slice((currentPage - 1) * doctorsPerPage, currentPage * doctorsPerPage);

  return (
    <div style={{ height: "auto", display: "flex" }}>
      <SideBar />
      <div style={{ flex: 1, background: "#f5f6fa", position: "relative", minHeight: "100vh" }}>
        <DashboardActionsBar userName={userName} />
        <div className="container mx-auto p-6 max-w-6xl" style={{ marginTop: "40px" }}>
          <ToastContainer position="top-center" />
          <div  style={{background:'none'}}>
            <h2 className="text-2xl font-bold mb-8 text-center" style={{ color: "#28A6A7"  }}>
              Find a Doctor
            </h2>
            {!selectedSpeciality ? (
              <>
                <div className="flex justify-center mb-10"  >
                  <input
                    type="text"
                    placeholder="Search for a speciality..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full max-w-xl border border-blue-200 rounded-full px-6 py-3 text-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                    style={{ boxShadow: "0 2px 8px rgba(40,166,167,0.06)"  , width:'60%' , marginBottom:'4vh' , marginTop:'2vh' ,borderRadius: '9999px'}}
                  />
                </div>
                {/* Pagination sur la liste des spécialités (optionnel, si beaucoup de spécialités) */}
                <DoctorSpecialityGrid specialities={filteredSpecialities} onSpecialityClick={handleSpecialityClick} />
              </>
            ) : (
              <div style={{background:'none'}}>
                <button className="btn"  style={{width:'17%'}} onClick={() => setSelectedSpeciality(null)}>
                  &larr; Back to specialities
                </button>
                <h3 className="text-xl font-semibold mb-4">
                  Doctors in {SPECIALITIES.find((s) => s.key === selectedSpeciality)?.name}
                </h3>
                {loading ? (
                  <div>Loading...</div>
                ) : (
                  <>
                    <div className="flex flex-wrap gap-6 justify-center"  >
                      {paginatedDoctors.map((doc) => (
                        <DoctorCard 
                          key={doc.id}
                          name={doc.doctorInfo.name}
                          email={doc.doctorInfo.email}
                          speciality={doc.speciality}
                          phone={doc.doctorInfo.phone}
                          address={doc.doctorInfo.address}
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
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

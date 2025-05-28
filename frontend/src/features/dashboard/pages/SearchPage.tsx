import React, { useState } from "react";
import SideBar from "../components/sideBar";
import DashboardActionsBar from "../components/DashboardActionsBar";
import "../style/dash.css";
import { FaBrain, FaTooth, FaChild, FaHeartbeat, FaLungs, FaUserMd, FaEye, FaBone, FaStethoscope, FaUserNurse, FaXRay, FaVial, FaUser, FaSyringe, FaNotesMedical, FaMicroscope, FaRadiation, FaVenus, FaRibbon } from "react-icons/fa";
import DoctorSpecialityCard from "../components/DoctorSpecialityCard";

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
function DoctorCard({ name, email, speciality }: { name: string; email: string; speciality: string }) {
  return (
    <div className="card-hover-effect" style={{ height: '220px', width: '300px', borderRadius: '20px', margin: '0 auto' }}>
      <div style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%)', padding: 24, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
        <div className="card-icon bg-green-500 text-white p-4 rounded-full w-16 h-16 flex items-center justify-center shadow-lg" style={{ backgroundColor: '#22c55e', width: 64, height: 64, margin: '0 auto' }}>
          <FaUserMd className="text-2xl" style={{ width: 36, height: 36 }} />
        </div>
      </div>
      <div className="p-5 flex-grow" style={{ textAlign: 'center' }}>
        <h3 className="name" style={{ margin: 0 }}>{name}</h3>
        <p className="desc" style={{ margin: 0 }}>{email}</p>
        <span className="desc" style={{ color: '#22c55e', fontWeight: 600 }}>{speciality}</span>
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

  async function handleSpecialityClick(key: string) {
    setSelectedSpeciality(key);
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`http://localhost:8088/doctors/speciality/${key}`, {
        headers: { Authorization: `Bearer ${token}` },
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

  return (
    <div style={{ height: "auto", display: "flex" }}>
      <SideBar />
      <div style={{ flex: 1, background: "#f5f6fa", position: "relative", minHeight: "100vh" }}>
        <DashboardActionsBar userName={userName} />
        <div className="container mx-auto p-6 max-w-6xl" style={{ marginTop: "40px" }}>
          <div  style={{background:'none'}}>
            <h2 className="text-2xl font-bold mb-8 text-center" style={{ color: "#28A6A7"  }}>
              Find a Doctor
            </h2>
            {!selectedSpeciality ? (
              < >
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
                <DoctorSpecialityGrid specialities={filteredSpecialities} onSpecialityClick={handleSpecialityClick} />
              </>
            ) : (
              <div>
                <button className="mb-4 text-blue-500 underline" onClick={() => setSelectedSpeciality(null)}>
                  &larr; Back to specialities
                </button>
                <h3 className="text-xl font-semibold mb-4">
                  Doctors in {SPECIALITIES.find((s) => s.key === selectedSpeciality)?.name}
                </h3>
                {loading ? (
                  <div>Loading...</div>
                ) : (
                  <div className="flex flex-wrap gap-6 justify-center">
                    {doctors.map((doc) => (
                      <DoctorCard
                        key={doc.id}
                        name={doc.doctorInfo.name}
                        email={doc.doctorInfo.email}
                        speciality={doc.speciality}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

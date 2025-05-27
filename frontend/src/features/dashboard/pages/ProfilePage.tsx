import React, { useEffect, useState } from "react";
import SideBar from "../components/sideBar";
import DashboardActionsBar from "../components/DashboardActionsBar";
import '../style/dash.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const specificId = localStorage.getItem("specificId");
    async function fetchProfile() {
      setLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch(`http://localhost:8088/patients/id/${specificId}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        setProfile(data);
      } catch {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
      patientInfo: {
        ...profile.patientInfo,
        [e.target.name]: e.target.value
      }
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setSuccess("");
    const specificId = localStorage.getItem("specificId");
    const token = localStorage.getItem("accessToken");
    try {
      const body = {
        name: profile.patientInfo.name,
        phone: profile.patientInfo.phone,
        email: profile.patientInfo.email,
        password: profile.patientInfo.password,
        address: profile.patientInfo.address,
        birthDate: profile.birthDate,
        cin: profile.cin,
        insuranceNumber: profile.insuranceNumber,
        insuranceName: profile.insurance
      };
      await fetch(`http://localhost:8088/patients/${specificId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });
      setSuccess("Profile updated successfully!");
      toast.success("Profile updated successfully!", { autoClose: 2000 });
      setEdit(false);
    } catch {
      setError("Failed to update profile");
    }
  }

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>Profile not found</div>;

  return (
    <div style={{ height: "auto", display: "flex"  }}>
      <SideBar />
      <div style={{ flex: 1, background: "#", position: "relative", height: "auto"  , marginBottom:'7vh'}}>
        <DashboardActionsBar userName={profile.patientInfo.name} />
        <div className="container mx-auto p-6 max-w-3xl" style={{ marginTop: "40px" , width:'80%'}}>
          <div className="rounded-2xl shadow-lg p-10" style={{ background: 'linear-gradient(90deg, #f0f9ff 0%, #e0e7ff 100%)', borderRadius: '2rem', boxShadow: '0 4px 24px rgba(40,166,167,0.08)' }}>
            <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: '#28A6A7' , paddingTop:'3vh'  }}>My Profile</h2>
            {success && <div className="text-green-600 text-center mb-4">{success}</div>}
            {error && <div className="text-red-600 text-center mb-4">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div  style={{margin:'5vh' , display:'flex' , gap:'20vh' , alignItems:'center'  }}>
                <div className="space-y-6 min-w-0">
                  <div>
                    <label className="form-label">Full Name</label>
                    <input type="text" name="name" value={profile.patientInfo.name} disabled className="form-input" />
                  </div>
                  <div>
                    <label className="form-label">CIN</label>
                    <input type="text" name="cin" value={profile.cin} disabled className="form-input" />
                  </div>
                  <div>
                    <label className="form-label">Phone</label>
                    <input type="text" name="phone" value={profile.patientInfo.phone} onChange={handleChange}   className="form-input" />
                  </div>
                  <div>
                    <label className="form-label">Birth Date</label>
                    <input type="date" name="birthDate" value={profile.birthDate?.slice(0,10)} onChange={handleChange}  className="form-input" />
                  </div>
                  <div>
                    <label className="form-label">Email</label>
                    <input type="email" name="email" value={profile.patientInfo.email}  className="form-input" />
                  </div>
                  <div style={{color:'red' , fontSize:'15x' , marginBottom:'2vh' , marginTop:'3vh'}}>For security reasons, certain information is not editable !</div>
                </div>
                <div className="space-y-6 min-w-0 flex flex-col justify-between">
                  
                  <div>
                    <label className="form-label">Password</label>
                    <input type="password" name="password" value={profile.patientInfo.password} disabled className="form-input" />
                  </div>
                  <div>
                    <label className="form-label">Address</label>
                    <input type="text" name="address" value={profile.patientInfo.address} onChange={handleChange}  className="form-input" />
                  </div>
                  <div>
                    <label className="form-label">Insurance Number</label>
                    <input type="text" name="insuranceNumber" value={profile.insuranceNumber} onChange={handleChange}  className="form-input" />
                  </div>
                  <div>
                    <label className="form-label">Insurance Name</label>
                    <input type="text" name="insurance" value={profile.insurance} onChange={handleChange} disabled className="form-input" />
                  </div>
                  <div className="flex justify-center md:justify-end gap-4 mt-6">
                    {edit ? (
                      <>
                        <button type="submit" className="login-button">Update Profile</button>
                        <button type="button" onClick={() => setEdit(false)} className="login-button">Cancel</button>
                      </>
                    ) : (
                      <button type="button" onClick={() => setEdit(true)} className="login-button">Update profile</button>
                    )}
                  </div>
                </div>
              </div>
            </form>
            <ToastContainer position="top-center" autoClose={2000} />
          </div>
        </div>
      </div>
    </div>
  );
} 
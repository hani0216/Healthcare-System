import React, { useEffect, useState } from "react";
import SideBar from "../components/sideBar";
import DashboardActionsBar from "../components/DashboardActionsBar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function DoctorProfile() {
  const [profile, setProfile] = useState<any>(null);
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [specialities, setSpecialities] = useState<string[]>([]);

  useEffect(() => {
    const specificId = localStorage.getItem("specificId");
    async function fetchProfile() {
      setLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          throw new Error("No access token found");
        }
        const res = await fetch(`http://localhost:8088/doctors/${specificId}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        console.log("Profile data:", data); // Debug log
        if (!data.doctorInfo) {
          throw new Error("No doctor info in response");
        }
        setProfile(data.doctorInfo);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile");
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  useEffect(() => {
    async function fetchSpecialities() {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          throw new Error("No access token found");
        }
        const res = await fetch("http://localhost:8088/specialities", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        console.log("Specialities data:", data); // Debug log
        setSpecialities(data);
      } catch (error) {
        console.error("Failed to fetch specialities:", error);
        toast.error("Failed to load specialities");
      }
    }
    fetchSpecialities();
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); 
    setSuccess("");
    const specificId = localStorage.getItem("specificId");
    const token = localStorage.getItem("accessToken");
    
    if (!token) {
      setError("No access token found");
      return;
    }

    try {
      const body = {
        name: profile.name,
        phone: profile.phone,
        email: profile.email,
        password: profile.password,
        address: profile.address,
        speciality: profile.speciality,
        medicalLicenseNumber: profile.medicalLicenseNumber
      };
      console.log("Submitting profile update:", body); // Debug log

      const res = await fetch(`http://localhost:8088/doctors/${specificId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      setSuccess("Profile updated successfully!");
      toast.success("Profile updated successfully!", { autoClose: 2000 });
      setEdit(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile");
      toast.error("Failed to update profile");
    }
  }

  if (loading) {
    return (
      <div style={{ height: "auto", display: "flex" }}>
        <SideBar />
        <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={{ height: "auto", display: "flex" }}>
        <SideBar />
        <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div>Profile not found</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: "auto", display: "flex" }}>
      <SideBar />
      <div style={{ flex: 1, background: "#", position: "relative", height: "auto", marginBottom: '7vh' }}>
        <DashboardActionsBar userName={profile.name} />
        <div className="container mx-auto p-6 max-w-3xl" style={{ marginTop: "40px", width: '80%' }}>
          <div className="rounded-2xl shadow-lg p-10" style={{ background: 'linear-gradient(90deg, #f0f9ff 0%, #e0e7ff 100%)', borderRadius: '2rem', boxShadow: '0 4px 24px rgba(40,166,167,0.08)' }}>
            <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: '#28A6A7', paddingTop: '3vh' }}>My Profile</h2>
            {success && <div className="text-green-600 text-center mb-4">{success}</div>}
            {error && <div className="text-red-600 text-center mb-4">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div style={{ margin: '5vh', display: 'flex', gap: '20vh', alignItems: 'center' }}>
                <div className="space-y-6 min-w-0">
                  <div>
                    <label className="form-label">Full Name</label>
                    <input type="text" name="name" value={profile.name || ''} disabled className="form-input" />
                  </div>
                  <div>
                    <label className="form-label">Speciality</label>
                    <select 
                      name="speciality" 
                      value={profile.speciality || ''} 
                      onChange={handleChange}
                      disabled={!edit}
                      className="form-input"
                    >
                      {specialities.map((speciality) => (
                        <option key={speciality} value={speciality}>
                          {speciality}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Medical License Number</label>
                    <input 
                      type="text" 
                      name="medicalLicenseNumber" 
                      value={profile.medicalLicenseNumber || ''} 
                      disabled={!edit}
                      onChange={handleChange} 
                      className="form-input" 
                    />
                  </div>
                  <div>
                    <label className="form-label">Phone</label>
                    <input type="text" name="phone" value={profile.phone || ''} onChange={handleChange} className="form-input" />
                  </div>
                  <div>
                    <label className="form-label">Email</label>
                    <input type="email" name="email" value={profile.email || ''} className="form-input" />
                  </div>
                  <div style={{ color: 'red', fontSize: '15px', marginBottom: '2vh', marginTop: '3vh' }}>For security reasons, certain information is not editable !</div>
                </div>
                <div className="space-y-6 min-w-0 flex flex-col justify-between">
                  <div>
                    <label className="form-label">Password</label>
                    <input type="password" name="password" value={profile.password || ''} disabled className="form-input" />
                  </div>
                  <div>
                    <label className="form-label">Address</label>
                    <input type="text" name="address" value={profile.address || ''} onChange={handleChange} className="form-input" />
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
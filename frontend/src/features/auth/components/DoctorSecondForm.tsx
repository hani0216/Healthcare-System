import './LoginPage.css';
import { Link, useNavigate } from 'react-router-dom';  
import { useState, useEffect } from 'react';  
import { updateDoctor } from '../doctorService'; // Importer ta fonction updateDoctor

export default function PatientSecondForm() {
  const [formData, setFormData] = useState({
    phoneNumber: '',
    medicalLicenseNumber: '',
    speciality: '',
    address: '',
    userId: '', // Pour info si besoin
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [specialities, setSpecialities] = useState<string[]>([]);

  const navigate = useNavigate();

  const fetchSpecialities = async () => {
    try {
      const token = localStorage.getItem('accessToken');

      const response = await fetch('http://localhost:8088/doctors/specialities', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setSpecialities(data);
    } catch (error) {
      console.error('Error fetching specialities:', error);
      setErrorMessage('Error fetching specialities');
    }
  };

  useEffect(() => {
    fetchSpecialities();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('accessToken');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        setErrorMessage('Missing token or userId');
        return;
      }

      await updateDoctor(userId, formData, token);

      setSuccessMessage('Account updated successfully!');
      setErrorMessage('');

      // Ici tu peux rediriger ou faire ce qu’il faut après update

    } catch (error: any) {
      setErrorMessage('Error during update');
      setSuccessMessage('');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <div className="login-container" style={{ marginTop: '0vh' }}>
      <div className="login-card" style={{ marginTop: '15vh' }}>
        <h2 className="login-title">JUST A STEP !</h2>

        <form onSubmit={handleSubmit} className="login-form" style={{ marginTop: '0vh' }}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                className="form-input"
                placeholder="Enter your phone number"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Medical License Number</label>
              <input
                type="text"
                name="medicalLicenseNumber"
                className="form-input"
                placeholder="Enter your medical license number"
                value={formData.medicalLicenseNumber}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Speciality</label>
              <select
                name="speciality"
                className="form-input"
                value={formData.speciality}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Choose your speciality
                </option>
                {specialities.map((spec, idx) => (
                  <option key={idx} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Address</label>
              <input
                type="text"
                name="address"
                className="form-input"
                placeholder="Enter your address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="login-button" style={{ width: '64%', marginLeft: '70%' }}>
            Sign Up
          </button>
        </form>

        {successMessage && <p className="success-message">{successMessage}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <div className="forgot-password">
          <Link to="/login" className="forgot-link">
            Already have an account? Log In
          </Link>
        </div>
      </div>
    </div>
  );
}

import './LoginPage.css';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { updatePatient } from '../patientService';  
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function PatientSecondForm() {
  const [formData, setFormData] = useState({
    phone: '',
    address: '',
    birthDate: '',
    cin: '',
    insuranceNumber: '',
    insuranceName: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [insuranceProviders, setInsuranceProviders] = useState<any[]>([]);
  const [selectedInsuranceId, setSelectedInsuranceId] = useState<string>('');

  const navigate = useNavigate();

  const fetchInsuranceProviders = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('http://localhost:8088/insurance-admins', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInsuranceProviders(response.data);
    } catch (error) {
      setErrorMessage('Error fetching insurance providers');
      console.error(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const selectedInsurance = insuranceProviders.find((item) => String(item.id) === selectedInsuranceId);
    const insuranceCompany = selectedInsurance ? selectedInsurance.insuranceCompany : '';

    try {
      const payload = {
        phone: formData.phone,
        address: formData.address,
        birthDate: formData.birthDate,
        cin: Number(formData.cin),
        insuranceNumber: Number(formData.insuranceNumber),
        insuranceName: insuranceCompany,
      };

      const token = localStorage.getItem('accessToken');
      const userId = localStorage.getItem('userId');
      console.log('Payload:', payload);

      await updatePatient(userId, payload, token);

      // Récupérer et stocker les infos comme lors du login
      try {
        // userId est déjà dans le localStorage
        // Récupérer specificId
        const specificIdResponse = await axios.get(
          `http://localhost:8088/api/users/specific-id/${localStorage.getItem('email')}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        localStorage.setItem('specificId', specificIdResponse.data);

        // Récupérer userName et role
        const userDataResponse = await axios.get(
          `http://localhost:8088/api/users/email/${localStorage.getItem('email')}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (userDataResponse.data && userDataResponse.data.name) {
          localStorage.setItem('userName', userDataResponse.data.name);
        }
        if (userDataResponse.data && userDataResponse.data.role) {
          localStorage.setItem('role', userDataResponse.data.role);
        }
      } catch (e) {
        // Optionnel : log erreur
      }

      setSuccessMessage('');
      setErrorMessage('');

      toast.success('Sign up finished successfully !', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      setTimeout(() => {
        window.location.href = 'http://localhost:3000/patientHome';
      }, 3200);

    } catch (error) {
      setErrorMessage('Error updating patient information');
      setSuccessMessage('');
      console.error(error);
      toast.error('Failed to finish sign up.', {
        position: 'top-center',
        autoClose: 4000,
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'insuranceName') {
      setSelectedInsuranceId(value);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: ['cin', 'insuranceNumber'].includes(name) ? value.replace(/\D/g, '') : value,
      }));
    }
  };

  useEffect(() => {
    fetchInsuranceProviders();
  }, []);

  return (
    <div className="login-container" style={{ marginTop: '0vh' }}>
      <div className="login-card" style={{ marginTop: '15vh' }}>
        <h2 className="login-title">JUST A STEP !</h2>

        <form onSubmit={handleSubmit} className="login-form" style={{ marginTop: '0vh' }}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">ID Card Number</label>
              <input
                type="text"
                name="cin"
                className="form-input"
                placeholder="Enter your ID Card number"
                value={formData.cin}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Birth Date</label>
              <input
                type="date"
                name="birthDate"
                className="form-input"
                placeholder="Enter your birth date"
                value={formData.birthDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                name="phone"
                className="form-input"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Select Your Insurance Provider</label>
              <select
                name="insuranceName"
                className="form-input"
                value={selectedInsuranceId}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Choose your Insurance Provider
                </option>
                {insuranceProviders.map((provider, index) => (
                  <option key={provider.id} value={provider.id}>
                    {provider.userInfo.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Insurance Number</label>
              <input
                type="text"
                name="insuranceNumber"
                className="form-input"
                placeholder="Enter your Insurance number"
                value={formData.insuranceNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Address</label>
              <input
                type="text"
                name="address"
                className="form-input"
                placeholder="Enter your Address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="login-button" style={{ width: '64%', marginLeft: '70%' }}>
            Finish sign up
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
      <ToastContainer />
    </div>
  );
}

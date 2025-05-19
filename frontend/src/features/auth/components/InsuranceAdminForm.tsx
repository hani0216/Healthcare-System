import './LoginPage.css';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { updateInsuranceAdmin } from '../insuranceAdminService';  
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function InsuranceAdminForm() {
  const [formData, setFormData] = useState({
    phone: '',
    address: '',
    insuranceCompany: '',
    insuranceLicenseNumber: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('accessToken');
      const userId = localStorage.getItem('userId');

      if (!userId) {
        setErrorMessage('User ID missing');
        return;
      }

      await updateInsuranceAdmin(userId, formData, token || '');

      setSuccessMessage('');
      setErrorMessage('');

      toast.success('Sign up finished successfully!', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      setTimeout(() => {
        navigate('/login');
      }, 3200);

    } catch (error) {
      setErrorMessage('Error updating insurance admin information');
      setSuccessMessage('');
      console.error(error);
      toast.error('Failed to finish sign up.', {
        position: 'top-center',
        autoClose: 4000,
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
                name="phone"
                className="form-input"
                placeholder="Enter your phone number"
                value={formData.phone}
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
                placeholder="Enter your address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Insurance Company</label>
              <input
                type="text"
                name="insuranceCompany"
                className="form-input"
                placeholder="Enter insurance company name"
                value={formData.insuranceCompany}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Insurance License Number</label>
              <input
                type="text"
                name="insuranceLicenseNumber"
                className="form-input"
                placeholder="Enter insurance license number"
                value={formData.insuranceLicenseNumber}
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

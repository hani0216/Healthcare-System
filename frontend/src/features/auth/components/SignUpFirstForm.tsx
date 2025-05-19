import './LoginPage.css';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { signUp } from '../authService';
import { login } from '../loginService';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function SignUpForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    userId: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [progress, setProgress] = useState(0);

  const navigate = useNavigate();

  const calculateProgress = () => {
    const totalFields = 6;
    let filledFields = 0;
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'userId' && value !== '' && value !== undefined) filledFields++;
    });
    setProgress((filledFields / totalFields) * 100);
  };

  useEffect(() => {
    calculateProgress();
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match');
      setSuccessMessage('');
      return;
    }

    try {
      // 1. Signup sans token
      const signUpResponse = await signUp({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      if (!signUpResponse) {
        throw new Error('Signup failed');
      }

      setSuccessMessage('');
      setErrorMessage('');

      // 2. Login pour récupérer token après signup
      const loginResponse = await login({
        email: formData.email,
        password: formData.password,
      });

      localStorage.setItem('accessToken', loginResponse.accessToken);
      localStorage.setItem('refreshToken', loginResponse.refreshToken);

      // 3. Récupérer l'ID user en utilisant token
      const userIdResponse = await axios.get(
        `http://localhost:8088/api/users/specific-id/${formData.email}`,
        {
          headers: {
            Authorization: `Bearer ${loginResponse.accessToken}`,
          },
        }
      );

      const userId = userIdResponse.data;
      localStorage.setItem('userId', userId);

      // 4. Redirection selon rôle
      if (formData.role === 'doctor') {
        navigate('/doctorSignUp');
      } else if (formData.role === 'INSURANCE_ADMIN') {
        navigate('/insuranceSignUp');
      } else if (formData.role === 'patient') {
        navigate('/PatientSecondForm');
      }
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || 'Error during sign up process');
      setSuccessMessage('');
      console.error('Error during signup process:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="login-container" style={{ marginTop: '0vh' }}>
      <div className="login-card" style={{ marginTop: '15vh' }}>
        <h2 className="login-title">Create Your Account</h2>

        <form onSubmit={handleSubmit} className="login-form" style={{ marginTop: '0vh' }}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input
                type="text"
                name="firstName"
                className="form-input"
                placeholder="Enter your first name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                name="lastName"
                className="form-input"
                placeholder="Enter your last name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Define Your Role</label>
              <select
                name="role"
                className="form-input"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Choose your role</option>
                <option value="doctor">Doctor</option>
                <option value="patient">Patient</option>
                <option value="INSURANCE_ADMIN">Insurance Provider</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className="form-input"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                className="form-input"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="progress">
            <div
              className="progress-bar progress-bar-striped progress-bar-animated"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              style={{ width: `${progress}%`, backgroundColor: '#20c997', marginBottom: '2px' }}
            />
          </div>

          <button type="submit" className="login-button" style={{ width: '64%', marginLeft: '70%', marginTop: '5%' }}>
            Next ...
          </button>
        </form>

        {successMessage && <p className="success-message">{successMessage}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <div className="forgot-password">
          <Link to="/login" className="forgot-link">Already have an account? Log In</Link>
        </div>
      </div>
    </div>
  );
}

import './LoginPage.css'; // Import du fichier CSS
import { Link, useNavigate } from 'react-router-dom'; // Importation de Link et useNavigate pour redirection
import { useState, useEffect } from 'react'; // Importation de useState et useEffect pour gérer les entrées et effets
import axios from 'axios'; // Import d'axios pour faire des requêtes HTTP
import { signUp } from '../authService'; // Import de la fonction signUp

export default function PatientSecondForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '', // Pour l'assurance provider
    userId: '', // Ajout de l'ID utilisateur
    birthDate: '', // Ajout de la date de naissance
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [insuranceProviders, setInsuranceProviders] = useState<any[]>([]); // Liste des assureurs

  const navigate = useNavigate(); // Pour gérer la redirection après la connexion

  // Fonction pour récupérer l'ID de l'utilisateur via l'email
  const fetchUserId = async (email: string) => {
    try {
      const response = await axios.get(`http://localhost:8088/api/users/userId/${email}`);
      setFormData((prevData) => ({
        ...prevData,
        userId: response.data.id, // Stocke l'ID de l'utilisateur dans l'état
      }));
    } catch (error) {
      setErrorMessage('Error fetching user ID');
      console.error('Error fetching user ID:', error);
    }
  };

  // Fonction pour récupérer les assureurs depuis l'API
  const fetchInsuranceProviders = async () => {
    try {
      const response = await axios.get('http://localhost:8088/insurance-admins');
      const providers = response.data.map((item: any) => item.userInfo.name); // Récupérer les noms des assureurs
      setInsuranceProviders(providers); // Mettre à jour l'état avec la liste des assureurs
    } catch (error) {
      setErrorMessage('Error fetching insurance providers');
      console.error('Error fetching insurance providers:', error);
    }
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Vérification que les mots de passe correspondent
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match');
      setSuccessMessage('');
      return;
    }

    try {
      // Appel API pour l'inscription avec les données correspondant au DTO SignupRequest
      const response = await signUp(formData);  // Appel à l'API
      setSuccessMessage('Account created successfully!');
      setErrorMessage('');
      console.log('Form Submitted:', response); // Log de la réponse de l'API (optionnel)

      // Simuler que la réponse de l'API contient le rôle et l'ID du patient
      const { role, id } = response; // Ex: { role: 'doctor', id: '12345' }

      // Enregistre l'ID du patient dans localStorage
      localStorage.setItem('patientId', id);

      // Redirection basée sur le rôle
      if (role === 'DOCTOR') {
        navigate('/DoctorSecondForm');
      } else if (role === 'INSURANCE_ADMIN') {
        navigate('/InsuranceSecondForm');
      } else if (role === 'PATIENT') {
        navigate('/PatientSecondForm');
      }
    } catch (error: any) {
      setErrorMessage('Error during sign up');
      setSuccessMessage('');
    }
  };

  // Mise à jour des données du formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Utiliser useEffect pour récupérer l'ID lorsque l'email change
  useEffect(() => {
    if (formData.email) {
      fetchUserId(formData.email);
    }
  }, [formData.email]); // Utiliser l'email comme dépendance

  // Utiliser useEffect pour récupérer les assureurs lors du montage du composant
  useEffect(() => {
    fetchInsuranceProviders(); // Charger les assureurs depuis l'API
  }, []);

  return (
    <div className="login-container" style={{ marginTop: '0vh' }}>
      <div className="login-card" style={{ marginTop: '15vh' }}>
        {/* Formulaire d'inscription */}
        <h2 className="login-title">JUST A STEP !</h2>

        <form onSubmit={handleSubmit} className="login-form" style={{ marginTop: '0vh' }}>
          <div className="form-row">
            {/* ID Card Number */}
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

            {/* Birth Date */}
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
            {/* Email */}
            <div className="form-group">
              <label className="form-label">Phone Number</label>
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

            {/* Role */}
            <div className="form-group">
              <label className="form-label">Select Your Insurance Provider</label>
              <select
                name="role"
                className="form-input"
                value={formData.role} 
                onChange={handleChange} // Met à jour `formData.role` avec `handleChange`
                required
              >
                <option value="" disabled>Choose your Insurance Provider</option>
                {insuranceProviders.map((provider, index) => (
                  <option key={index} value={provider}>{provider}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            {/* Insurance number */}
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

            {/* Confirm Password */}
            <div className="form-group">
              <label className="form-label">Adress</label>
              <input
                type="text"
                name="Adress"
                className="form-input"
                placeholder="Enter your Adress"
                value={formData.adress}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="login-button" style={{ width: '64%', marginLeft: '70%' }}>
            Sign Up
          </button>
        </form>

        {/* Display success or error message */}
        {successMessage && <p className="success-message">{successMessage}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        {/* Link to Login Page */}
        <div className="forgot-password">
          <Link to="/login" className="forgot-link">Already have an account? Log In</Link>
        </div>
      </div>
    </div>
  );
}

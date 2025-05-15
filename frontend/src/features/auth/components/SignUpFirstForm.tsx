import './LoginPage.css'; // Import du fichier CSS
import { Link, useNavigate } from 'react-router-dom'; // Importation de Link et useNavigate pour redirection
import { useState, useEffect } from 'react'; // Importation de useState et useEffect pour gérer les entrées et effets
import axios from 'axios'; // Import d'axios pour faire des requêtes HTTP
import { signUp } from '../authService';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function SignUpForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    userId: '', // Ajout de l'ID utilisateur
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [progress, setProgress] = useState(0); // Ajout de l'état pour la progression
  
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
      setErrorMessage('');
    }
  };

  // Calcul de la progression basée sur les champs remplis
  const calculateProgress = () => {
    const totalFields = 6; // Il y a 6 champs dans le formulaire (excluant l'ID utilisateur)
    let filledFields = 0;

    // Compter les champs remplis
    Object.values(formData).forEach((value) => {
      if (value !== '' && value !== undefined) {
        filledFields += 1;
      }
    });

    // Calculer la progression en pourcentage
    setProgress((filledFields / totalFields) * 100);
  };

  // Mise à jour de la progression lorsque le formulaire change
  useEffect(() => {
    calculateProgress();
  }, [formData]); // Recalcule la progression chaque fois que formData change

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Vérification que les mots de passe correspondent
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match');
      setSuccessMessage('');
      return;
    }

    // Récupérer l'ID de l'utilisateur uniquement lorsque le formulaire est soumis
    if (formData.email) {
      await fetchUserId(formData.email);
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
        navigate('/doctorSignUp');
      } else if (role === 'INSURANCE_ADMIN') {
        navigate('/insuranceSignUp');
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

  return (
    <div className="login-container" style={{ marginTop: '0vh' }}>
      <div className="login-card" style={{ marginTop: '15vh' }}>
        {/* Formulaire d'inscription */}
        <h2 className="login-title">Create Your Account</h2>

        <form onSubmit={handleSubmit} className="login-form" style={{ marginTop: '0vh' }}>
          <div className="form-row">
            {/* First Name */}
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

            {/* Last Name */}
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
            {/* Email */}
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

            {/* Role */}
            <div className="form-group">
              <label className="form-label">Define Your Role</label>
              <select
                name="role"
                className="form-input"
                value={formData.role} // Utilise `value` ici
                onChange={handleChange} // Met à jour `formData.role` avec `handleChange`
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
            {/* Password */}
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

            {/* Confirm Password */}
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

          {/* Progress Bar */}
          <div className="progress">
            <div
              className="progress-bar progress-bar-striped progress-bar-animated"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin="0"
              aria-valuemax="100"
              style={{ width: `${progress}%`, backgroundColor: '#20c997', marginBottom: '2px'  }}
            ></div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="login-button" style={{ width: '64%', marginLeft: '70%' , marginTop:'5%'}}>
            Next ... 
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

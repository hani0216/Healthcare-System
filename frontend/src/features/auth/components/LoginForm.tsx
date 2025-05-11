import './LoginPage.css'; // Import du fichier CSS
import corilus from '../../../assets/corilus.png'

export default function LoginPage() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Logique de connexion ici
  };

  return (
    <div className="login-container" > 
    <div ></div>
        <div className='logoSection' > 
            
        </div>
      <div className="login-card"  >
        <div style={{backgroundColor:'red' , position:'relative' , width:'10%'}}></div>
        <img src={corilus} alt="Logo-Corilus"  style={{width:'100%', height:'15vh' , marginBottom:'5vh'}}/>
        <h2 className="login-title">Welcome Back !</h2>

        <form onSubmit={handleSubmit} className="login-form"   >
            
          <div className="form-group" >
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter your username"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="login-button">
            Login
          </button>
        </form>

        <div className="forgot-password">
          <a href="#" className="forgot-link">Forgot password?</a>
        </div>
      </div>
    </div>
  );
}
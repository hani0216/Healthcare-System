import LoginForm from "../components/LoginForm";
import RightSideBar from "../components/RightSideBar"
import DoctorImg from "../../../assets/doctor.png"


export default function LoginPage() {
    return (
        <div   style={{

            
        }}>
            <RightSideBar  ></RightSideBar>
            
             <img 
                        src={DoctorImg}
                        alt="Doctor PNG"
                        style={{
                        display: 'grid', 
                        width: '30%',
                        objectFit: 'contain', 
                        position: 'absolute',  
                        bottom: '0%',  
                        border: 'none',
                        clipPath: 'inset(5px 5px 0px 5px)',
                        left: '50%',
                        zIndex: 2,
                        
               
                       
                        }}
                        
    
                        />
                <LoginForm ></LoginForm>
        </div>
    );
}

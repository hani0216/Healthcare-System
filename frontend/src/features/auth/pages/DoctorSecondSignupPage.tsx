import RightSideBar from '../components/RightSideBar';
import DoctorImg from '../../../assets/doctor.png';
import DoctorSecondForm from '../components/DoctorSecondForm'

export default function DoctorSecondSignupPage() {
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
                <DoctorSecondForm />
        </div>
  );
}

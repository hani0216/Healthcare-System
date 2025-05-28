import React from 'react';
import { FaBrain, FaArrowRight } from 'react-icons/fa';
import '../style/doctorSpeciality.css'

type DoctorSpecialityCardProps = {
  name: string;
  desc: string;
  onClick: () => void;
};

const DoctorSpecialityCard: React.FC<DoctorSpecialityCardProps> = ({ name, desc, onClick }) => {
  return (
    <div className="card-hover-effect" style={{ height:'340px' , width:'300px' , borderRadius:'20px'}}>
<div  style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%)'   }}>
        <div className="card-icon bg-green-500 text-white p-4 rounded-full w-16 h-16 flex items-center justify-center shadow-lg" style={{
            background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%)' , 
        }}>
            <div style={{backgroundColor:'#22c55e' , width:'70px' , height:'70px' , display: 'flex',
  justifyContent: 'center', // centre horizontalement
  alignItems: 'center' , borderRadius:'50%'}}>
                          <FaBrain className="text-2xl"  style={{backgroundColor:'#22c55e'  , borderRadius:'20%' , width:'50px' , height:"40px" , margin:'20px'}}/>

            </div>
        </div>
      </div>
      <div className="p-5 flex-grow" style={{ height:'50%'}}>
        <h3 className="name" style={{ margin:'0px' , padding:'0px'}}>{name}</h3>
        <p className="desc">{desc}</p>
      </div>
      <div className="px-5 pb-5" style={{ height:'20px'}}>
        <button
          onClick={onClick}
          className="btn"
        >
          <span>Show doctors</span>
          <FaArrowRight className="ml-2" />
        </button>
      </div>
    </div>
  );
};

export default DoctorSpecialityCard;

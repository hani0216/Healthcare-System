import Rectangle5 from '../../../assets/Rectangle5.png';
import Rectangle6 from '../../../assets/Rectangle6.png';

export default function Rectangles() {
  return (
    <div  style={{display:'flex' , justifyContent:'center' , gap:'0%'} }>
      <img src={Rectangle5} alt="Rectangle 5" style={{width:'5vh' , color:'#656ED3'}} />
      <img src={Rectangle6} alt="Rectangle 6" style={{width:'5vh' , color:'#656ED3'}} />
    </div>
  );
}

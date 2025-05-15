import group1 from '../../../assets/Group1.png'
 

export default function RightSideBar() {
  return (
    <div>
      <div 
        className='right-section' 
        style={{ 
          backgroundColor: '#AEE0DF',
          width: '34%',
          right: '0%',
          top: '0%',
          bottom: '0%',
          height: '100vh',
          margin: 0,
          padding: 0,
          overflow: 'hidden',
          flex: 1,
          position: 'absolute',
          zIndex: 1 ,
          marginLeft:'0%'  ,
        paddingLeft: '0%'      }}
      >
        <img src={group1} alt="group1"  style={{marginLeft:'45%' , marginTop:'15%'}}/>
      </div>
    </div>
  );
}
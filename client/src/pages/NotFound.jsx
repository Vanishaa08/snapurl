import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div style={{minHeight:'100vh',display:'flex',flexDirection:'column',
      alignItems:'center',justifyContent:'center',background:'#f9fafb',fontFamily:'sans-serif'}}>
      <h1 style={{fontSize:'6rem',fontWeight:'700',color:'#4f46e5',margin:0}}>404</h1>
      <p style={{fontSize:'1.2rem',color:'#6b7280',margin:'8px 0 24px'}}>
        Page not found
      </p>
      <button onClick={() => navigate('/')}
        style={{background:'#4f46e5',color:'white',padding:'10px 24px',
          borderRadius:'8px',border:'none',cursor:'pointer',fontSize:'14px'}}>
        Go home
      </button>
    </div>
  );
}
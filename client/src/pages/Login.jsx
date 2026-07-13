import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin]   = useState(true);
  const [error, setError]       = useState('');

const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  try {
    isLogin ? await login(email, password) : await register(email, password);
    window.location.href = '/dashboard';
  } catch (err) {
    setError(err.response?.data?.error || 'Something went wrong');
  }
};
  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#f9fafb'}}>
      <div style={{background:'white',padding:'2rem',borderRadius:'12px',border:'1px solid #e5e7eb',width:'100%',maxWidth:'360px'}}>
        <h1 style={{fontSize:'1.5rem',fontWeight:'600',marginBottom:'1.5rem'}}>
          {isLogin ? 'Sign in' : 'Create account'}
        </h1>
        <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
          <input style={{border:'1px solid #d1d5db',borderRadius:'8px',padding:'8px 12px',fontSize:'14px'}}
            type="email" placeholder="Email"
            value={email} onChange={e => setEmail(e.target.value)} required />
          <input style={{border:'1px solid #d1d5db',borderRadius:'8px',padding:'8px 12px',fontSize:'14px'}}
            type="password" placeholder="Password"
            value={password} onChange={e => setPassword(e.target.value)} required />
          {error && <p style={{color:'red',fontSize:'14px'}}>{error}</p>}
          <button style={{background:'#4f46e5',color:'white',padding:'10px',borderRadius:'8px',border:'none',cursor:'pointer',fontSize:'14px',fontWeight:'500'}}>
            {isLogin ? 'Sign in' : 'Register'}
          </button>
        </form>
        <p style={{fontSize:'14px',textAlign:'center',marginTop:'1rem',color:'#6b7280'}}>
          {isLogin ? "Don't have an account? " : "Already have one? "}
          <button style={{color:'#4f46e5',background:'none',border:'none',cursor:'pointer'}} onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Register' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
}
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import api from '../services/api';

export default function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [url, setUrl]         = useState('');
  const [result, setResult]   = useState(null);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast]     = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const handleShorten = async (e) => {
    e.preventDefault();
    setError(''); setResult(null); setLoading(true);
    try {
      const { data } = await api.post('/urls', { originalUrl: url });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally { setLoading(false); }
  };

  const copy = () => {
    navigator.clipboard.writeText(result.shortUrl);
    showToast('Link copied!');
  };

  return (
    <div style={{minHeight:'100vh',background:'#f9fafb',fontFamily:'sans-serif'}}>

      {/* Toast */}
      {toast && (
        <div style={{position:'fixed',top:'20px',right:'20px',background:'#1a1a1a',color:'white',
          padding:'10px 18px',borderRadius:'8px',fontSize:'14px',zIndex:999}}>
          {toast}
        </div>
      )}

      {/* Navbar */}
      <nav style={{background:'white',borderBottom:'1px solid #e5e7eb',padding:'14px 32px',
        display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <span style={{fontWeight:'700',fontSize:'1.2rem',color:'#4f46e5'}}>SnapURL</span>
        <div style={{display:'flex',gap:'10px'}}>
          {user ? (
            <>
              <button onClick={() => navigate('/dashboard')}
                style={{padding:'7px 16px',borderRadius:'8px',border:'1px solid #e5e7eb',
                  background:'white',cursor:'pointer',fontSize:'14px'}}>
                Dashboard
              </button>
              <button onClick={() => { logout(); navigate('/'); }}
                style={{padding:'7px 16px',borderRadius:'8px',border:'none',
                  background:'#4f46e5',color:'white',cursor:'pointer',fontSize:'14px'}}>
                Logout
              </button>
            </>
          ) : (
            <button onClick={() => navigate('/login')}
              style={{padding:'7px 16px',borderRadius:'8px',border:'none',
                background:'#4f46e5',color:'white',cursor:'pointer',fontSize:'14px'}}>
              Sign in
            </button>
          )}
        </div>
      </nav>

      {/* Hero */}
      <div style={{display:'flex',flexDirection:'column',alignItems:'center',
        justifyContent:'center',padding:'60px 20px 40px'}}>
        <h1 style={{fontSize:'2.2rem',fontWeight:'700',textAlign:'center',marginBottom:'8px',color:'#111'}}>
          Shorten any URL instantly
        </h1>
        <p style={{color:'#6b7280',marginBottom:'32px',textAlign:'center',fontSize:'15px'}}>
          Fast redirects · Real-time analytics · QR codes
        </p>

        {/* Form */}
        <form onSubmit={handleShorten}
          style={{display:'flex',gap:'8px',width:'100%',maxWidth:'620px'}}>
          <input
            style={{flex:1,border:'1px solid #d1d5db',borderRadius:'8px',
              padding:'12px 16px',fontSize:'15px',outline:'none'}}
            type="url" placeholder="Paste your long URL here..."
            value={url} onChange={e => setUrl(e.target.value)} required />
          <button
            style={{background:'#4f46e5',color:'white',padding:'12px 24px',
              borderRadius:'8px',border:'none',cursor:'pointer',fontWeight:'600',
              fontSize:'15px',opacity:loading?0.7:1}}
            disabled={loading}>
            {loading ? '...' : 'Shorten'}
          </button>
        </form>

        {error && (
          <p style={{color:'#ef4444',marginTop:'12px',fontSize:'14px'}}>{error}</p>
        )}

        {/* Result card */}
        {result && (
          <div style={{marginTop:'24px',background:'white',border:'1px solid #e5e7eb',
            borderRadius:'12px',padding:'20px 24px',width:'100%',maxWidth:'620px'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'16px'}}>
              <div>
                <p style={{fontSize:'12px',color:'#6b7280',marginBottom:'4px'}}>Your short URL</p>
                <a href={result.shortUrl} target="_blank" rel="noreferrer"
                  style={{color:'#4f46e5',fontWeight:'600',fontSize:'16px'}}>
                  {result.shortUrl}
                </a>
              </div>
              <button onClick={copy}
                style={{padding:'8px 18px',borderRadius:'8px',border:'1px solid #d1d5db',
                  background:'white',cursor:'pointer',fontSize:'13px',fontWeight:'500'}}>
                Copy
              </button>
            </div>

            {/* QR Code */}
            <div style={{borderTop:'1px solid #f3f4f6',paddingTop:'16px',
              display:'flex',flexDirection:'column',alignItems:'center',gap:'8px'}}>
              <p style={{fontSize:'12px',color:'#6b7280'}}>Scan QR code</p>
              <QRCodeSVG value={result.shortUrl} size={140} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
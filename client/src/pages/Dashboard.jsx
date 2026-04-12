import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

export default function Dashboard() {
  const { logout } = useAuth();
  const navigate   = useNavigate();
  const [urls, setUrls]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast]   = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const fetchUrls = async () => {
    try {
      const { data } = await api.get('/urls/my');
      setUrls(data);
    } catch { navigate('/login'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUrls(); }, []);

  const copy = (shortUrl) => {
    navigator.clipboard.writeText(shortUrl);
    showToast('Copied!');
  };

  const deleteUrl = async (shortCode) => {
    try {
      await api.delete(`/urls/${shortCode}`);
      setUrls(urls.filter(u => u.shortCode !== shortCode));
      showToast('URL deleted');
    } catch { showToast('Delete failed'); }
  };

  return (
    <div style={{minHeight:'100vh',background:'#f9fafb',fontFamily:'sans-serif'}}>

      {toast && (
        <div style={{position:'fixed',top:'20px',right:'20px',background:'#1a1a1a',
          color:'white',padding:'10px 18px',borderRadius:'8px',fontSize:'14px',zIndex:999}}>
          {toast}
        </div>
      )}

      {/* Navbar */}
      <nav style={{background:'white',borderBottom:'1px solid #e5e7eb',padding:'14px 32px',
        display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <span style={{fontWeight:'700',fontSize:'1.2rem',color:'#4f46e5',cursor:'pointer'}}
          onClick={() => navigate('/')}>SnapURL</span>
        <div style={{display:'flex',gap:'10px'}}>
          <button onClick={() => navigate('/')}
            style={{padding:'7px 16px',borderRadius:'8px',border:'1px solid #e5e7eb',
              background:'white',cursor:'pointer',fontSize:'14px'}}>
            Shorten
          </button>
          <button onClick={() => { logout(); navigate('/'); }}
            style={{padding:'7px 16px',borderRadius:'8px',border:'none',
              background:'#4f46e5',color:'white',cursor:'pointer',fontSize:'14px'}}>
            Logout
          </button>
        </div>
      </nav>

      <div style={{maxWidth:'800px',margin:'0 auto',padding:'32px 20px'}}>
        <h1 style={{fontSize:'1.5rem',fontWeight:'700',marginBottom:'24px',color:'#111'}}>
          My URLs
        </h1>

        {loading && <p style={{color:'#6b7280'}}>Loading...</p>}

        {!loading && urls.length === 0 && (
          <div style={{textAlign:'center',padding:'60px',background:'white',
            borderRadius:'12px',border:'1px solid #e5e7eb'}}>
            <p style={{color:'#6b7280',marginBottom:'16px'}}>No URLs yet</p>
            <button onClick={() => navigate('/')}
              style={{background:'#4f46e5',color:'white',padding:'10px 20px',
                borderRadius:'8px',border:'none',cursor:'pointer'}}>
              Shorten your first URL
            </button>
          </div>
        )}

        {urls.map(u => (
          <div key={u._id} style={{background:'white',border:'1px solid #e5e7eb',
            borderRadius:'12px',padding:'16px 20px',marginBottom:'12px'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
              <div style={{flex:1,minWidth:0}}>
                <a href={`http://localhost:5000/${u.shortCode}`} target="_blank" rel="noreferrer"
                  style={{color:'#4f46e5',fontWeight:'600',fontSize:'15px'}}>
                  localhost:5000/{u.shortCode}
                </a>
                <p style={{color:'#6b7280',fontSize:'13px',marginTop:'4px',
                  overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                  {u.originalUrl}
                </p>
                {u.expiresAt && (
                  <p style={{color:'#f59e0b',fontSize:'12px',marginTop:'4px'}}>
                    Expires: {new Date(u.expiresAt).toLocaleDateString()}
                  </p>
                )}
              </div>

              {/* UPDATED BUTTONS DIV */}
              <div style={{display:'flex',gap:'8px',marginLeft:'12px'}}>
                
                <button onClick={() => navigate(`/analytics/${u.shortCode}`)}
                  style={{padding:'6px 14px',borderRadius:'6px',border:'1px solid #c7d2fe',
                    background:'#eef2ff',color:'#4f46e5',cursor:'pointer',fontSize:'13px'}}>
                  Analytics
                </button>

                <button onClick={() => copy(`http://localhost:5000/${u.shortCode}`)}
                  style={{padding:'6px 14px',borderRadius:'6px',border:'1px solid #d1d5db',
                    background:'white',cursor:'pointer',fontSize:'13px'}}>
                  Copy
                </button>

                <button onClick={() => deleteUrl(u.shortCode)}
                  style={{padding:'6px 14px',borderRadius:'6px',border:'1px solid #fecaca',
                    background:'#fef2f2',color:'#ef4444',cursor:'pointer',fontSize:'13px'}}>
                  Delete
                </button>

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
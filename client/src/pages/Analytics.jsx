import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useSocket } from '../hooks/useSocket';
import api from '../services/api';

const COLORS = ['#4f46e5', '#7c3aed', '#db2777', '#ea580c', '#16a34a'];

export default function Analytics() {
  const { shortCode } = useParams();
  const navigate      = useNavigate();
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const { data } = await api.get(`/analytics/${shortCode}`);
      setData(data);
    } catch { navigate('/dashboard'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  // Real-time update — refetch on new click
  useSocket(shortCode, () => fetchData());

  if (loading) return <p style={{padding:'2rem'}}>Loading...</p>;
  if (!data)   return null;

  return (
    <div style={{minHeight:'100vh',background:'#f9fafb',fontFamily:'sans-serif'}}>
      <nav style={{background:'white',borderBottom:'1px solid #e5e7eb',padding:'14px 32px',
        display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <span style={{fontWeight:'700',fontSize:'1.2rem',color:'#4f46e5',cursor:'pointer'}}
          onClick={() => navigate('/')}>SnapURL</span>
        <button onClick={() => navigate('/dashboard')}
          style={{padding:'7px 16px',borderRadius:'8px',border:'1px solid #e5e7eb',
            background:'white',cursor:'pointer',fontSize:'14px'}}>
          Dashboard
        </button>
      </nav>

      <div style={{maxWidth:'900px',margin:'0 auto',padding:'32px 20px'}}>
        <h1 style={{fontSize:'1.5rem',fontWeight:'700',marginBottom:'8px'}}>
          Analytics — {shortCode}
        </h1>

        {/* Stats cards */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'16px',marginBottom:'32px'}}>
          {[
            { label:'Total clicks', value: data.totalClicks },
            { label:'Countries',    value: data.byCountry.length },
            { label:'Devices',      value: data.byDevice.length }
          ].map(card => (
            <div key={card.label} style={{background:'white',border:'1px solid #e5e7eb',
              borderRadius:'12px',padding:'20px'}}>
              <p style={{color:'#6b7280',fontSize:'13px',marginBottom:'4px'}}>{card.label}</p>
              <p style={{fontSize:'2rem',fontWeight:'700',color:'#4f46e5'}}>{card.value}</p>
            </div>
          ))}
        </div>

        {/* Clicks over time */}
        <div style={{background:'white',border:'1px solid #e5e7eb',borderRadius:'12px',
          padding:'20px',marginBottom:'20px'}}>
          <h2 style={{fontSize:'15px',fontWeight:'600',marginBottom:'16px'}}>Clicks over time</h2>
          {data.clicksByDay.length === 0
            ? <p style={{color:'#6b7280',fontSize:'14px'}}>No data yet — click your short URL to generate analytics</p>
            : <ResponsiveContainer width="100%" height={200}>
                <LineChart data={data.clicksByDay.map(d => ({ date: d._id, clicks: d.count }))}>
                  <XAxis dataKey="date" tick={{fontSize:12}} />
                  <YAxis tick={{fontSize:12}} />
                  <Tooltip />
                  <Line type="monotone" dataKey="clicks" stroke="#4f46e5" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
          }
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px'}}>
          {/* Top countries */}
          <div style={{background:'white',border:'1px solid #e5e7eb',borderRadius:'12px',padding:'20px'}}>
            <h2 style={{fontSize:'15px',fontWeight:'600',marginBottom:'16px'}}>Top countries</h2>
            {data.byCountry.length === 0
              ? <p style={{color:'#6b7280',fontSize:'14px'}}>No data yet</p>
              : <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={data.byCountry.map(d => ({ name: d._id, clicks: d.count }))}>
                    <XAxis dataKey="name" tick={{fontSize:12}} />
                    <YAxis tick={{fontSize:12}} />
                    <Tooltip />
                    <Bar dataKey="clicks" fill="#4f46e5" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
            }
          </div>

          {/* Device breakdown */}
          <div style={{background:'white',border:'1px solid #e5e7eb',borderRadius:'12px',padding:'20px'}}>
            <h2 style={{fontSize:'15px',fontWeight:'600',marginBottom:'16px'}}>Device breakdown</h2>
            {data.byDevice.length === 0
              ? <p style={{color:'#6b7280',fontSize:'14px'}}>No data yet</p>
              : <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={data.byDevice.map(d => ({ name: d._id, value: d.count }))}
                      dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                      {data.byDevice.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
            }
          </div>
        </div>
      </div>
    </div>
  );
}
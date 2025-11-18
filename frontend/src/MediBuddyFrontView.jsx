import React, { useEffect, useState } from 'react';

// MediBuddy Position Management — Website Front View (Fixed JSX & Futuristic Hero)
// Cleaned, pure-JS React component (no TypeScript annotations) with balanced JSX tags.
// This version fixes the previous JSX syntax error (incorrect comment braces) and keeps
// the futuristic hero, animated elements, Merriweather font usage, and lifecycle steps.

export default function MediBuddyFrontView() {
  const [positions, setPositions] = useState([]);
  const [filterDept, setFilterDept] = useState('All');
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDept, setNewDept] = useState('Engineering');
  const [search, setSearch] = useState('');

  // brand colors
  const brand = {
    blue: '#1A73E8',
    teal: '#00B8A9',
    gradient: 'linear-gradient(135deg, #1A73E8 0%, #00B8A9 100%)'
  };

  useEffect(() => {
    const seed = [
      { id: '1', code: 'MB-ENG-001', title: 'Senior Backend Engineer', department: 'Engineering', location: 'Bengaluru', status: 'Vacant', budget: 2500000, req: 'REQ-1001' },
      { id: '2', code: 'MB-PRO-002', title: 'Product Manager', department: 'Product', location: 'Remote', status: 'Filled', budget: 1800000, req: 'REQ-1002' },
      { id: '3', code: 'MB-OPS-003', title: 'Operations Lead', department: 'Operations', location: 'Chennai', status: 'Approved', budget: 1500000, req: null },
      { id: '4', code: 'MB-ENG-004', title: 'Frontend Engineer', department: 'Engineering', location: 'Mumbai', status: 'Proposed', budget: 1600000, req: null }
    ];
    setPositions(seed);
  }, []);

  const departments = ['All','Engineering','Product','Operations','Sales','Finance','HR','Clinical','Tech Support'];

  function filtered() {
    return positions.filter(p => (filterDept === 'All' || p.department === filterDept) && (!search || p.title.toLowerCase().includes(search.toLowerCase()) || p.code.toLowerCase().includes(search.toLowerCase())));
  }

  function createPosition() {
    if (!newTitle.trim()) return;
    const id = Date.now().toString();
    const deptKey = newDept.substring(0,3).toUpperCase();
    const idx = positions.filter(p=>p.department===newDept).length + 1;
    const code = 'MB-' + deptKey + '-' + String(idx).padStart(3,'0');
    const p = { id, code, title: newTitle, department: newDept, location: 'Remote', status: 'Proposed', budget: null, req: null };
    setPositions(prev=>[p,...prev]);
    setShowCreate(false); setNewTitle(''); setNewDept('Engineering');
  }

  function markFilled(id) {
    setPositions(prev => prev.map(p => p.id===id ? Object.assign({}, p, { status: 'Filled' }) : p));
  }

  // animated count-up helper for metrics
  function useAnimatedNumber(value, duration = 800) {
    const [display, setDisplay] = useState(0);
    useEffect(() => {
      let raf = null;
      const start = performance.now();
      const from = display;
      function step(now){
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        setDisplay(Math.round(from + (value - from) * eased));
        if (t < 1) raf = requestAnimationFrame(step);
      }
      raf = requestAnimationFrame(step);
      return () => { if (raf) cancelAnimationFrame(raf); };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);
    return display;
  }

  // Metrics
  const total = positions.length;
  const filled = positions.filter(p=>p.status==='Filled').length;
  const vacant = positions.filter(p=>p.status==='Vacant').length;
  const open = positions.filter(p=>p.status!=='Filled' && p.status!=='Retired').length;
  const totalAnim = useAnimatedNumber(total);
  const filledAnim = useAnimatedNumber(filled);
  const vacantAnim = useAnimatedNumber(vacant);
  const openAnim = useAnimatedNumber(open);

  function StatusPill(props) {
    const s = (props.status||'').toLowerCase();
    if (s==='vacant') return (<span style={{display:'inline-block',padding:'6px 10px',borderRadius:999,background:'#fff0f0',color:'#ef4444',fontWeight:700}}>Vacant</span>);
    if (s==='proposed') return (<span style={{display:'inline-block',padding:'6px 10px',borderRadius:999,background:'#fffbeb',color:'#b45309',fontWeight:700}}>Proposed</span>);
    if (s==='approved') return (<span style={{display:'inline-block',padding:'6px 10px',borderRadius:999,background:'#ecfeff',color:'#0369a1',fontWeight:700}}>Approved</span>);
    if (s==='filled') return (<span style={{display:'inline-block',padding:'6px 10px',borderRadius:999,background:'#ecfdf5',color:'#047857',fontWeight:700}}>Filled</span>);
    return (<span style={{display:'inline-block',padding:'6px 10px',borderRadius:999,background:'#f8fafc',color:'#64748b',fontWeight:700}}>{props.status}</span>);
  }

  function MetricCard(props){
    return (
      <div style={{background:'white',padding:16,borderRadius:12,display:'flex',gap:12,alignItems:'center',boxShadow: '0 0 28px rgba(0,184,169,0.55), 0 0 48px rgba(26,115,232,0.45)'}}>
        <div style={{width:56,height:56,borderRadius:12,background:'linear-gradient(135deg, rgba(26,115,232,0.12), rgba(0,184,169,0.08))',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22}}>{props.icon}</div>
        <div>
          <div style={{fontSize:13,color:'#64748B'}}>{props.title}</div>
          <div style={{fontSize:22,fontWeight:800}}>{props.value}</div>
        </div>
      </div>
    );
  }

  function FloatingStep(props){
    return (
      <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:8, animation: 'floaty 4s ease-in-out infinite'}}>
        <div style={{width:88,height:88,borderRadius:16,background:props.color + '22',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{width:56,height:56,borderRadius:12,background:props.color,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800}}>{props.label[0]}</div>
        </div>
        <div style={{fontWeight:700}}>{props.label}</div>
      </div>
    );
  }

  function FancyArrow(){
    return (
      <div style={{width:48,height:2,background:'linear-gradient(90deg, rgba(26,115,232,0.9), rgba(0,184,169,0.8))',borderRadius:2}}></div>
    );
  }

  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(to bottom, #ffffff, #f8fafc)',color:'#0f172a',fontFamily: 'Merriweather, serif'}}>
      <style>{`
        @keyframes floaty { 0%{transform:translateY(0)}50%{transform:translateY(-6px)}100%{transform:translateY(0)} }
        @keyframes neonscan { 0%{transform:translateX(-200%)} 50%{transform:translateX(100%)} 100%{transform:translateX(200%)} }
        .row-hover { transition: transform 180ms ease, box-shadow 180ms ease; }
        .row-hover:hover { transform: translateY(-4px); box-shadow: 0 8px 20px rgba(15,23,42,0.06); }
      `}</style>

      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        height: '64px',
        padding: '0 20px',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        background: 'linear-gradient(90deg, rgba(26,115,232,0.22), rgba(0,184,169,0.14))',
        boxShadow: '0 6px 30px rgba(0,0,0,0.12), 0 0 28px rgba(0,184,169,0.10)',
        borderBottom: '1px solid rgba(26,115,232,0.28)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 999,
        transition: 'backdrop-filter 300ms ease, box-shadow 300ms ease'
      }}>
        {/* Left: brand + compact nav */}
        <div style={{display:'flex',alignItems:'center',gap:14}}>
          <div style={{width:44,height:44,borderRadius:10,background:'rgba(255,255,255,0.06)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'inset 0 1px 0 rgba(255,255,255,0.06)'}}>
            <div style={{width:36,height:36,borderRadius:8,background:'linear-gradient(135deg,#1A73E8,#00B8A9)',display:'flex',alignItems:'center',justifyContent:'center',color:brand.blue,fontWeight:800}}>MB</div>
          </div>
          <div style={{display:'flex',flexDirection:'column'}}>
            <div style={{fontSize:15,fontWeight:800,color:brand.blue,letterSpacing:0.4}}>MediBuddy</div>
            <div style={{fontSize:11,color:brand.blue}}>Position Management</div>
          </div>
          <nav style={{display:'flex',gap:8,marginLeft:18}}>
            <button style={{background:'transparent',border:'none',color:brand.blue,padding:'8px 10px',borderRadius:8}}>Dashboard</button>
            <button style={{background:'transparent',border:'none',color:brand.blue,padding:'8px 10px',borderRadius:8}}>Positions</button>
            <button style={{background:'transparent',border:'none',color:brand.blue,padding:'8px 10px',borderRadius:8}}>Approvals</button>
          </nav>
        </div>

        {/* Center: compact search */}
        <div style={{flex:1,display:'flex',justifyContent:'center',padding:'0 20px'}}>
          <div style={{width:'100%',maxWidth:640,display:'flex',alignItems:'center',gap:8,background:'rgba(255,255,255,0.04)',padding:'8px 12px',borderRadius:12,border:'1px solid rgba(255,255,255,0.05)'}}>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search roles, codes, candidates..." style={{flex:1,background:'transparent',border:'none',outline:'none',color:brand.blue,fontSize:13}} />
            <button style={{background:'linear-gradient(90deg,#00B8A9,#1A73E8)',border:'none',padding:'8px 12px',borderRadius:10,color:'white',fontWeight:700}}>Search</button>
          </div>
        </div>

        {/* Right: quick actions + profile */}
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <button title="New Position" onClick={()=>setShowCreate(true)} style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.04)',padding:'8px 10px',borderRadius:10,color:brand.blue,fontWeight:700}}>+ New</button>
          <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',marginRight:8}}>
            <div style={{fontSize:12,color:brand.blue}}>Trakstar Sync</div>
            <div style={{display:'inline-flex',alignItems:'center',gap:6, padding:'4px 8px', borderRadius:20, background:'rgba(255,255,255,0.06)', color:brand.blue, fontSize:12}}><span style={{width:8,height:8,borderRadius:999,background:'#34D399',display:'inline-block'}}></span> Live</div>
          </div>
          <div style={{width:40,height:40,borderRadius:999,background:'linear-gradient(135deg,#00B8A9,#1A73E8)',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontWeight:800}}>PR</div>
        </div>
      </header>

      <div style={{maxWidth:1200, margin:'120px auto', display:'grid', gridTemplateColumns:'220px 1fr', gap:20, padding:'0 16px'}}>

        <aside>
          <div style={{background:'white',padding:14,borderRadius:12,boxShadow:'0 6px 18px rgba(15,23,42,0.04)'}}>
            <div style={{fontWeight:700,marginBottom:8,color:'#334155'}}>Navigation</div>
            <ul style={{listStyle:'none',padding:0,margin:0,display:'flex',flexDirection:'column',gap:6}}>
              <li style={{padding:'10px 12px',borderRadius:8,background:'rgba(26,115,232,0.08)',color:brand.blue,fontWeight:700}}>Dashboard</li>
              <li style={{padding:'10px 12px',borderRadius:8}}>Positions</li>
              <li style={{padding:'10px 12px',borderRadius:8}}>Approvals</li>
              <li style={{padding:'10px 12px',borderRadius:8}}>Integrations</li>
            </ul>
          </div>

          <div style={{background:'white',padding:14,borderRadius:12,boxShadow:'0 6px 18px rgba(15,23,42,0.04)',marginTop:16}}>
            <div style={{fontWeight:700,marginBottom:8,color:'#334155'}}>Actions</div>
            <button onClick={()=>setShowCreate(true)} style={{width:'100%',background:brand.teal,color:'white',padding:'10px 12px',borderRadius:8,border:'none',fontWeight:700}}>+ Create Position</button>
          </div>
        </aside>

        <main>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:20}}>
            <MetricCard title="Total Positions" value={totalAnim} icon="📋" />
            <MetricCard title="Open Positions" value={openAnim} icon="🔎" />
            <MetricCard title="Filled" value={filledAnim} icon="✅" />
            <MetricCard title="Vacant" value={vacantAnim} icon="⚠️" />
          </div>

          <div style={{background:'white',borderRadius:12,boxShadow:'0 6px 18px rgba(15,23,42,0.04)',padding:16}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
              <div style={{display:'flex',gap:8,alignItems:'center'}}>
                <select value={filterDept} onChange={e=>setFilterDept(e.target.value)} style={{padding:'8px 10px',borderRadius:8,border:'1px solid #E6EEF8'}}>
                  {departments.map(function(d){ return (<option key={d} value={d}>{d}</option>); })}
                </select>
                <select style={{padding:'8px 10px',borderRadius:8,border:'1px solid #E6EEF8'}}>
                  <option>All statuses</option>
                </select>
                <button style={{background:'transparent',border:'none',color:'#64748B'}}>Export CSV</button>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:10}}>
                <div style={{color:'#64748B'}}>Sort by:</div>
                <select style={{padding:'8px 10px',borderRadius:8,border:'1px solid #E6EEF8'}}><option>Newest</option><option>Oldest</option></select>
              </div>
            </div>

            <div style={{overflowX:'auto'}}>
              <table style={{width:'100%',borderCollapse:'collapse'}}>
                <thead>
                  <tr style={{textAlign:'left',color:'#64748B',borderBottom:'1px solid #EEF2FF'}}>
                    <th style={{padding:'12px 8px'}}>Code</th>
                    <th style={{padding:'12px 8px'}}>Title</th>
                    <th style={{padding:'12px 8px'}}>Dept</th>
                    <th style={{padding:'12px 8px'}}>Location</th>
                    <th style={{padding:'12px 8px'}}>Status</th>
                    <th style={{padding:'12px 8px'}}>Budget (₹)</th>
                    <th style={{padding:'12px 8px'}}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered().map(function(p){
                    return (
                      <tr key={p.id} className="row-hover" style={{borderBottom:'1px solid #F8FAFC'}}>
                        <td style={{padding:'14px 8px'}}>{p.code}</td>
                        <td style={{padding:'14px 8px',fontWeight:700}}>{p.title}</td>
                        <td style={{padding:'14px 8px',color:'#64748B'}}>{p.department}</td>
                        <td style={{padding:'14px 8px',color:'#64748B'}}>{p.location}</td>
                        <td style={{padding:'14px 8px'}}>
                          <span style={{padding:'6px 10px',borderRadius:999}}>
                            <StatusPill status={p.status} />
                          </span>
                        </td>
                        <td style={{padding:'14px 8px'}}>{p.budget ? new Intl.NumberFormat('en-IN').format(p.budget) : '-'}</td>
                        <td style={{padding:'14px 8px',display:'flex',gap:8}}>
                          <button onClick={function(){ markFilled(p.id); }} style={{padding:'8px 10px',borderRadius:8,border:'none',background:'rgba(26,115,232,0.08)',color:brand.blue}}>Mark Filled</button>
                          <button style={{padding:'8px 10px',borderRadius:8,border:'1px solid #E6EEF8',background:'white'}}>View</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{marginTop:20,background:'white',padding:16,borderRadius:12,boxShadow:'0 6px 18px rgba(15,23,42,0.04)'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
              <h3 style={{margin:0,fontSize:18,fontWeight:700}}>Position Lifecycle</h3>
              <div style={{color:'#64748B'}}>Auto-sync with Trakstar</div>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:18,overflowX:'auto'}}>
              <FloatingStep label="Proposed" color={brand.blue} />
              <FancyArrow />
              <FloatingStep label="Approved" color={brand.blue} />
              <FancyArrow />
              <FloatingStep label="Active" color={brand.teal} />
              <FancyArrow />
              <FloatingStep label="Vacant" color={'#ef4444'} />
              <FancyArrow />
              <FloatingStep label="Offered" color={'#fb923c'} />
              <FancyArrow />
              <FloatingStep label="Filled" color={'#10b981'} />
              <FancyArrow />
              <FloatingStep label="Yet to join" color={'#64748b'} />
              <FancyArrow />
              <FloatingStep label="Backup" color={'#8b5cf6'} />
            </div>
          </div>
        </main>
      </div>

      {showCreate && (
        <div style={{position:'fixed',inset:0,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(2,6,23,0.4)',zIndex:60}}>
          <div style={{width:'100%',maxWidth:520,background:'white',borderRadius:12,padding:20,boxShadow:'0 12px 40px rgba(2,6,23,0.12)'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
              <h3 style={{margin:0}}>Create Position</h3>
              <button onClick={()=>setShowCreate(false)} style={{border:'none',background:'transparent',fontSize:18}}>✕</button>
            </div>
            <div style={{display:'grid',gap:12}}>
              <div>
                <label style={{fontSize:13,color:'#475569',display:'block',marginBottom:6}}>Role Title</label>
                <input value={newTitle} onChange={function(e){ setNewTitle(e.target.value); }} style={{width:'100%',padding:10,borderRadius:8,border:'1px solid #E6EEF8'}} />
              </div>
              <div>
                <label style={{fontSize:13,color:'#475569',display:'block',marginBottom:6}}>Department</label>
                <select value={newDept} onChange={function(e){ setNewDept(e.target.value); }} style={{width:'100%',padding:10,borderRadius:8,border:'1px solid #E6EEF8'}}>
                  {departments.filter(function(d){ return d!=='All'; }).map(function(d){ return (<option key={d} value={d}>{d}</option>); })}
                </select>
              </div>
              <div style={{display:'flex',justifyContent:'flex-end',gap:8}}>
                <button onClick={()=>setShowCreate(false)} style={{padding:'10px 14px',borderRadius:8,border:'1px solid #E6EEF8',background:'white'}}>Cancel</button>
                <button onClick={createPosition} style={{padding:'10px 14px',borderRadius:8,background:brand.teal,color:'white'}}>Create</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
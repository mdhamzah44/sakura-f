import { useState } from 'react'
import { apiLogin, apiRegister } from '../lib/api.js'
import { C } from '../lib/constants.js'
import Blobs from '../components/Blobs.jsx'

const fieldStyle = { marginBottom: 18 }
const labelStyle = { display:'block', fontSize:'.72rem', letterSpacing:'.1em', textTransform:'uppercase', color: C.muted, marginBottom: 7 }
const inputStyle = { width:'100%', padding:'13px 16px', border:'1.5px solid rgba(200,150,150,0.3)', borderRadius:12, background:'rgba(255,255,255,0.72)', fontSize:'.95rem', fontFamily:"'DM Sans',sans-serif", color: C.dark, outline:'none' }
const btnStyle   = { width:'100%', padding:14, marginTop:8, border:'none', borderRadius:12, background:'linear-gradient(135deg,#e8a0a0,#d47a7a)', color:'#fff', fontSize:'.95rem', fontFamily:"'DM Sans',sans-serif", cursor:'pointer' }

export default function AuthPage({ onLogin }) {
  const [tab, setTab]   = useState('login')
  const [lU, setLU]     = useState('')
  const [lP, setLP]     = useState('')
  const [rU, setRU]     = useState('')
  const [rP, setRP]     = useState('')
  const [msg, setMsg]   = useState('')
  const [err, setErr]   = useState(true)
  const [busy, setBusy] = useState(false)

  function notify(text, isErr = true) { setMsg(text); setErr(isErr) }
  function switchTab(t) { setTab(t); setMsg('') }

  async function doLogin() {
    if (!lU || !lP) return notify('Please fill in all fields.')
    setBusy(true)
    try {
      const d = await apiLogin(lU.trim(), lP)
      if (d.success) onLogin({ username: d.username })
      else notify(d.error || 'Login failed.')
    } catch { notify('Network error.') }
    setBusy(false)
  }

  async function doRegister() {
    if (!rU || !rP) return notify('Please fill in all fields.')
    if (rP.length < 6) return notify('Password must be at least 6 characters.')
    setBusy(true)
    try {
      const d = await apiRegister(rU.trim(), rP)
      if (d.success) { notify('Account created! Sign in.', false); setTab('login'); setLU(rU); setRU(''); setRP('') }
      else notify(d.error || 'Registration failed.')
    } catch { notify('Network error.') }
    setBusy(false)
  }

  const tabBtn = (active) => ({
    flex:1, padding:'9px 0', cursor:'pointer',
    border:`1.5px solid ${active ? C.rose : 'rgba(200,150,150,0.3)'}`, borderRadius:10,
    background: active ? C.rose : 'transparent', color: active ? '#fff' : C.muted,
    fontFamily:"'DM Sans',sans-serif", fontSize:'.85rem',
  })

  return (
    <div style={{ minHeight:'100dvh', display:'flex', alignItems:'center', justifyContent:'center', background: C.cream, fontFamily:"'DM Sans',sans-serif", overflow:'hidden', position:'relative' }}>
      <Blobs />
      <style>{`
        .ai:focus{border-color:#e8a0a0!important;box-shadow:0 0 0 3px rgba(232,160,160,.18)!important}
        .ab:hover{opacity:.88;transform:translateY(-1px)} .ab:active{transform:scale(.97)}
      `}</style>
      <div style={{ position:'relative', zIndex:1, background:'rgba(255,255,255,0.58)', backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)', border:'1px solid rgba(255,255,255,0.75)', borderRadius:24, padding:'52px 44px 44px', width:'min(420px,92vw)', boxShadow:'0 8px 48px rgba(180,100,100,0.13)', animation:'slideUp .5s cubic-bezier(.16,1,.3,1) both' }}>

        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:36 }}>
          <span style={{ fontSize:'2.6rem', display:'block', marginBottom:10, animation:'pulse 2.5s ease-in-out infinite' }}>🌸</span>
          <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:300, fontSize:'2.1rem', color: C.dark }}>Sakura</h1>
          <p style={{ fontSize:'.8rem', color: C.muted, marginTop:4, fontStyle:'italic', fontFamily:"'Cormorant Garamond',serif" }}>your personal companion</p>
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', gap:6, marginBottom:28 }}>
          <button style={tabBtn(tab==='login')} onClick={()=>switchTab('login')}>Sign In</button>
          <button style={tabBtn(tab==='register')} onClick={()=>switchTab('register')}>Create Account</button>
        </div>

        {tab === 'login' ? (<>
          <div style={fieldStyle}><label style={labelStyle}>Username</label><input className="ai" style={inputStyle} value={lU} onChange={e=>setLU(e.target.value)} onKeyDown={e=>e.key==='Enter'&&doLogin()} placeholder="your username" autoComplete="username"/></div>
          <div style={fieldStyle}><label style={labelStyle}>Password</label><input className="ai" style={inputStyle} type="password" value={lP} onChange={e=>setLP(e.target.value)} onKeyDown={e=>e.key==='Enter'&&doLogin()} placeholder="••••••••" autoComplete="current-password"/></div>
          <button className="ab" onClick={doLogin} disabled={busy} style={{...btnStyle, opacity:busy?.6:1}}>{busy?'Signing in…':'Sign In →'}</button>
        </>) : (<>
          <div style={fieldStyle}><label style={labelStyle}>Username</label><input className="ai" style={inputStyle} value={rU} onChange={e=>setRU(e.target.value)} onKeyDown={e=>e.key==='Enter'&&doRegister()} placeholder="choose a username" autoComplete="username"/></div>
          <div style={fieldStyle}><label style={labelStyle}>Password</label><input className="ai" style={inputStyle} type="password" value={rP} onChange={e=>setRP(e.target.value)} onKeyDown={e=>e.key==='Enter'&&doRegister()} placeholder="min 6 characters" autoComplete="new-password"/></div>
          <button className="ab" onClick={doRegister} disabled={busy} style={{...btnStyle, opacity:busy?.6:1}}>{busy?'Creating…':'Create Account →'}</button>
        </>)}

        {msg && <div style={{ marginTop:14, padding:'10px 14px', borderRadius:10, fontSize:'.85rem', background:err?'rgba(220,80,80,0.1)':'rgba(80,180,100,0.1)', border:`1px solid ${err?'rgba(220,80,80,.25)':'rgba(80,180,100,.25)'}`, color:err?'#c04040':'#2a7a3a' }}>{msg}</div>}

        <p style={{ textAlign:'center', marginTop:20, fontSize:'.78rem', color: C.muted }}>
          Admin?{' '}<span style={{ color:'#c07070', cursor:'pointer', textDecoration:'underline' }} onClick={()=>window.location.hash='#admin'}>Access panel</span>
        </p>
      </div>
    </div>
  )
}

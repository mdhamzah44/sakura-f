import { useState } from 'react'
import { apiAdminLogin } from '../lib/api.js'
import { C } from '../lib/constants.js'

function Petals() {
  const ps = Array.from({ length: 16 }, (_, i) => ({
    key: i, left: Math.random() * 100,
    size: 8 + Math.random() * 14,
    dur: 8 + Math.random() * 12,
    delay: -Math.random() * 15,
  }))
  return (
    <div style={{ position:'fixed', inset:0, pointerEvents:'none', overflow:'hidden' }}>
      {ps.map(p => <div key={p.key} style={{ position:'absolute', top:-20, left:`${p.left}vw`, fontSize:p.size, opacity:.14, animation:`fall ${p.dur}s linear ${p.delay}s infinite` }}>🌸</div>)}
    </div>
  )
}

export default function AdminLoginPage({ onLogin }) {
  const [u, setU]       = useState('')
  const [p, setP]       = useState('')
  const [err, setErr]   = useState('')
  const [busy, setBusy] = useState(false)

  async function doLogin() {
    if (!u || !p) return setErr('Fill in all fields.')
    setBusy(true); setErr('')
    try {
      const d = await apiAdminLogin(u, p)
      if (d.success) onLogin()
      else { setErr('Invalid credentials.'); setTimeout(() => setErr(''), 3000) }
    } catch { setErr('Network error.') }
    setBusy(false)
  }

  return (
    <div style={{ minHeight:'100dvh', display:'flex', alignItems:'center', justifyContent:'center', background:C.bg, fontFamily:"'DM Mono',monospace", color:C.text, overflow:'hidden', position:'relative' }}>
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', background:'radial-gradient(ellipse 60% 50% at 20% 80%,rgba(232,85,122,.07) 0%,transparent 70%),radial-gradient(ellipse 40% 40% at 80% 20%,rgba(180,60,120,.05) 0%,transparent 60%)' }} />
      <Petals />
      <style>{`
        .ali{width:100%;background:#0d0a0e;border:1px solid #2e2035;border-radius:8px;padding:12px 14px;color:#f0e8f5;font-family:'DM Mono',monospace;font-size:14px;outline:none;transition:border-color .2s,box-shadow .2s}
        .ali:focus{border-color:#e8557a;box-shadow:0 0 0 3px rgba(232,85,122,.12)}
        .alb{width:100%;background:#e8557a;color:#fff;border:none;border-radius:8px;padding:13px;font-family:'DM Mono',monospace;font-size:13px;font-weight:500;letter-spacing:1px;cursor:pointer;margin-top:8px;transition:background .2s,transform .1s;box-shadow:0 4px 18px rgba(232,85,122,.3)}
        .alb:hover{background:#c93a5e}.alb:active{transform:scale(.97)}.alb:disabled{opacity:.6;cursor:not-allowed}
      `}</style>

      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:16, padding:'48px 40px', width:'min(380px,90vw)', boxShadow:'0 0 60px rgba(232,85,122,.14)', animation:'slideUp .5s cubic-bezier(.16,1,.3,1) both', position:'relative', zIndex:1 }}>
        <div style={{ textAlign:'center', marginBottom:36 }}>
          <span style={{ fontSize:36, display:'block', marginBottom:10, animation:'pulse-glow 3s ease-in-out infinite' }}>🌸</span>
          <h1 style={{ fontFamily:"'DM Serif Display',serif", fontSize:26, letterSpacing:'-.5px' }}><span style={{ color:C.accent }}>Sakura</span> Admin</h1>
          <p style={{ fontSize:11, color:C.mutedD, marginTop:4, letterSpacing:2, textTransform:'uppercase' }}>Control Panel</p>
        </div>

        <div style={{ marginBottom:20 }}>
          <label style={{ display:'block', fontSize:11, letterSpacing:'1.5px', textTransform:'uppercase', color:C.mutedD, marginBottom:8 }}>Username</label>
          <input className="ali" placeholder="admin username" value={u} onChange={e => setU(e.target.value)} onKeyDown={e => e.key === 'Enter' && doLogin()} />
        </div>
        <div style={{ marginBottom:20 }}>
          <label style={{ display:'block', fontSize:11, letterSpacing:'1.5px', textTransform:'uppercase', color:C.mutedD, marginBottom:8 }}>Password</label>
          <input className="ali" type="password" placeholder="••••••••" value={p} onChange={e => setP(e.target.value)} onKeyDown={e => e.key === 'Enter' && doLogin()} />
        </div>

        <button className="alb" disabled={busy} onClick={doLogin}>{busy ? 'Checking…' : 'ACCESS PANEL'}</button>
        {err && <div style={{ color:C.accent, fontSize:12, textAlign:'center', marginTop:14, animation:'fadeUp .2s ease' }}>{err}</div>}

        <button onClick={() => { window.location.hash = '' }} style={{ background:'none', border:'none', color:C.mutedD, fontFamily:"'DM Mono',monospace", fontSize:11, cursor:'pointer', marginTop:16, display:'block', width:'100%', letterSpacing:1, transition:'color .2s' }}>← Back to Sakura</button>
      </div>
    </div>
  )
}

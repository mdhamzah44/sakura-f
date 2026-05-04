import { useState, useEffect } from 'react'
import { apiAdminStats, apiAdminUsers, apiAdminChats, apiAdminClearChat, apiAdminDeleteUser, apiAdminLogout } from '../lib/api.js'
import { C } from '../lib/constants.js'

const fmtT = (iso) => iso ? new Date(iso).toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit', hour12:true }) : ''
const fmtD = (iso) => iso ? new Date(iso).toLocaleDateString('en-IN', { day:'numeric', month:'short' }) : 'Never'

export default function AdminPanel({ onLogout }) {
  const [stats, setStats]     = useState({ totalUsers:0, totalMessages:0, userMessages:0, aiMessages:0 })
  const [users, setUsers]     = useState([])
  const [search, setSearch]   = useState('')
  const [sel, setSel]         = useState(null)
  const [msgs, setMsgs]       = useState([])
  const [clock, setClock]     = useState(new Date().toLocaleTimeString('en-IN', { hour12:false }))
  const [toast, setToast]     = useState({ msg:'', type:'success' })
  const [loadU, setLoadU]     = useState(true)
  const [loadC, setLoadC]     = useState(false)

  useEffect(() => {
    loadAll()
    const t = setInterval(() => setClock(new Date().toLocaleTimeString('en-IN', { hour12:false })), 1000)
    return () => clearInterval(t)
  }, [])

  async function loadAll() { await Promise.all([loadStats(), loadUsers()]) }
  async function loadStats() { try { const d = await apiAdminStats(); setStats(d) } catch {} }
  async function loadUsers() {
    setLoadU(true)
    try { const d = await apiAdminUsers(); setUsers(d) } catch {}
    setLoadU(false)
  }

  async function selectUser(u) {
    setSel(u); setLoadC(true)
    try { const d = await apiAdminChats(u.id); setMsgs(d.messages || []) } catch { setMsgs([]) }
    setLoadC(false)
  }

  function showToast(msg, type = 'success') { setToast({ msg, type }); setTimeout(() => setToast({ msg:'', type:'success' }), 3000) }

  async function clearUserChat(u) {
    if (!window.confirm(`Clear all messages for "${u.username}"?`)) return
    const d = await apiAdminClearChat(u.id)
    if (d.success) { setMsgs([]); showToast(`Cleared ${u.username}'s chat`); loadAll() }
    else showToast('Failed to clear chat', 'error')
  }

  async function deleteUser(u) {
    if (!window.confirm(`Delete user "${u.username}" and ALL their data? This cannot be undone.`)) return
    const d = await apiAdminDeleteUser(u.id)
    if (d.success) { setSel(null); setMsgs([]); showToast(`Deleted ${u.username}`); loadAll() }
    else showToast('Failed to delete user', 'error')
  }

  async function handleLogout() { await apiAdminLogout(); onLogout() }

  const filtered = users.filter(u => u.username.toLowerCase().includes(search.toLowerCase()))

  const statCard = (icon, val, lbl) => (
    <div style={{ background:C.surface, padding:'14px 20px', display:'flex', alignItems:'center', gap:12 }}>
      <span style={{ fontSize:18, opacity:.8 }}>{icon}</span>
      <div>
        <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:22, color:C.accent, lineHeight:1 }}>{val}</div>
        <div style={{ fontSize:10, color:C.mutedD, letterSpacing:1, textTransform:'uppercase', marginTop:2 }}>{lbl}</div>
      </div>
    </div>
  )

  return (
    <div style={{ height:'100dvh', display:'flex', flexDirection:'column', overflow:'hidden', background:C.bg, fontFamily:"'DM Mono',monospace", color:C.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500&display=swap');
        .asc::-webkit-scrollbar{width:4px}.asc::-webkit-scrollbar-thumb{background:#3d2e4a;border-radius:2px}
        .ur{padding:14px 18px;border-bottom:1px solid #2e2035;cursor:pointer;transition:background .15s}
        .ur:hover{background:#1f1824}.ur.sel{background:rgba(232,85,122,.1);border-left:2px solid #e8557a}
        .asrch{width:100%;background:#0d0a0e;border:1px solid #2e2035;border-radius:6px;padding:8px 12px;color:#f0e8f5;font-family:'DM Mono',monospace;font-size:12px;outline:none}
        .asrch:focus{border-color:#e8557a}.asrch::placeholder{color:#4a3d57}
        .abtn{background:transparent;border:1px solid #3d2e4a;color:#7a6b87;font-family:'DM Mono',monospace;font-size:11px;padding:6px 12px;border-radius:6px;cursor:pointer;transition:all .2s}
        .abtn:hover{color:#f0e8f5}.abtn.d:hover{border-color:#e8557a;color:#e8557a;background:rgba(232,85,122,.1)}
        .lbtn{background:transparent;border:1px solid #3d2e4a;color:#7a6b87;font-family:'DM Mono',monospace;font-size:11px;padding:6px 14px;border-radius:6px;cursor:pointer;text-transform:uppercase;transition:all .2s}
        .lbtn:hover{border-color:#e8557a;color:#e8557a}
        .amsg{animation:fadeUp .25s ease}
      `}</style>

      {/* Topbar */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 24px', height:58, borderBottom:`1px solid ${C.border}`, background:C.surface, flexShrink:0, boxShadow:'0 1px 20px rgba(0,0,0,.3)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <span style={{ fontSize:22, filter:'drop-shadow(0 0 8px rgba(232,85,122,.5))' }}>🌸</span>
          <h1 style={{ fontFamily:"'DM Serif Display',serif", fontSize:20 }}><span style={{ color:C.accent }}>Sakura</span> Admin</h1>
          <span style={{ background:'rgba(232,85,122,.12)', border:'1px solid rgba(232,85,122,.3)', color:C.accent, fontSize:10, padding:'2px 8px', borderRadius:20, letterSpacing:'1.5px', textTransform:'uppercase' }}>Panel</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          <span style={{ fontSize:11, color:C.mutedD }}>{clock}</span>
          <button className="lbtn" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:1, background:C.border, borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
        {statCard('👤', stats.totalUsers, 'Total Users')}
        {statCard('💬', stats.totalMessages, 'Total Msgs')}
        {statCard('👩‍💻', stats.userMessages, 'User Msgs')}
        {statCard('🌸', stats.aiMessages, 'Sakura Replies')}
      </div>

      {/* Main layout */}
      <div style={{ display:'flex', flex:1, overflow:'hidden' }}>

        {/* Sidebar */}
        <div style={{ width:290, flexShrink:0, borderRight:`1px solid ${C.border}`, display:'flex', flexDirection:'column', overflow:'hidden', background:C.surface }}>
          <div style={{ padding:'14px 18px 10px', borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <span style={{ fontSize:11, color:C.mutedD, letterSpacing:2, textTransform:'uppercase' }}>Users</span>
            <button className="abtn" style={{ padding:'4px 10px', fontSize:12 }} onClick={loadAll}>↻</button>
          </div>
          <div style={{ padding:'10px 18px', borderBottom:`1px solid ${C.border}` }}>
            <input className="asrch" placeholder="Search users…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="asc" style={{ flex:1, overflowY:'auto' }}>
            {loadU
              ? <div style={{ padding:'28px 18px', color:C.mutedD, fontSize:12, textAlign:'center' }}>Loading…</div>
              : filtered.length === 0
                ? <div style={{ padding:'28px 18px', color:C.mutedD, fontSize:12, textAlign:'center' }}>No users found</div>
                : filtered.map(u => (
                    <div key={u.id} className={`ur${sel?.id === u.id ? ' sel' : ''}`} onClick={() => selectUser(u)}>
                      <div style={{ fontSize:13, color:C.text, marginBottom:4, display:'flex', alignItems:'center', gap:8 }}>
                        <div style={{ width:26, height:26, background:'linear-gradient(135deg,#e8557a,#c93a5e)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, color:'#fff', fontWeight:600, flexShrink:0 }}>{u.username.slice(0,2).toUpperCase()}</div>
                        <span style={{ flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{u.username}</span>
                        <span style={{ background:'rgba(232,85,122,.12)', color:C.accent, borderRadius:10, padding:'1px 7px', fontSize:10, flexShrink:0 }}>{u.messageCount}</span>
                      </div>
                      <div style={{ fontSize:10, color:C.mutedD, paddingLeft:34 }}>Last: {fmtD(u.lastActive)}</div>
                    </div>
                  ))
            }
          </div>
        </div>

        {/* Chat panel */}
        <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
          {!sel
            ? <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', color:C.mutedD, gap:14 }}>
                <span style={{ fontSize:48, opacity:.25, filter:'grayscale(1)' }}>🌸</span>
                <p style={{ fontSize:13, letterSpacing:1 }}>Select a user to view their conversation</p>
              </div>
            : <>
                {/* Chat header */}
                <div style={{ padding:'14px 24px', borderBottom:`1px solid ${C.border}`, background:C.surface, display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{ width:36, height:36, background:'linear-gradient(135deg,#e8557a,#8b3fbb)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, color:'#fff', fontWeight:600 }}>{sel.username.slice(0,2).toUpperCase()}</div>
                    <div>
                      <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:18 }}>{sel.username}</h2>
                      <div style={{ fontSize:10, color:C.mutedD, textTransform:'uppercase', marginTop:2 }}>{msgs.length} messages</div>
                    </div>
                  </div>
                  <div style={{ display:'flex', gap:8 }}>
                    <button className="abtn" onClick={() => selectUser(sel)}>↻ Refresh</button>
                    <button className="abtn d" onClick={() => clearUserChat(sel)}>Clear Chat</button>
                    <button className="abtn d" onClick={() => deleteUser(sel)}>Delete User</button>
                  </div>
                </div>

                {/* Messages */}
                <div className="asc" style={{ flex:1, overflowY:'auto', padding:24, display:'flex', flexDirection:'column', gap:14 }}>
                  {loadC
                    ? <div style={{ color:C.mutedD, fontSize:12, textAlign:'center', padding:40 }}>Loading messages…</div>
                    : msgs.length === 0
                      ? <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', color:C.mutedD, gap:10 }}><span style={{ fontSize:32 }}>💬</span><p>No messages yet</p></div>
                      : msgs.map((m, i) => {
                          const isUser = m.role === 'user'
                          return (
                            <div key={i} className="amsg" style={{ display:'flex', gap:10, maxWidth:700, alignSelf:isUser?'flex-end':'flex-start', flexDirection:isUser?'row-reverse':'row' }}>
                              <div style={{ width:28, height:28, borderRadius:'50%', background:isUser?'linear-gradient(135deg,#5b3a8a,#8b3fbb)':'linear-gradient(135deg,#e8557a,#c93a5e)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:isUser?11:14, flexShrink:0, marginTop:2 }}>
                                {isUser ? sel.username.slice(0,2).toUpperCase() : '🌸'}
                              </div>
                              <div style={{ display:'flex', flexDirection:'column', gap:3 }}>
                                <div style={{ fontSize:10, color:C.mutedD, textAlign:isUser?'right':'left' }}>{isUser ? sel.username : 'Sakura'} · {fmtT(m.timestamp)}</div>
                                <div style={{ padding:'10px 14px', borderRadius:12, fontSize:13, lineHeight:1.6, wordBreak:'break-word', ...(isUser ? { background:'#2a1e33', border:`1px solid ${C.border2}`, borderTopRightRadius:3 } : { background:'linear-gradient(135deg,rgba(232,85,122,.08),rgba(140,60,180,.06))', border:'1px solid rgba(232,85,122,.2)', borderTopLeftRadius:3 }) }}>
                                  {m.content}
                                </div>
                              </div>
                            </div>
                          )
                        })
                  }
                </div>
              </>
          }
        </div>
      </div>

      {/* Toast */}
      {toast.msg && (
        <div style={{ position:'fixed', bottom:24, right:24, background:C.surface2, border:`1px solid ${C.border2}`, borderLeft:`3px solid ${toast.type==='success'?'#4ecca3':C.accent}`, color:C.text, padding:'12px 18px', borderRadius:8, fontSize:12, zIndex:999, boxShadow:'0 8px 32px rgba(0,0,0,.4)', animation:'fadeUp .25s ease' }}>
          {toast.msg}
        </div>
      )}
    </div>
  )
}

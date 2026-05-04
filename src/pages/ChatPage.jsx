import { useState, useEffect, useRef } from 'react'
import { apiHistory, apiSendMessage, apiClearChat, apiLogout } from '../lib/api.js'
import { C } from '../lib/constants.js'
import Blobs from '../components/Blobs.jsx'

const fmt = (iso) => new Date(iso).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })

export default function ChatPage({ user, onLogout }) {
  const [msgs, setMsgs]     = useState([])
  const [input, setInput]   = useState('')
  const [typing, setTyping] = useState(false)
  const [toast, setToast]   = useState('')
  const [loading, setLoading] = useState(true)
  const bottomRef = useRef(null)
  const taRef     = useRef(null)

  useEffect(() => { apiHistory().then(h => { setMsgs(h); setLoading(false) }) }, [])
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }) }, [msgs, typing])

  function autoResize() {
    const el = taRef.current; if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 120) + 'px'
  }

  function showToast(t) { setToast(t); setTimeout(() => setToast(''), 2500) }

  async function send() {
    const text = input.trim()
    if (!text || typing) return
    setInput(''); if (taRef.current) taRef.current.style.height = 'auto'
    setMsgs(prev => [...prev, { role:'user', content:text, timestamp:new Date().toISOString() }])
    setTyping(true)
    try {
      const d = await apiSendMessage(text)
      if (d.reply) setMsgs(prev => [...prev, { role:'assistant', content:d.reply, timestamp:new Date().toISOString() }])
      else showToast(d.error || 'Something went wrong')
    } catch { showToast('Network error — try again') }
    setTyping(false)
  }

  async function clearChat() {
    if (!window.confirm('Clear all messages?')) return
    await apiClearChat(); setMsgs([]); showToast('Chat cleared 🌸')
  }

  async function handleLogout() { await apiLogout(); onLogout() }

  return (
    <div style={{ height:'100dvh', display:'flex', flexDirection:'column', background:C.cream, fontFamily:"'DM Sans',sans-serif", overflow:'hidden', position:'relative' }}>
      <Blobs />
      <style>{`
        .cta{resize:none;border:1.5px solid rgba(200,150,150,0.25);border-radius:16px;padding:13px 16px;font-family:'DM Sans',sans-serif;font-size:.93rem;color:#2a1a1a;background:rgba(255,255,255,.78);outline:none;max-height:120px;line-height:1.5;flex:1;transition:border-color .2s,box-shadow .2s}
        .cta:focus{border-color:#e8a0a0;box-shadow:0 0 0 3px rgba(232,160,160,.15)}
        .cta::placeholder{color:rgba(138,106,106,.5)}
        .csb:hover:not(:disabled){transform:scale(1.07)}.csb:active:not(:disabled){transform:scale(.95)}
        .cib{background:rgba(232,160,160,.15);border:1px solid rgba(232,160,160,.25);border-radius:10px;padding:7px 12px;font-size:.78rem;color:#8a6a6a;cursor:pointer;font-family:'DM Sans',sans-serif;transition:background .2s}
        .cib:hover{background:rgba(232,160,160,.3)}
        .cmb{animation:fadeUp .3s ease}
        .dp{width:7px;height:7px;border-radius:50%;background:#e8a0a0;display:inline-block;margin:0 2px;animation:bounce 1.2s ease-in-out infinite}
        .dp2{animation-delay:.2s}.dp3{animation-delay:.4s}
        .mscr::-webkit-scrollbar{width:4px}.mscr::-webkit-scrollbar-thumb{background:rgba(200,150,150,.3);border-radius:4px}
      `}</style>

      {/* Header */}
      <header style={{ position:'relative', zIndex:10, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 20px', background:'rgba(255,255,255,0.62)', backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)', borderBottom:'1px solid rgba(255,255,255,0.65)', boxShadow:'0 2px 20px rgba(180,100,100,0.08)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:40, height:40, borderRadius:'50%', background:'linear-gradient(135deg,#f5c6c6,#e8a0a0)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.25rem', boxShadow:'0 2px 10px rgba(232,160,160,.4)' }}>🌸</div>
          <div>
            <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:400, fontSize:'1.15rem', color:C.dark }}>Sakura</h2>
            <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:'.72rem', color:C.muted }}>
              <div style={{ width:6, height:6, borderRadius:'50%', background:'#7bc47b', boxShadow:'0 0 0 2px rgba(123,196,123,.3)', animation:'blink 2s ease-in-out infinite' }} />
              Online
            </div>
          </div>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button className="cib" onClick={clearChat}>🗑 Clear</button>
          <button className="cib" onClick={handleLogout}>← Logout</button>
        </div>
      </header>

      {/* Messages */}
      <div className="mscr" style={{ flex:1, overflowY:'auto', padding:'24px 16px', display:'flex', flexDirection:'column', gap:16, position:'relative', zIndex:1 }}>
        {loading && <div style={{ textAlign:'center', color:C.muted, padding:40 }}>Loading messages…</div>}
        {!loading && msgs.length === 0 && (
          <div style={{ textAlign:'center', padding:'60px 20px', fontFamily:"'Cormorant Garamond',serif", color:C.muted }}>
            <div style={{ fontSize:'3rem', marginBottom:14 }}>🌸</div>
            <h3 style={{ fontWeight:300, fontSize:'1.45rem', marginBottom:6 }}>Hey, {user.username}!</h3>
            <p style={{ fontSize:'.9rem', fontStyle:'italic' }}>Start a conversation with Sakura…</p>
          </div>
        )}
        {msgs.map((m, i) => {
          const isUser = m.role === 'user'
          return (
            <div key={i} className="cmb" style={{ display:'flex', gap:10, maxWidth:'78%', alignSelf:isUser?'flex-end':'flex-start', flexDirection:isUser?'row-reverse':'row' }}>
              <div style={{ width:30, height:30, flexShrink:0, borderRadius:'50%', background:isUser?'linear-gradient(135deg,#d47a7a,#c05a5a)':'linear-gradient(135deg,#f5c6c6,#e8a0a0)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.88rem', marginTop:2 }}>
                {isUser ? '👤' : '🌸'}
              </div>
              <div>
                <div style={{ padding:'12px 16px', borderRadius:18, lineHeight:1.58, fontSize:'.92rem', ...(isUser ? { background:'linear-gradient(135deg,#e8a0a0,#d47a7a)', color:'#fff', borderBottomRightRadius:4, boxShadow:'0 3px 14px rgba(212,122,122,.28)' } : { background:'rgba(255,255,255,.85)', color:C.dark, borderBottomLeftRadius:4, border:'1px solid rgba(255,255,255,.9)', boxShadow:'0 2px 12px rgba(180,100,100,.09)' }) }}>
                  {m.content}
                </div>
                <div style={{ fontSize:'.68rem', color:'rgba(138,106,106,.7)', marginTop:4, textAlign:isUser?'right':'left' }}>{fmt(m.timestamp)}</div>
              </div>
            </div>
          )
        })}
        {typing && (
          <div style={{ display:'flex', gap:10, maxWidth:'78%', alignSelf:'flex-start' }}>
            <div style={{ width:30, height:30, borderRadius:'50%', background:'linear-gradient(135deg,#f5c6c6,#e8a0a0)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.88rem' }}>🌸</div>
            <div style={{ padding:'14px 18px', borderRadius:18, borderBottomLeftRadius:4, background:'rgba(255,255,255,.85)', border:'1px solid rgba(255,255,255,.9)' }}>
              <span className="dp" /><span className="dp dp2" /><span className="dp dp3" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ position:'relative', zIndex:10, display:'flex', alignItems:'flex-end', gap:10, padding:'14px 16px', paddingBottom:'max(14px,env(safe-area-inset-bottom))', background:'rgba(255,255,255,0.62)', backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)', borderTop:'1px solid rgba(255,255,255,0.65)' }}>
        <textarea ref={taRef} className="cta" rows={1} placeholder="Say something…" value={input} onChange={e => { setInput(e.target.value); autoResize() }} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }} />
        <button className="csb" disabled={typing || !input.trim()} onClick={send} style={{ width:46, height:46, flexShrink:0, borderRadius:'50%', border:'none', background:'linear-gradient(135deg,#e8a0a0,#d47a7a)', color:'#fff', fontSize:'1.1rem', cursor: typing ? 'not-allowed' : 'pointer', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 3px 14px rgba(212,122,122,.35)', opacity: typing || !input.trim() ? .5 : 1, transition:'transform .15s,opacity .15s' }}>➤</button>
      </div>

      {toast && <div style={{ position:'fixed', bottom:90, left:'50%', transform:'translateX(-50%)', background:'rgba(42,26,26,.88)', color:'#fff', borderRadius:12, padding:'10px 18px', fontSize:'.82rem', zIndex:100, whiteSpace:'nowrap', animation:'fadeUp .3s ease' }}>{toast}</div>}
    </div>
  )
}

import { useState, useEffect } from 'react'
import { apiMe, apiAdminMe } from './lib/api.js'
import AuthPage       from './pages/AuthPage.jsx'
import ChatPage       from './pages/ChatPage.jsx'
import AdminLoginPage from './pages/AdminLoginPage.jsx'
import AdminPanel     from './pages/AdminPanel.jsx'

export default function App() {
  const [page, setPage] = useState('boot')
  const [user, setUser] = useState(null)

  useEffect(() => {
    async function init() {
      const hash = window.location.hash
      if (hash === '#admin') {
        const d = await apiAdminMe()
        setPage(d?.isAdmin ? 'admin' : 'adminLogin')
        return
      }
      const me = await apiMe()
      if (me?.username) { setUser(me); setPage('chat') }
      else setPage('auth')
    }
    init()
    window.addEventListener('hashchange', () => {
      if (window.location.hash === '#admin') setPage('adminLogin')
      else { setPage('auth') }
    })
  }, [])

  if (page === 'boot')       return <Splash />
  if (page === 'auth')       return <AuthPage onLogin={(u) => { setUser(u); setPage('chat') }} />
  if (page === 'chat')       return <ChatPage user={user} onLogout={() => { setUser(null); setPage('auth') }} />
  if (page === 'adminLogin') return <AdminLoginPage onLogin={() => setPage('admin')} />
  if (page === 'admin')      return <AdminPanel onLogout={() => setPage('adminLogin')} />
  return null
}

function Splash() {
  return (
    <div style={{ height:'100dvh', display:'flex', alignItems:'center', justifyContent:'center', background:'#fdf6f0' }}>
      <span style={{ fontSize:'3rem', animation:'pulse 1.5s ease-in-out infinite' }}>🌸</span>
    </div>
  )
}

const BASE = import.meta.env.VITE_API_URL || ''
const o = { credentials: 'include', headers: { 'Content-Type': 'application/json' } }

// Auth
export const apiRegister = (u, p)    => fetch(`https://sakura-b.onrender.com/register`, { ...o, method: 'POST', body: JSON.stringify({ username: u, password: p }) }).then(r => r.json())
export const apiLogin    = (u, p)    => fetch(`https://sakura-b.onrender.com/login`,    { ...o, method: 'POST', body: JSON.stringify({ username: u, password: p }) }).then(r => r.json())
export const apiLogout   = ()        => fetch(`https://sakura-b.onrender.com/logout`,   { ...o, method: 'POST' })
export const apiMe       = ()        => fetch(`https://sakura-b.onrender.com/me`,       { ...o }).then(r => r.ok ? r.json() : null)

// Chat
export const apiHistory     = ()    => fetch(`https://sakura-b.onrender.com/api/history`, { ...o }).then(r => r.ok ? r.json() : [])
export const apiSendMessage = (msg) => fetch(`https://sakura-b.onrender.com/api/chat`,    { ...o, method: 'POST', body: JSON.stringify({ message: msg }) }).then(r => r.json())
export const apiClearChat   = ()    => fetch(`https://sakura-b.onrender.com/api/clear`,   { ...o, method: 'DELETE' })

// Admin
export const apiAdminLogin      = (u, p) => fetch(`https://sakura-b.onrender.com/admin/login`,  { ...o, method: 'POST', body: JSON.stringify({ username: u, password: p }) }).then(r => r.json())
export const apiAdminLogout     = ()     => fetch(`https://sakura-b.onrender.com/admin/logout`, { ...o, method: 'POST' })
export const apiAdminMe         = ()     => fetch(`https://sakura-b.onrender.com/admin/me`,     { ...o }).then(r => r.json())
export const apiAdminStats      = ()     => fetch(`https://sakura-b.onrender.com/admin/api/stats`, { ...o }).then(r => r.json())
export const apiAdminUsers      = ()     => fetch(`https://sakura-b.onrender.com/admin/api/users`, { ...o }).then(r => r.json())
export const apiAdminChats      = (id)   => fetch(`https://sakura-b.onrender.com/admin/api/chats/${id}`, { ...o }).then(r => r.json())
export const apiAdminClearChat  = (id)   => fetch(`https://sakura-b.onrender.com/admin/api/clear_chat/${id}`, { ...o, method: 'DELETE' }).then(r => r.json())
export const apiAdminDeleteUser = (id)   => fetch(`https://sakura-b.onrender.com/admin/api/delete_user/${id}`, { ...o, method: 'DELETE' }).then(r => r.json())

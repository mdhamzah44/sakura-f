const BASE = import.meta.env.VITE_API_URL || ''
const o = { credentials: 'include', headers: { 'Content-Type': 'application/json' } }

// Auth
export const apiRegister = (u, p)    => fetch(`${BASE}/register`, { ...o, method: 'POST', body: JSON.stringify({ username: u, password: p }) }).then(r => r.json())
export const apiLogin    = (u, p)    => fetch(`${BASE}/login`,    { ...o, method: 'POST', body: JSON.stringify({ username: u, password: p }) }).then(r => r.json())
export const apiLogout   = ()        => fetch(`${BASE}/logout`,   { ...o, method: 'POST' })
export const apiMe       = ()        => fetch(`${BASE}/me`,       { ...o }).then(r => r.ok ? r.json() : null)

// Chat
export const apiHistory     = ()    => fetch(`${BASE}/api/history`, { ...o }).then(r => r.ok ? r.json() : [])
export const apiSendMessage = (msg) => fetch(`${BASE}/api/chat`,    { ...o, method: 'POST', body: JSON.stringify({ message: msg }) }).then(r => r.json())
export const apiClearChat   = ()    => fetch(`${BASE}/api/clear`,   { ...o, method: 'DELETE' })

// Admin
export const apiAdminLogin      = (u, p) => fetch(`${BASE}/admin/login`,  { ...o, method: 'POST', body: JSON.stringify({ username: u, password: p }) }).then(r => r.json())
export const apiAdminLogout     = ()     => fetch(`${BASE}/admin/logout`, { ...o, method: 'POST' })
export const apiAdminMe         = ()     => fetch(`${BASE}/admin/me`,     { ...o }).then(r => r.json())
export const apiAdminStats      = ()     => fetch(`${BASE}/admin/api/stats`, { ...o }).then(r => r.json())
export const apiAdminUsers      = ()     => fetch(`${BASE}/admin/api/users`, { ...o }).then(r => r.json())
export const apiAdminChats      = (id)   => fetch(`${BASE}/admin/api/chats/${id}`, { ...o }).then(r => r.json())
export const apiAdminClearChat  = (id)   => fetch(`${BASE}/admin/api/clear_chat/${id}`, { ...o, method: 'DELETE' }).then(r => r.json())
export const apiAdminDeleteUser = (id)   => fetch(`${BASE}/admin/api/delete_user/${id}`, { ...o, method: 'DELETE' }).then(r => r.json())

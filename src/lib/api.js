const BASE = import.meta.env.VITE_API_URL || ''
const o = { credentials: 'include', headers: { 'Content-Type': 'application/json' } }

// Auth
export const apiRegister = (u, p)    => fetch(`https://webrtc1.arkvisioninfotech.in/register`, { ...o, method: 'POST', body: JSON.stringify({ username: u, password: p }) }).then(r => r.json())
export const apiLogin    = (u, p)    => fetch(`https://webrtc1.arkvisioninfotech.in/login`,    { ...o, method: 'POST', body: JSON.stringify({ username: u, password: p }) }).then(r => r.json())
export const apiLogout   = ()        => fetch(`https://webrtc1.arkvisioninfotech.in/logout`,   { ...o, method: 'POST' })
export const apiMe       = ()        => fetch(`https://webrtc1.arkvisioninfotech.in/me`,       { ...o }).then(r => r.ok ? r.json() : null)

// Chat
export const apiHistory     = ()    => fetch(`https://webrtc1.arkvisioninfotech.in/api/history`, { ...o }).then(r => r.ok ? r.json() : [])
export const apiSendMessage = (msg) => fetch(`https://webrtc1.arkvisioninfotech.in/api/chat`,    { ...o, method: 'POST', body: JSON.stringify({ message: msg }) }).then(r => r.json())
export const apiClearChat   = ()    => fetch(`https://webrtc1.arkvisioninfotech.in/api/clear`,   { ...o, method: 'DELETE' })

// Admin
export const apiAdminLogin      = (u, p) => fetch(`https://webrtc1.arkvisioninfotech.in/admin/login`,  { ...o, method: 'POST', body: JSON.stringify({ username: u, password: p }) }).then(r => r.json())
export const apiAdminLogout     = ()     => fetch(`https://webrtc1.arkvisioninfotech.in/admin/logout`, { ...o, method: 'POST' })
export const apiAdminMe         = ()     => fetch(`https://webrtc1.arkvisioninfotech.in/admin/me`,     { ...o }).then(r => r.json())
export const apiAdminStats      = ()     => fetch(`https://webrtc1.arkvisioninfotech.in/admin/api/stats`, { ...o }).then(r => r.json())
export const apiAdminUsers      = ()     => fetch(`https://webrtc1.arkvisioninfotech.in/admin/api/users`, { ...o }).then(r => r.json())
export const apiAdminChats      = (id)   => fetch(`https://webrtc1.arkvisioninfotech.in/admin/api/chats/${id}`, { ...o }).then(r => r.json())
export const apiAdminClearChat  = (id)   => fetch(`https://webrtc1.arkvisioninfotech.in/admin/api/clear_chat/${id}`, { ...o, method: 'DELETE' }).then(r => r.json())
export const apiAdminDeleteUser = (id)   => fetch(`https://webrtc1.arkvisioninfotech.in/admin/api/delete_user/${id}`, { ...o, method: 'DELETE' }).then(r => r.json())

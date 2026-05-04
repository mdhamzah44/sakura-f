export default function Blobs() {
  return (
    <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0 }}>
      <div style={{ position:'absolute', borderRadius:'50%', filter:'blur(100px)', opacity:.28, animation:'drift 14s ease-in-out infinite alternate', width:600, height:600, background:'#f5c6c6', top:-150, left:-100 }} />
      <div style={{ position:'absolute', borderRadius:'50%', filter:'blur(100px)', opacity:.28, animation:'drift 14s ease-in-out infinite alternate', animationDelay:'-5s', width:450, height:450, background:'#fde8d8', bottom:-100, right:-100 }} />
      <div style={{ position:'absolute', borderRadius:'50%', filter:'blur(80px)', opacity:.18, animation:'drift 18s ease-in-out infinite alternate', animationDelay:'-9s', width:300, height:300, background:'#e8d5f5', top:'40%', left:'55%' }} />
    </div>
  )
}

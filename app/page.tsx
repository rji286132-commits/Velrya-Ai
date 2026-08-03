import Link from 'next/link'

export default function Home(){
  return(
    <div style={{minHeight:'100vh', background:'#050507', color:'white', overflow:'hidden', position:'relative', fontFamily:'system-ui'}}>
      {/* 3D Blobs */}
      <div style={{position:'absolute', width:'600px', height:'600px', background:'radial-gradient(circle, #7c3aed 0%, transparent 70%)', top:'-200px', left:'-100px', filter:'blur(80px)', opacity:0.6, animation:'float 6s ease-in-out infinite'}}></div>
      <div style={{position:'absolute', width:'700px', height:'700px', background:'radial-gradient(circle, #06b6d4 0%, transparent 70%)', bottom:'-200px', right:'-100px', filter:'blur(90px)', opacity:0.5, animation:'float2 8s ease-in-out infinite'}}></div>

      <nav style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'20px 40px', position:'relative', zIndex:10}}>
        <span style={{fontSize:'22px', fontWeight:900, letterSpacing:'-1px'}}>VELRYA AI</span>
        <div style={{display:'flex', gap:'12px'}}>
          <Link href="/login" style={{padding:'10px 20px', borderRadius:'100px', border:'1px solid #333', color:'white', textDecoration:'none'}}>Log in</Link>
          <Link href="/register" style={{padding:'10px 20px', borderRadius:'100px', background:'white', color:'black', fontWeight:600, textDecoration:'none'}}>Sign up</Link>
        </div>
      </nav>

      <div style={{textAlign:'center', marginTop:'100px', position:'relative', zIndex:10, padding:'0 20px'}}>
        <div style={{display:'inline-block', background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.1)', padding:'6px 14px', borderRadius:'100px', fontSize:'12px', marginBottom:'24px'}}>✨ Next Gen AI Chat</div>
        <h1 style={{fontSize:'clamp(40px, 7vw, 84px)', fontWeight:900, lineHeight:0.9, letterSpacing:'-3px', margin:'0 0 20px'}}>Chat Smarter with<br/><span style={{background:'linear-gradient(90deg, #a78bfa, #22d3ee)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent'}}>Velrya AI</span></h1>
        <p style={{color:'#999', fontSize:'18px', maxWidth:'600px', margin:'0 auto 32px'}}>ChatGPT jaisa fast, premium 3D design ke saath. Apna Groq API se powered.</p>
        <Link href="/chat" style={{display:'inline-block', background:'white', color:'black', padding:'16px 32px', borderRadius:'100px', fontWeight:700, fontSize:'16px', textDecoration:'none', boxShadow:'0 20px 40px rgba(255,255,255,0.2)'}}>Start Chatting →</Link>
      </div>

      <style>{`@keyframes float{0%,100%{transform:translateY(0px)}50%{transform:translateY(-30px)}} @keyframes float2{0%,100%{transform:translateY(0px) translateX(0px)}50%{transform:translateY(20px) translateX(-20px)}}`}</style>
    </div>
  )
}

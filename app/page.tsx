"use client"
import Link from 'next/link'

export default function Home(){
  return(
    <div style={{minHeight:'100vh', background:'#050507', color:'white', display:'flex', flexDirection:'column', fontFamily:'system-ui'}}>
      <nav style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'20px 40px'}}>
        <span style={{fontSize:'22px', fontWeight:900}}>VELRYA AI</span>
        <div style={{display:'flex', gap:'12px'}}>
          <Link href="/login" style={{padding:'10px 20px', borderRadius:'100px', border:'1px solid #333', color:'white', textDecoration:'none'}}>Login</Link>
          <Link href="/register" style={{padding:'10px 20px', borderRadius:'100px', background:'white', color:'black', fontWeight:600, textDecoration:'none'}}>Sign up</Link>
        </div>
      </nav>
      <div style={{flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'20px'}}>
        <h1 style={{fontSize:'clamp(40px, 7vw, 80px)', fontWeight:900, lineHeight:0.9}}>Chat Smarter with<br/>Velrya AI</h1>
        <p style={{color:'#999', margin:'20px 0', fontSize:'18px'}}>Premium 3D AI Chat</p>
        <Link href="/chat" style={{background:'white', color:'black', padding:'16px 32px', borderRadius:'100px', fontWeight:700, textDecoration:'none'}}>Start Chatting →</Link>
      </div>
    </div>
  )
}

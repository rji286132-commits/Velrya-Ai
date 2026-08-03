"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage(){
  const [email,setEmail]=useState("deepak21398d@gmail.com")
  const [password,setPassword]=useState("")
  const [loading,setLoading]=useState(false)
  const router=useRouter()

  const handleLogin=async(e:any)=>{
    e.preventDefault(); setLoading(true)
    try{
      const res=await fetch("/api/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,password})})
      if(res.ok){ localStorage.setItem("velrya_user",JSON.stringify({email})); router.push("/chat") }
      else { alert("Login fail - pehle Register karo") }
    }catch{ alert("Error") }
    setLoading(false)
  }

  return(
    <div style={{minHeight:'100vh', background:'#050507', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px', fontFamily:'system-ui'}}>
      <div style={{width:'100%', maxWidth:'420px'}}>
        <div style={{textAlign:'center', marginBottom:'32px'}}>
          <Link href="/" style={{fontSize:'28px', fontWeight:900, color:'white', letterSpacing:'-1px', textDecoration:'none'}}>VELRYA AI</Link>
          <h1 style={{fontSize:'36px', fontWeight:700, color:'white', margin:'24px 0 8px'}}>Welcome back</h1>
          <p style={{color:'#888'}}>Login to Velrya AI</p>
        </div>
        <form onSubmit={handleLogin} style={{background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'24px', padding:'28px', backdropFilter:'blur(20px)'}}>
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" style={{width:'100%', background:'#1a1a1f', border:'1px solid #2a2a30', borderRadius:'12px', padding:'14px', color:'white', marginBottom:'14px', outline:'none', boxSizing:'border-box'}} />
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" style={{width:'100%', background:'#1a1a1f', border:'1px solid #2a2a30', borderRadius:'12px', padding:'14px', color:'white', marginBottom:'20px', outline:'none', boxSizing:'border-box'}} />
          <button disabled={loading} style={{width:'100%', background:'white', color:'black', fontWeight:700, padding:'14px', borderRadius:'100px', border:'none', cursor:'pointer', fontSize:'16px'}}>{loading?"Logging...":"Continue"}</button>
          <div style={{textAlign:'center', marginTop:'18px'}}>
            <p style={{color:'#888', fontSize:'14px'}}>New here? <Link href="/register" style={{color:'white'}}>Create account</Link></p>
            <Link href="/" style={{color:'#666', fontSize:'14px', textDecoration:'none', display:'inline-block', marginTop:'12px'}}>← Go to Home</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

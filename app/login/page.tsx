"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage(){
  const [email,setEmail]=useState("deepak21398d@gmail.com")
  const [password,setPassword]=useState("")
  const [showPass,setShowPass]=useState(false)
  const [loading,setLoading]=useState(false)
  const router=useRouter()

  const handleLogin=async(e:any)=>{
    e.preventDefault(); setLoading(true)
    try{
      const res=await fetch("/api/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,password})})
      const data=await res.json()
      if(res.ok){ localStorage.setItem("velrya_user",JSON.stringify({email})); router.push("/chat") }
      else { alert(data.error) }
    }catch{ alert("Error") }
    setLoading(false)
  }

  return(
    <div style={{minHeight:'100vh', background:'#050507', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px', fontFamily:'system-ui'}}>
      <div style={{width:'100%', maxWidth:'420px'}}>
        <div style={{textAlign:'center', marginBottom:'32px'}}>
          <Link href="/" style={{fontSize:'28px', fontWeight:900, color:'white', textDecoration:'none'}}>VELRYA AI</Link>
          <h1 style={{fontSize:'36px', fontWeight:700, color:'white', margin:'24px 0 8px'}}>Welcome back</h1>
        </div>
        <form onSubmit={handleLogin} style={{background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'24px', padding:'28px'}}>
          <input value={email} onChange={e=>setEmail(e.target.value)} style={{width:'100%', background:'#1a1a1f', border:'1px solid #2a2a30', borderRadius:'12px', padding:'14px', color:'white', marginBottom:'14px', boxSizing:'border-box'}} />
          <div style={{position:'relative', marginBottom:'20px'}}>
            <input type={showPass ? "text" : "password"} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" style={{width:'100%', background:'#1a1a1f', border:'1px solid #2a2a30', borderRadius:'12px', padding:'14px 60px 14px 14px', color:'white', boxSizing:'border-box'}} />
            <button type="button" onClick={()=>setShowPass(!showPass)} style={{position:'absolute', right:'10px', top:'50%', transform:'translateY(-50%)', background:'#2a2a30', color:'white', border:'none', borderRadius:'8px', padding:'6px 10px', fontSize:'11px', cursor:'pointer', fontWeight:700}}>
              {showPass ? "HIDE" : "SHOW"}
            </button>
          </div>
          <button disabled={loading} style={{width:'100%', background:'white', color:'black', fontWeight:700, padding:'14px', borderRadius:'100px', border:'none', cursor:'pointer'}}>{loading?"Logging...":"Continue"}</button>
        </form>
      </div>
    </div>
  )
}

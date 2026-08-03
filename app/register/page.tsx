"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage(){
  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")
  const [loading,setLoading]=useState(false)
  const router=useRouter()
  const handleRegister=async(e:any)=>{
    e.preventDefault(); setLoading(true)
    try{
      const res=await fetch("/api/auth/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,password})})
      if(res.ok){ alert("Account ban gaya!"); router.push("/login") } else { alert("Fail") }
    }catch{ alert("Error") }
    setLoading(false)
  }
  return(
    <div style={{minHeight:'100vh', background:'#050507', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px', fontFamily:'system-ui'}}>
      <div style={{width:'100%', maxWidth:'420px'}}>
        <div style={{textAlign:'center', marginBottom:'32px'}}>
          <Link href="/" style={{fontSize:'28px', fontWeight:900, color:'white', textDecoration:'none'}}>VELRYA AI</Link>
          <h1 style={{fontSize:'32px', fontWeight:700, color:'white', margin:'24px 0 8px'}}>Create account</h1>
        </div>
        <form onSubmit={handleRegister} style={{background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'24px', padding:'28px'}}>
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" style={{width:'100%', background:'#1a1a1f', border:'1px solid #2a2a30', borderRadius:'12px', padding:'14px', color:'white', marginBottom:'14px', boxSizing:'border-box'}} />
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" style={{width:'100%', background:'#1a1a1f', border:'1px solid #2a2a30', borderRadius:'12px', padding:'14px', color:'white', marginBottom:'20px', boxSizing:'border-box'}} />
          <button disabled={loading} style={{width:'100%', background:'white', color:'black', fontWeight:700, padding:'14px', borderRadius:'100px', border:'none', cursor:'pointer'}}>{loading?"Creating...":"Sign Up"}</button>
          <p style={{color:'#888', fontSize:'14px', textAlign:'center', marginTop:'18px'}}>Already have account? <Link href="/login" style={{color:'white'}}>Log in</Link></p>
        </form>
      </div>
    </div>
  )
}

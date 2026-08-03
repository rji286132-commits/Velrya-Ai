"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

export default function LoginPage(){
  const [email,setEmail]=useState("deepak21398d@gmail.com")
  const [password,setPassword]=useState("")
  const [show,setShow]=useState(false)
  const [loading,setLoading]=useState(false)
  const router=useRouter()

  const handleLogin=async(e:any)=>{
    e.preventDefault(); setLoading(true)
    try{
      const res=await fetch("/api/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email: email.toLowerCase().trim(), password})})
      const data=await res.json()
      if(res.ok){ localStorage.setItem("velrya_user", JSON.stringify(data.user)); router.push("/chat") }
      else { alert(data.error) }
    }catch{ alert("Server error") }
    setLoading(false)
  }

  const handleGoogleLogin=async()=>{
    const supabase=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
    await supabase.auth.signInWithOAuth({ provider: 'google', options:{ redirectTo: `${window.location.origin}/auth/callback` } })
  }

  return(
    <div style={{minHeight:'100vh', background:'#050507', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px'}}>
      <div style={{width:'100%', maxWidth:'400px'}}>
        <h1 style={{color:'white', textAlign:'center', fontWeight:900, fontSize:'30px'}}>VELRYA AI</h1>
        <h2 style={{color:'white', textAlign:'center', margin:'16px 0'}}>Welcome back</h2>
        <form onSubmit={handleLogin} style={{background:'#121214', border:'1px solid #222', borderRadius:'20px', padding:'24px'}}>
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" style={{width:'100%', padding:'14px', borderRadius:'10px', background:'#1e1e22', color:'white', border:'1px solid #333', marginBottom:'12px', boxSizing:'border-box'}} />
          
          <div style={{position:'relative', marginBottom:'8px'}}>
            <input type={show?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" style={{width:'100%', padding:'14px 60px 14px 14px', borderRadius:'10px', background:'#1e1e22', color:'white', border:'1px solid #333', boxSizing:'border-box'}} />
            <button type="button" onClick={()=>setShow(!show)} style={{position:'absolute', right:'10px', top:'50%', transform:'translateY(-50%)', background:'#333', color:'white', border:'none', borderRadius:'6px', padding:'6px 10px', fontSize:'11px'}}>{show?"HIDE":"SHOW"}</button>
          </div>

          {/* FORGET PASSWORD YAHAN HAI */}
          <div style={{textAlign:'right', marginBottom:'18px'}}>
            <Link href="/forgot-password" style={{color:'#888', fontSize:'13px', textDecoration:'none'}}>Forgot Password?</Link>
          </div>

          <button type="submit" disabled={loading} style={{width:'100%', padding:'14px', borderRadius:'100px', background:'white', color:'black', fontWeight:800, border:'none', cursor:'pointer', marginBottom:'12px'}}>{loading?"Checking...":"Login"}</button>

          <button type="button" onClick={handleGoogleLogin} style={{width:'100%', padding:'14px', borderRadius:'100px', background:'#222', color:'white', fontWeight:600, border:'1px solid #333', cursor:'pointer', marginBottom:'12px'}}>Continue with Google</button>

          <Link href="/register" style={{display:'block', textAlign:'center', padding:'14px', borderRadius:'100px', border:'1px solid #333', color:'white', textDecoration:'none'}}>Create New Account - Sign Up</Link>
        </form>
      </div>
    </div>
  )
}

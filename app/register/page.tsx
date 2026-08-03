"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

export default function RegisterPage(){
  const [name,setName]=useState("")
  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")
  const [show,setShow]=useState(false)
  const [loading,setLoading]=useState(false)
  const router=useRouter()

  const handleRegister=async(e:any)=>{
    e.preventDefault(); setLoading(true)
    const res=await fetch("/api/auth/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name, email: email.toLowerCase().trim(), password})})
    const data=await res.json()
    if(res.ok){ alert("Ban gaya! Login karo"); router.push("/login") } else { alert(data.error) }
    setLoading(false)
  }
  const handleGoogle=async()=>{
    const supabase=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
    await supabase.auth.signInWithOAuth({provider:'google', options:{redirectTo: `${window.location.origin}/auth/callback`}})
  }

  return(
    <div style={{minHeight:'100vh', background:'#050507', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px'}}>
      <form onSubmit={handleRegister} style={{width:'100%', maxWidth:'400px', background:'#121214', border:'1px solid #222', borderRadius:'20px', padding:'24px'}}>
        <h2 style={{color:'white', textAlign:'center'}}>Create Account</h2>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full Name" style={{width:'100%', padding:'14px', borderRadius:'10px', background:'#1e1e22', color:'white', border:'1px solid #333', margin:'12px 0', boxSizing:'border-box'}} />
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" style={{width:'100%', padding:'14px', borderRadius:'10px', background:'#1e1e22', color:'white', border:'1px solid #333', marginBottom:'12px', boxSizing:'border-box'}} />
        <div style={{position:'relative', marginBottom:'18px'}}>
          <input type={show?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" style={{width:'100%', padding:'14px 60px 14px 14px', borderRadius:'10px', background:'#1e1e22', color:'white', border:'1px solid #333', boxSizing:'border-box'}} />
          <button type="button" onClick={()=>setShow(!show)} style={{position:'absolute', right:'10px', top:'50%', transform:'translateY(-50%)', background:'#333', color:'white', border:'none', borderRadius:'6px', padding:'6px 10px', fontSize:'11px'}}>{show?"HIDE":"SHOW"}</button>
        </div>
        <button disabled={loading} style={{width:'100%', padding:'14px', borderRadius:'100px', background:'white', color:'black', fontWeight:800, border:'none', marginBottom:'12px'}}>{loading?"Creating...":"Sign Up"}</button>
        <button type="button" onClick={handleGoogle} style={{width:'100%', padding:'14px', borderRadius:'100px', background:'#222', color:'white', border:'1px solid #333', marginBottom:'12px'}}>Continue with Google</button>
        <p style={{color:'#888', textAlign:'center', fontSize:'13px'}}>Already have account? <Link href="/login" style={{color:'white'}}>Login</Link> | <Link href="/forgot-password" style={{color:'#888'}}>Forgot Password?</Link></p>
      </form>
    </div>
  )
}

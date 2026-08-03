"use client"
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

export default function ForgotPage(){
  const [email,setEmail]=useState("")
  const [newPass,setNewPass]=useState("")
  const [show,setShow]=useState(false)
  const [loading,setLoading]=useState(false)
  const router=useRouter()

  const handleReset=async(e:any)=>{
    e.preventDefault()
    if(newPass.length < 8) return alert("Password 8 char ka rakho")
    setLoading(true)
    const res=await fetch("/api/auth/forgot-password",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email: email.toLowerCase().trim(), newPassword: newPass})})
    const data=await res.json()
    if(res.ok){ alert("Password change ho gaya! Ab Login karo"); router.push("/login") } else { alert(data.error) }
    setLoading(false)
  }

  const handleGoogle=async()=>{
    const supabase=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
    await supabase.auth.signInWithOAuth({provider:'google', options:{redirectTo: `${window.location.origin}/auth/callback`}})
  }

  return(
    <div style={{minHeight:'100vh', background:'#050507', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px'}}>
      <form onSubmit={handleReset} style={{width:'100%', maxWidth:'380px', background:'#121214', border:'1px solid #222', borderRadius:'20px', padding:'24px'}}>
        <h2 style={{color:'white', textAlign:'center'}}>Reset Password</h2>
        <p style={{color:'#666', textAlign:'center', fontSize:'13px', marginBottom:'16px'}}>Email aur naya password daalo</p>
        
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Registered Email" style={{width:'100%', padding:'14px', borderRadius:'10px', background:'#1e1e22', color:'white', border:'1px solid #333', marginBottom:'12px', boxSizing:'border-box'}} />
        
        <div style={{position:'relative', marginBottom:'18px'}}>
          <input type={show?"text":"password"} value={newPass} onChange={e=>setNewPass(e.target.value)} placeholder="New Password" style={{width:'100%', padding:'14px 60px 14px 14px', borderRadius:'10px', background:'#1e1e22', color:'white', border:'1px solid #333', boxSizing:'border-box'}} />
          <button type="button" onClick={()=>setShow(!show)} style={{position:'absolute', right:'10px', top:'50%', transform:'translateY(-50%)', background:'#333', color:'white', border:'none', borderRadius:'6px', padding:'6px 10px', fontSize:'11px'}}>{show?"HIDE":"SHOW"}</button>
        </div>

        <button disabled={loading} style={{width:'100%', padding:'14px', borderRadius:'100px', background:'white', color:'black', fontWeight:800, border:'none', marginBottom:'12px'}}>{loading?"Resetting...":"Reset Password"}</button>
        
        <button type="button" onClick={handleGoogle} style={{width:'100%', padding:'14px', borderRadius:'100px', background:'#222', color:'white', border:'1px solid #333', marginBottom:'12px'}}>Or Continue with Google</button>

        <div style={{textAlign:'center', marginTop:'12px'}}>
          <Link href="/login" style={{color:'#888', fontSize:'13px', textDecoration:'none', marginRight:'10px'}}>Back to Login</Link>
          <Link href="/register" style={{color:'white', fontSize:'13px', textDecoration:'none'}}>Create Account</Link>
        </div>
      </form>
    </div>
  )
}

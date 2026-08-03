'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
export default function Admin(){
  const [users, setUsers] = useState<any[]>([]); const router = useRouter();
  useEffect(()=>{
    const u = JSON.parse(localStorage.getItem('user')||'{}');
    if(u.role!=='super_admin') router.push('/login');
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    supabase.from('users').select('*').then(({data})=>setUsers(data||[]));
  },[]);
  return <div className="min-h-screen bg-[#08080f] text-white p-8"><h1 className="text-3xl font-bold">Super Admin - All Users</h1><div className="mt-6">{users.map((u,i)=><div key={i} className="p-3 bg-[#12121f] mb-2 rounded-xl flex justify-between"><span>{u.email}</span><span className="text-yellow-400">{u.role}</span></div>)}</div></div>
}

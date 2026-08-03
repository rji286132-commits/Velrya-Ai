// forgot-password
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
export async function POST(req: Request) {
  const {email} = await req.json();
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  const {error} = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password` });
  if(error) return NextResponse.json({error: error.message}, {status: 400});
  return NextResponse.json({message: 'Reset link bhej diya gaya hai email pe'});
}

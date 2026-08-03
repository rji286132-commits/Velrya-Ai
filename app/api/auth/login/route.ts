import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ error: "Email password chahiye" }, { status: 400 })
    }
    return NextResponse.json({ message: "Login Success", user: { email } }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

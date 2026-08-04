import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    // Yaha tumhara Supabase logic ayega baad me
    // Abhi build pass karne ke liye success return kar rahe hai
    
    return NextResponse.json(
      { message: "User registered successfully", user: { email, name } },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: "Register API is working" });
}

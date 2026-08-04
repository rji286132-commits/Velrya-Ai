import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  return NextResponse.next(); // abhi ke liye sab allow
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.svg|icon.png).*)']
};

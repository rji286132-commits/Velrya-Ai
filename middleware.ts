import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Public routes for VELRYA AI
  const publicRoutes = ['/login', '/signup', '/api/auth', '/api/health'];
  const isPublic = publicRoutes.some((r) => pathname.startsWith(r));

  if (!token && !isPublic) {
    if (pathname.startsWith('/api')) {
      return NextResponse.json({ error: 'Unauthorized - VELRYA AI', app: 'VELRYA AI' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // No super_admin check needed - all users are 'user' only
  // Block old admin routes if any
  if (pathname.startsWith('/admin') || pathname.startsWith('/super-admin')) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = { 
  matcher: ['/((?!_next/static|_next/image|favicon.svg|icon.png).*)'] 
};

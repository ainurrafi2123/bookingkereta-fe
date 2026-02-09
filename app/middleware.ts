// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Daftar path yang butuh login
  const protectedPaths = ['/dashboard', '/profile', '/settings'];

  const isProtected = protectedPaths.some(path => pathname.startsWith(path));

  // Cek cookie sederhana (opsional, bisa di-set saat login)
  const hasSession = request.cookies.has('loggedIn');

  if (isProtected && !hasSession) {
    // Redirect ke login kalau cookie tidak ada
    return NextResponse.redirect(new URL('/login?from=' + pathname, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/settings/:path*'],
};
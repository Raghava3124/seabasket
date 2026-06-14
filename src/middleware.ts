import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('session')?.value;
  const path = request.nextUrl.pathname;

  // Protect /admin routes
  if (path.startsWith('/admin')) {
    if (!sessionCookie) return NextResponse.redirect(new URL('/', request.url));
    try {
      const session = JSON.parse(sessionCookie);
      if (session.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/profile', request.url));
      }
    } catch {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Protect /delivery routes
  if (path.startsWith('/delivery')) {
    if (!sessionCookie) return NextResponse.redirect(new URL('/', request.url));
    try {
      const session = JSON.parse(sessionCookie);
      if (session.role !== 'AGENT' && session.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/profile', request.url));
      }
    } catch {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/delivery/:path*'],
};

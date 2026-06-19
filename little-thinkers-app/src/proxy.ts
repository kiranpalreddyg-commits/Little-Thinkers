import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTH_PATHS = [
  '/play',
  '/my-progress',
  '/settings',
  '/learn',
  '/profile-select',
  '/parent',
  '/admin',
  '/content-manager',
];

const GUEST_ONLY_PATHS = ['/login', '/signup', '/forgot-password', '/reset-password'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthed = request.cookies.has('lt_auth');

  if (!isAuthed && (pathname === '/' || AUTH_PATHS.some((p) => pathname.startsWith(p)))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthed && GUEST_ONLY_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icons|manifest.json|sw.js).*)'],
};

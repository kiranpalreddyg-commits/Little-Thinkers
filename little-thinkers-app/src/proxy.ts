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

// Post-signup onboarding: lives under /signup but runs with the auth cookie already set.
const ONBOARDING_PATHS = ['/signup/child-setup'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthed = request.cookies.has('lt_auth');
  const isOnboarding = ONBOARDING_PATHS.some((p) => pathname.startsWith(p));

  if (!isAuthed && (pathname === '/' || isOnboarding || AUTH_PATHS.some((p) => pathname.startsWith(p)))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthed && !isOnboarding && GUEST_ONLY_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icons|manifest.json|sw.js).*)'],
};

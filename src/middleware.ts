import { NextRequest, NextResponse } from 'next/server';

const SKIP_PREFIXES = ['/_next', '/api', '/images', '/video', '/favicon'];
const SKIP_EXTENSIONS = /\.(ico|png|jpg|jpeg|gif|svg|webp|mp4|webm|css|js|map|woff2?)$/;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files and internal routes
  if (
    SKIP_PREFIXES.some((prefix) => pathname.startsWith(prefix)) ||
    SKIP_EXTENSIONS.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Spanish paths already have the locale prefix — pass through
  if (pathname === '/es' || pathname.startsWith('/es/')) {
    return NextResponse.next();
  }

  // English paths have no prefix — rewrite to /en/... so the [locale] route resolves
  const url = request.nextUrl.clone();
  url.pathname = `/en${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
};

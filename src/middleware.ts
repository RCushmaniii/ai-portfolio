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

  // Determine locale from path
  const isSpanish = pathname.startsWith('/es') && (pathname === '/es' || pathname.startsWith('/es/'));
  const locale = isSpanish ? 'es' : 'en';

  const response = NextResponse.next();
  response.headers.set('x-locale', locale);
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
};

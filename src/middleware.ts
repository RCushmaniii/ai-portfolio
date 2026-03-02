import { NextRequest, NextResponse } from 'next/server';

const LOCALE_COOKIE = 'locale';
const SKIP_PREFIXES = ['/_next', '/api', '/images', '/video', '/favicon'];
const SKIP_EXTENSIONS = /\.(ico|png|jpg|jpeg|gif|svg|webp|mp4|webm|css|js|map|woff2?)$/;

function getPreferredLocale(request: NextRequest): 'en' | 'es' {
  // 1. Cookie — user has explicitly chosen or was previously detected
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value;
  if (cookie === 'es') return 'es';
  if (cookie === 'en') return 'en';

  // 2. Accept-Language header — browser default
  const acceptLang = request.headers.get('accept-language') || '';
  // Check if any Spanish variant (es, es-MX, es-419, etc.) appears before English
  const languages = acceptLang.split(',').map((l) => l.split(';')[0].trim().toLowerCase());
  for (const lang of languages) {
    if (lang.startsWith('es')) return 'es';
    if (lang.startsWith('en')) return 'en';
  }

  return 'en';
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files and internal routes
  if (
    SKIP_PREFIXES.some((prefix) => pathname.startsWith(prefix)) ||
    SKIP_EXTENSIONS.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Explicit /es paths — serve Spanish, set cookie to remember
  if (pathname === '/es' || pathname.startsWith('/es/')) {
    const response = NextResponse.next();
    if (request.cookies.get(LOCALE_COOKIE)?.value !== 'es') {
      response.cookies.set(LOCALE_COOKIE, 'es', { path: '/', maxAge: 60 * 60 * 24 * 365 });
    }
    return response;
  }

  // No locale prefix — detect preferred language
  const preferred = getPreferredLocale(request);

  if (preferred === 'es') {
    // Redirect Spanish users to /es/... (one-time, cookie prevents repeat)
    const url = request.nextUrl.clone();
    url.pathname = `/es${pathname === '/' ? '' : pathname}`;
    const response = NextResponse.redirect(url);
    response.cookies.set(LOCALE_COOKIE, 'es', { path: '/', maxAge: 60 * 60 * 24 * 365 });
    return response;
  }

  // English — rewrite internally (no URL change, no redirect = fastest path)
  const url = request.nextUrl.clone();
  url.pathname = `/en${pathname}`;
  const response = NextResponse.rewrite(url);
  if (!request.cookies.get(LOCALE_COOKIE)) {
    response.cookies.set(LOCALE_COOKIE, 'en', { path: '/', maxAge: 60 * 60 * 24 * 365 });
  }
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
};

/* eslint-disable consistent-return */
import { ckAccessToken } from '@woi/common/meta/cookieKeys';
import { NextRequest, NextResponse } from 'next/server';
import { unprotectedRoutes } from './shared/utils/ProtectedRoute';

const PUBLIC_FILE = /\.(.*)$/;

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const prefixUrl = pathname.split('/').filter(url => url).shift();
  const cookies = req.cookies;
  const accessToken = cookies.get(ckAccessToken);

  // Bypass for Next.js files, API routes, and public files
  if (
    pathname.startsWith('/_next') ||
    pathname.includes('/api/') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Handle locale redirection
  if (req.nextUrl.locale === 'default') {
    return NextResponse.redirect(new URL(`/en${pathname}`, req.url));
  }

  // Handle protected routes and authentication
  const isUnprotectedRoute = unprotectedRoutes.some(route => pathname.includes(route));
  const isLoginPage = (pathname === `/${prefixUrl}/login`) || (pathname === `/${prefixUrl}/login/`);
  const pathnameTrim = pathname.substring(0, pathname.length - 1);
  const lastPage = pathnameTrim.replace(`/${prefixUrl}`, '');
  const isAccessToken = Boolean(accessToken);

  if (!isUnprotectedRoute && prefixUrl === 'co') {
    if (isAccessToken && isLoginPage) {
      return NextResponse.redirect(new URL(`/${prefixUrl}/`, req.url));
    } else if (!isAccessToken && !isLoginPage) {
      if (pathname === `/${prefixUrl}/`) {
        return NextResponse.redirect(new URL(`/${prefixUrl}/login`, req.url));
      } else {
        return NextResponse.redirect(new URL(`/${prefixUrl}/login?referer=${encodeURIComponent(lastPage)}`, req.url));
      }
    }
  }

  return NextResponse.next();
}
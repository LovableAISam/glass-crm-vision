/* eslint-disable consistent-return */
import { ckAccessToken } from '@woi/common/meta/cookieKeys';
import { getJwtData, isExpiredToken } from '@woi/core/utils/jwt/jwt';
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'
import { unprotectedRoutes } from './shared/utils/ProtectedRoute';

const PUBLIC_FILE = /\.(.*)$/

export async function middleware(req: NextRequest, _: NextFetchEvent) {
  if (
    req.nextUrl.pathname.startsWith('/_next') ||
    req.nextUrl.pathname.includes('/api/') ||
    PUBLIC_FILE.test(req.nextUrl.pathname)
  ) {
    return
  }

  if (req.nextUrl.locale === 'default') {
    return NextResponse.redirect(new URL(`/en${req.nextUrl.pathname}`, req.url))
  }

  const { pathname, search } = req.nextUrl;
  const cookies = req.cookies;

  if (!unprotectedRoutes.includes(pathname)) {
    const lastPage = `${pathname}${search}`;
    if (cookies) {
      const accessToken = cookies.get(ckAccessToken);
      if (accessToken) {
        const jwtData = getJwtData(accessToken)
        const expiredToken = isExpiredToken(jwtData.exp)
        if (expiredToken) {
          if (pathname !== '/') {
            return NextResponse.redirect(new URL(`/login?referer=${encodeURIComponent(lastPage)}`, req.url));
          }
          return NextResponse.redirect(new URL(`/login`, req.url));
        }
      } else {
        if (pathname !== '/') {
          return NextResponse.redirect(new URL(`/login?referer=${encodeURIComponent(lastPage)}`, req.url));
        }
        return NextResponse.redirect(new URL(`/login`, req.url));
      }
    }
  }

  return NextResponse.next()
}
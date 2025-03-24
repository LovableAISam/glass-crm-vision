/* eslint-disable consistent-return */
import { ckAccessToken, ckMerchantAccessToken } from '@woi/common/meta/cookieKeys';
import { NextRequest, NextResponse } from 'next/server';
import { unprotectedRoutes } from "./shared/utils/ProtectedRoute";

const PUBLIC_FILE = /\.(.*)$/;

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isMerchant = pathname.includes('/merchant/');
  const prefixUrl = isMerchant ? `${pathname.split('/').filter(url => url).shift()}/merchant` : pathname.split('/').filter(url => url).shift();
  const cookies = req.cookies;
  const accessToken = isMerchant ? cookies.get(ckMerchantAccessToken) : cookies.get(ckAccessToken);

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
  const isLoginPage = (pathname === `/${prefixUrl}/login`) || (pathname === `/${prefixUrl}/login/`);
  // const isDashboardMerchant = (pathname === `/${prefixUrl}/`) || (pathname === `/${prefixUrl}/`);

  const isUnprotectedRoute = unprotectedRoutes.some(route => pathname.includes(route));
  const pathnameTrim = pathname.substring(0, pathname.length - 1);
  const lastPage = pathnameTrim.replace(`/${prefixUrl}`, '');
  const isAccessToken = Boolean(accessToken);

  if (!isUnprotectedRoute && prefixUrl) {
    // Access pages except index
    if (isLoginPage && isAccessToken) {
      // Login page with access token -> redirect to dashboard
      return NextResponse.redirect(new URL(`/${prefixUrl}/`, req.url));
    } else if (!isLoginPage && !isAccessToken) {
      // Access page except login & no access token
      if (pathname === `/${prefixUrl}/`) {
        return NextResponse.redirect(new URL(`/${prefixUrl}/login`, req.url));
      } else if (!isMerchant) {
        return NextResponse.redirect(new URL(`/${prefixUrl}/login?referer=${encodeURIComponent(lastPage)}`, req.url));
      } else {
        return NextResponse.redirect(new URL(`/${prefixUrl}/login`, req.url));
      }
    }
  }

  // if (isDashboardMerchant && isAccessToken) {
  //   return NextResponse.redirect(new URL(`/${prefixUrl}/account-profile`, req.url));
  // }

  // Bypass all the conditions & continue
  // Continue to access the index & show 'Community Owner Not Found'
  return NextResponse.next();
}


// export async function middleware(req: NextRequest) {
//   if (
//     req.nextUrl.pathname.startsWith('/_next') ||
//     req.nextUrl.pathname.includes('/api/') ||
//     req.nextUrl.pathname.includes('/404/') ||
//     PUBLIC_FILE.test(req.nextUrl.pathname)
//   ) {
//     return;
//   }

//   if (req.nextUrl.locale === 'default') {
//     return NextResponse.redirect(new URL(`/en${req.nextUrl.pathname}`, req.url));
//   }

//   const { pathname } = req.nextUrl;
//   const isMerchant = pathname.includes('/merchant/');

//   const prefixUrl = isMerchant ? `${pathname.split('/').filter(url => url).shift()}/merchant` : pathname.split('/').filter(url => url).shift();
//   const cookies = req.cookies;

//   if (pathname !== '/' && !unprotectedRoutes.some(route => pathname.includes(route))) {
//     const pathnameTrim = pathname.substring(0, pathname.length - 1);
//     const pathnameWithoutPrefix = pathnameTrim.replace(`/${prefixUrl}`, '');
//     if (cookies) {
//       const accessToken = isMerchant ? cookies.get(ckMerchantAccessToken) : cookies.get(ckAccessToken);
//       if (accessToken) {
//         const jwtData = getJwtData(accessToken);
//         const expiredToken = isExpiredToken(jwtData.exp);
//         if (expiredToken) {
//           if (pathnameWithoutPrefix !== '' && pathnameWithoutPrefix !== '/') {
//             return NextResponse.redirect(new URL(`/${prefixUrl}/login`, req.url));
//           }
//           return NextResponse.redirect(new URL(`/${prefixUrl}/login`, req.url));
//         }
//       } else {
//         if (pathnameWithoutPrefix !== '' && pathnameWithoutPrefix !== '/') {
//           return NextResponse.redirect(new URL(`/${prefixUrl}/login`, req.url));
//         }
//         return NextResponse.redirect(new URL(`/${prefixUrl}/login`, req.url));
//       }
//     }
//   }

//   return NextResponse.next();
// }
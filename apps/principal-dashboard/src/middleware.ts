/* eslint-disable consistent-return */
import { ckAccessToken } from '@woi/common/meta/cookieKeys';
import { NextRequest, NextResponse } from 'next/server';
import { unprotectedRoutes } from './shared/utils/ProtectedRoute';
// import { generateMenu, MenuType } from "./shared/constants/menu";
// import { getJwtData } from "@woi/core/utils/jwt/jwt";

const PUBLIC_FILE = /\.(.*)$/;

export async function middleware(req: NextRequest) {
  if (
    req.nextUrl.pathname.startsWith('/_next') ||
    req.nextUrl.pathname.includes('/api/') ||
    PUBLIC_FILE.test(req.nextUrl.pathname)
  ) {
    return;
  }

  if (req.nextUrl.locale === 'default') {
    return NextResponse.redirect(new URL(`/en${req.nextUrl.pathname}`, req.url));
  }

  // function hasAccess(
  //   pathname: string,
  //   menuList: MenuType[],
  //   authoritie: string[],
  // ): boolean {
  //   const cleanPathname = pathname.replace(/^\/co/, '').replace(/\/$/, '');
  //   function flattenMenuItems(items: MenuType[]): MenuType[] {
  //     return items.flatMap(item => {
  //       if (item.children) {
  //         return [...flattenMenuItems(item.children)];
  //       }
  //       return item;
  //     });
  //   }
  //   const flattenedMenu = flattenMenuItems(menuList);
  //   const filteredMenu = flattenedMenu.filter(item => {
  //     return authoritie.some(auth => item.privilege + ':get' === auth);
  //   });
  //   return filteredMenu.some(item => item.menuLink === cleanPathname);
  // }

  const { pathname } = req.nextUrl;
  const prefixUrl = pathname.split('/').filter(url => url).shift();
  const cookies = req.cookies;
  const accessToken = cookies.get(ckAccessToken);

  if (pathname !== '/' && !unprotectedRoutes.some(route => pathname.includes(route))) {
    if (!accessToken) {
      return NextResponse.redirect(new URL(`/${prefixUrl}/login`, req.url));
    }
    // else {
    //   const menuLists = generateMenu('Admin');

    //   if (!hasAccess(pathname, menuLists, getJwtData(accessToken).authorities)) {
    //     return NextResponse.redirect(new URL(`/${prefixUrl}/404`, req.url));
    //   }

    // }
  }



  return NextResponse.next();
}
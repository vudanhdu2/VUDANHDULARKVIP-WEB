/**
 * Middleware — bảo vệ /admin/* routes.
 *
 * Chưa login → redirect /login.
 * NextAuth v5 export `auth` middleware compatible với Edge runtime.
 */

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export default auth((req) => {
  const { nextUrl } = req;
  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isLoggedIn = !!req.auth?.user;

  if (isAdminRoute && !isLoggedIn) {
    const loginUrl = new URL("/login", nextUrl);
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

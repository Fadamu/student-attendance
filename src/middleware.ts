import { NextRequest, NextResponse } from "next/server";
import { getSessionCookieName, verifySession } from "@/lib/auth";

const protectedRoutes = [
  "/dashboard",
  "/attendance",
  "/history",
];

const authRoutes: string[] = [];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute = protectedRoutes.some(
    (route) =>
      pathname === route ||
      pathname.startsWith(`${route}/`),
  );

  const isAuthRoute = authRoutes.some(
    (route) =>
      pathname === route ||
      pathname.startsWith(`${route}/`),
  );

  if (!isProtectedRoute && !isAuthRoute) {
    return NextResponse.next();
  }

  const token = request.cookies.get(
    getSessionCookieName(),
  )?.value;

  const session = token
    ? await verifySession(token)
    : null;

  if (isProtectedRoute && !session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);

    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && session) {
    return NextResponse.redirect(
      new URL("/dashboard", request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/attendance/:path*",
    "/history/:path*",
    "/login",
    "/register",
  ],
};


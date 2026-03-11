import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const authMiddleware = withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Strip locale prefix for path matching (/en/admin -> /admin)
    const pathWithoutLocale = path.replace(/^\/(en|ru)/, "");

    // Admin routes require ADMIN role
    if (pathWithoutLocale.startsWith("/admin") && token?.role !== "ADMIN") {
      const locale = path.match(/^\/(en|ru)/)?.[1] ?? "en";
      return NextResponse.redirect(new URL(`/${locale}/dashboard`, req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

// Paths that require authentication (with locale prefix)
const authProtectedPattern =
  /^\/(en|ru)\/(dashboard|company|products\/new|products\/edit|rfq\/new|admin)(\/.*)?$/;

export default function middleware(req: Parameters<typeof intlMiddleware>[0]) {
  const { pathname } = req.nextUrl;

  if (authProtectedPattern.test(pathname)) {
    return (authMiddleware as ReturnType<typeof withAuth>)(req as never, {} as never);
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};

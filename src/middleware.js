import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(req) {
    const pathname = req.nextUrl.pathname;

    // Manage route protection
    const isAuth = await getToken({ req });
    const isLoginPage = pathname === "/" || pathname === "/search"; // Changed this line to treat root as login page

    const sensitiveRoutes = [
      "/referral-status",
      "/dashboard",
      "/user",
      "/ask-referral",
      "/new/user",
      "/faq",
    ];
    const isAccessingSensitiveRoute = sensitiveRoutes.some((route) =>
      pathname.startsWith(route)
    );

    if (isLoginPage) {
      if (isAuth) {
        if (isAuth.userNew) {
          return NextResponse.redirect(new URL("/new/user", req.url)); // Redirect to a page for new users
        } else {
          return NextResponse.redirect(new URL("/ask-referral", req.url)); // Redirect to a referral page or dashboard
        }
      } else {
        return NextResponse.next(); // Continue processing for non-authenticated users
      }
    }

    // Removed the condition that redirects from root as it's now the login page

    if (!isAuth && isAccessingSensitiveRoute) {
      return NextResponse.redirect(new URL("/", req.url)); // Redirect to root as it's the login page now
    }
  },
  {
    callbacks: {
      async authorized() {
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/",
    "/search",
    "/dashboard/:path*",
    "/referral-status/:path*",
    "/user/:path*",
    "/ask-referral/:path*",
    "/new/user",
    "/faq",
  ],
};

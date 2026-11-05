import { NextRequest, NextResponse } from "next/server";
import { ADMIN_BASE_PATH, SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const isValid = token ? await verifySessionToken(token) : false;

  if (pathname === `${ADMIN_BASE_PATH}/login`) {
    if (isValid) {
      return NextResponse.redirect(new URL(ADMIN_BASE_PATH, request.url));
    }
    return NextResponse.next();
  }

  if (!isValid) {
    return NextResponse.redirect(new URL(`${ADMIN_BASE_PATH}/login`, request.url));
  }

  return NextResponse.next();
}

// Keep this literal in sync with ADMIN_BASE_PATH in lib/auth.ts — Next.js
// statically parses `matcher`, so it can't reference an imported constant.
export const config = {
  matcher: ["/admin@2026!/:path*"],
};

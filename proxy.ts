import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifySession, SESSION_COOKIE } from "./lib/auth"

export async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname

  const protectedAdmin = pathname.startsWith("/admin")
  const protectedCoach = pathname.startsWith("/coach")
  if (!protectedAdmin && !protectedCoach) {
    return NextResponse.next()
  }

  const token = req.cookies.get(SESSION_COOKIE)?.value
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  const session = await verifySession(token)
  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  if (protectedAdmin && session.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/login", req.url))
  }
  if (protectedCoach && !(session.role === "COACH" || session.role === "ADMIN")) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/coach/:path*", "/api/admin/:path*"],
}

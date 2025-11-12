import { NextResponse } from "next/server"
import { SESSION_COOKIE } from "@/lib/auth"

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") || ""
  const isJson = contentType.includes("application/json")
  const res = isJson
    ? NextResponse.json({ success: true })
    : NextResponse.redirect(new URL("/", request.url))
  res.cookies.set(SESSION_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 })
  return res
}

import { NextResponse } from "next/server"
import prisma from "../../../../lib/prisma"
import bcrypt from "bcryptjs"
import { createSession, SESSION_COOKIE } from "../../../../lib/auth"

export async function POST(request: Request) {
  try {
    let email = ""
    let password = ""
    const contentType = request.headers.get("content-type") || ""
    if (contentType.includes("application/json")) {
      const body = await request.json()
      email = body?.email || ""
      password = body?.password || ""
    } else {
      const form = await request.formData()
      email = String(form.get("email") || "")
      password = String(form.get("password") || "")
    }
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !user.passwordHash) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Require admin approval for non-admin accounts
    if (user.role !== "ADMIN" && user.approved !== true) {
      return NextResponse.json({ error: "Your account is pending admin approval." }, { status: 403 })
    }

  const token = await createSession({ sub: String(user.id), email: user.email, role: user.role as "ADMIN" | "COACH" | "STUDENT" })
    const isFormPost = contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data") || !contentType.includes("application/json")
    const destination = user.role === "ADMIN" ? "/admin" : user.role === "COACH" ? "/coach" : user.role === "STUDENT" ? "/student" : "/coaches"
    const res = isFormPost
      ? NextResponse.redirect(new URL(destination, request.url))
      : NextResponse.json({ success: true, redirect: destination })
    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    })
  return res
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

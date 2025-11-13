import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { hash } from "bcryptjs"
// Note: no session issuance here; admin approval required before login

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password, role } = body as { name?: string; email?: string; password?: string; role?: string }

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return NextResponse.json({ error: "Email already in use" }, { status: 409 })

    const passwordHash = await hash(password, 10)
    // Map role string to enum
    const normalizedRole = role === 'Coach' || role === 'COACH' ? 'COACH' : 'STUDENT'

    await prisma.user.create({
      data: {
        email,
        name: name || null,
        passwordHash,
        role: normalizedRole as "COACH" | "STUDENT",
        approved: false,
        ...(normalizedRole === 'COACH' ? { coachProfile: { create: {} } } : { studentProfile: { create: {} } })
      },
      select: { id: true, email: true, name: true, role: true }
    })

    // Do not auto-login unapproved users; require admin approval first
  return NextResponse.json({ success: true, message: "Signup received. An admin must approve your account before you can sign in." })
  } catch (err) {
    console.error("/api/auth/signup error", err)
    return NextResponse.json({ error: "Failed to sign up" }, { status: 500 })
  }
}

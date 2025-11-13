import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { verifySession, SESSION_COOKIE } from "@/lib/auth"

async function getSession(request: Request) {
  const cookie = request.headers.get("cookie") || ""
  const match = cookie.match(new RegExp(`${SESSION_COOKIE}=([^;]+)`))
  const token = match?.[1]
  if (!token) return null
  return await verifySession(token)
}

export async function GET(request: Request) {
  try {
    const session = await getSession(request)
    if (!session || (session.role !== "COACH" && session.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const coachId = Number(session.sub)
    const students = await prisma.user.findMany({
      where: { role: "STUDENT", studentProfile: { coachId } },
      select: { id: true, email: true, name: true, studentProfile: { select: { level: true, goals: true } } },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json({ students: students.map(s => ({ id: s.id, email: s.email, name: s.name, level: s.studentProfile?.level || null, goals: s.studentProfile?.goals || null })) })
  } catch (error) {
    console.error("/api/coach/students error", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

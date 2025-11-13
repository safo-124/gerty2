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
    const lessons = await prisma.lesson.findMany({
      where: { coachId },
      orderBy: { scheduledAt: "asc" },
      select: { id: true, title: true, scheduledAt: true, duration: true, capacity: true, status: true },
    })
    return NextResponse.json({ lessons })
  } catch (error) {
    console.error("/api/coach/lessons GET error", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession(request)
    if (!session || (session.role !== "COACH" && session.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const coachId = Number(session.sub)
    const body = await request.json()
    const { title, scheduledAt, duration } = body as { title?: string; scheduledAt?: string; duration?: number }
    if (!title || !scheduledAt) {
      return NextResponse.json({ error: "title and scheduledAt are required" }, { status: 400 })
    }
    const created = await prisma.lesson.create({
      data: {
        title,
        scheduledAt: new Date(scheduledAt),
        duration: duration ?? null,
        coachId,
      }
    })
    return NextResponse.json({ lesson: created })
  } catch (error) {
    console.error("/api/coach/lessons POST error", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

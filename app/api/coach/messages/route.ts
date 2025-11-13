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
    const url = new URL(request.url)
    const studentId = Number(url.searchParams.get("studentId"))
    if (!studentId) return NextResponse.json({ error: "studentId required" }, { status: 400 })

    // Only allow fetching messages with assigned students when coach is not admin
    const assigned = await prisma.user.findFirst({ where: { id: studentId, role: "STUDENT", studentProfile: { coachId } }, select: { id: true } })
    if (!assigned && session.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: coachId, recipientId: studentId },
          { senderId: studentId, recipientId: coachId },
        ]
      },
      orderBy: { createdAt: "asc" },
      select: { id: true, senderId: true, recipientId: true, content: true, createdAt: true }
    })

    return NextResponse.json({ messages })
  } catch (error) {
    console.error("/api/coach/messages GET error", error)
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
    const { studentId, content } = body as { studentId?: number; content?: string }
    if (!studentId || !content?.trim()) return NextResponse.json({ error: "studentId and content required" }, { status: 400 })

    const assigned = await prisma.user.findFirst({ where: { id: studentId, role: "STUDENT", studentProfile: { coachId } }, select: { id: true } })
    if (!assigned && session.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const msg = await prisma.message.create({ data: { senderId: coachId, recipientId: studentId, content: content.trim() } })
    return NextResponse.json({ message: { id: msg.id } })
  } catch (error) {
    console.error("/api/coach/messages POST error", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

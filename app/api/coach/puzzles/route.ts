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
    const puzzles = await prisma.puzzle.findMany({
      where: { coachId },
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, fen: true, difficulty: true, createdAt: true }
    })
    return NextResponse.json({ puzzles })
  } catch (error) {
    console.error("/api/coach/puzzles GET error", error)
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
    const { title, fen, solution, difficulty, assignTo } = body as { title?: string; fen?: string; solution?: string; difficulty?: string; assignTo?: number[] }
    if (!title || !fen || !solution) {
      return NextResponse.json({ error: "title, fen and solution are required" }, { status: 400 })
    }

    const created = await prisma.puzzle.create({
      data: {
        coachId, title, fen, solution, difficulty: difficulty || null,
        assignments: assignTo && assignTo.length > 0 ? {
          createMany: { data: assignTo.map(studentId => ({ studentId })) }
        } : undefined,
      },
      select: { id: true }
    })

    return NextResponse.json({ puzzle: created })
  } catch (error) {
    console.error("/api/coach/puzzles POST error", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

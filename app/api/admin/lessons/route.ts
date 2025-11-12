import { NextResponse } from "next/server"
import { verifySession, SESSION_COOKIE } from "@/lib/auth"
import prisma from "@/lib/prisma"

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
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const lessons = await prisma.lesson.findMany({
      orderBy: { scheduledAt: "desc" },
      include: {
        coach: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        _count: {
          select: { enrollments: true }
        }
      }
    })

    return NextResponse.json({ lessons })
  } catch (error) {
    console.error("Error fetching lessons:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession(request)
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { title, description, scheduledAt, duration, capacity, location, coachId, status } = await request.json()

    if (!title || !scheduledAt || !coachId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const lesson = await prisma.lesson.create({
      data: {
        title,
        description,
        scheduledAt: new Date(scheduledAt),
        duration,
        capacity,
        location,
        status: status || "scheduled",
        coachId: parseInt(coachId),
      }
    })

    return NextResponse.json({ lesson }, { status: 201 })
  } catch (error) {
    console.error("Error creating lesson:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

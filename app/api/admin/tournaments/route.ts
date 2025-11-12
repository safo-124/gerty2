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

    const tournaments = await prisma.tournament.findMany({
      orderBy: { startDate: "desc" },
      include: {
        _count: { select: { participants: true } }
      }
    })

    return NextResponse.json({ tournaments })
  } catch (error) {
    console.error("Error fetching tournaments:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession(request)
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { name, description, startDate, endDate, location, maxPlayers, registrationDeadline, imageUrl, status } = await request.json()

    if (!name || !startDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const tournament = await prisma.tournament.create({
      data: {
        name,
        description,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        location,
        maxPlayers: maxPlayers ? parseInt(maxPlayers) : null,
        registrationDeadline: registrationDeadline ? new Date(registrationDeadline) : null,
        imageUrl,
        status: status || "upcoming",
      }
    })

    return NextResponse.json({ tournament }, { status: 201 })
  } catch (error) {
    console.error("Error creating tournament:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

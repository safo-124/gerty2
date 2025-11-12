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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession(request)
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { id: idParam } = await params
    const id = parseInt(idParam)
    const body = await request.json()

    const tournament = await prisma.tournament.update({
      where: { id },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.startDate && { startDate: new Date(body.startDate) }),
        ...(body.endDate !== undefined && { endDate: body.endDate ? new Date(body.endDate) : null }),
        ...(body.location !== undefined && { location: body.location }),
        ...(body.maxPlayers !== undefined && { maxPlayers: body.maxPlayers ? parseInt(body.maxPlayers) : null }),
        ...(body.status && { status: body.status }),
      }
    })

    return NextResponse.json({ tournament })
  } catch (error) {
    console.error("Error updating tournament:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

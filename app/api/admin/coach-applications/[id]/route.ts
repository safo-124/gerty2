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
    const { status, notes } = await request.json()

    const application = await prisma.coachApplication.update({
      where: { id },
      data: {
        status,
        notes,
        reviewedAt: new Date(),
        reviewedBy: parseInt(session.sub),
      }
    })

    return NextResponse.json({ application })
  } catch (error) {
    console.error("Error reviewing application:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

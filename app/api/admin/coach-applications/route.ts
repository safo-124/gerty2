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

    const applications = await prisma.coachApplication.findMany({
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json({ applications })
  } catch (error) {
    console.error("Error fetching coach applications:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

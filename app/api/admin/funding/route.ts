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

    const projects = await prisma.fundingProject.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { donations: true }
        }
      }
    })

    return NextResponse.json({ projects })
  } catch (error) {
    console.error("Error fetching funding projects:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession(request)
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { title, description, goalAmount, imageUrl, status } = await request.json()

    if (!title || !goalAmount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const project = await prisma.fundingProject.create({
      data: {
        title,
        description,
        goalAmount,
        imageUrl,
        status: status || "active",
      }
    })

    return NextResponse.json({ project }, { status: 201 })
  } catch (error) {
    console.error("Error creating funding project:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

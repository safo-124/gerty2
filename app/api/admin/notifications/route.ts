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

export async function POST(request: Request) {
  try {
    const session = await getSession(request)
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { title, message, targetRole } = await request.json()

    if (!title || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create notification
    await prisma.notification.create({
      data: {
        title,
        message,
        targetRole: targetRole === "all" ? null : targetRole,
        createdBy: parseInt(session.sub),
      }
    })

    // Count recipients
    const recipientCount = targetRole === "all" 
      ? await prisma.user.count()
      : await prisma.user.count({ where: { role: targetRole } })

    return NextResponse.json({ 
      message: "Notification sent",
      recipientCount 
    }, { status: 201 })
  } catch (error) {
    console.error("Error sending notification:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

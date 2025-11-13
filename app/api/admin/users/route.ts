import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { verifySession, SESSION_COOKIE } from "@/lib/auth"
// Types will be inferred; avoid tight coupling to generated Prisma types here

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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const usersRaw: Array<{
      id: number; email: string; name: string | null; role: "ADMIN" | "COACH" | "STUDENT"; createdAt: Date; approved: boolean; approvedAt: Date | null
    }> = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, email: true, name: true, role: true, createdAt: true, approved: true, approvedAt: true },
    })
    const users = usersRaw.map((u) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role as "ADMIN" | "COACH" | "STUDENT",
      createdAt: u.createdAt,
      approved: u.approved,
    }))
    return NextResponse.json({ users })
  } catch (error) {
    console.error("Admin users GET error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getSession(request)
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const body = await request.json()
  const { userId, role, approved } = body || {}
    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 })
    }
  const updateData: { role?: "ADMIN" | "COACH" | "STUDENT"; approved?: boolean; approvedAt?: Date | null } = {}
    if (role) {
      if (!["ADMIN", "COACH", "STUDENT"].includes(role)) {
        return NextResponse.json({ error: "Invalid role" }, { status: 400 })
      }
  updateData.role = role as "ADMIN" | "COACH" | "STUDENT"
    }
    if (typeof approved === "boolean") {
  updateData.approved = approved
  updateData.approvedAt = approved ? new Date() : null
    }
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 })
    }
    const updated = await prisma.user.update({
      where: { id: Number(userId) },
      data: updateData,
    })
    return NextResponse.json({
      user: {
        id: updated.id,
        email: updated.email,
        role: updated.role,
        approved: updated.approved,
      },
    })
  } catch (error) {
    console.error("Admin users PATCH error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSession(request)
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const body = await request.json().catch(() => ({}))
    const { userId } = body as { userId?: number }
    if (!userId) return NextResponse.json({ error: "userId is required" }, { status: 400 })

    const user = await prisma.user.findUnique({ where: { id: Number(userId) }, select: { id: true, role: true } })
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })
    if (user.role === "ADMIN") return NextResponse.json({ error: "Cannot delete admin users" }, { status: 400 })

    // Clean up simple dependent records (profiles) first
    await prisma.studentProfile.deleteMany({ where: { userId: Number(userId) } })
    await prisma.coachProfile.deleteMany({ where: { userId: Number(userId) } })

    // Attempt to delete the user
    await prisma.user.delete({ where: { id: Number(userId) } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Admin users DELETE error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

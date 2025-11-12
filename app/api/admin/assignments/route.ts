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

    const { studentId, coachId } = await request.json()

    if (!studentId) {
      return NextResponse.json({ error: "Student ID required" }, { status: 400 })
    }

    // Ensure student profile exists
    const student = await prisma.user.findUnique({
      where: { id: studentId },
      include: { studentProfile: true }
    })

    if (!student || student.role !== "STUDENT") {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    // Create or update student profile with coach assignment
    if (!student.studentProfile) {
      await prisma.studentProfile.create({
        data: {
          userId: studentId,
          level: "Beginner",
          coachId: coachId,
        }
      })
    } else {
      await prisma.studentProfile.update({
        where: { userId: studentId },
        data: { coachId: coachId }
      })
    }

    return NextResponse.json({ 
      message: "Assignment updated",
      studentId,
      coachId 
    })
  } catch (error) {
    console.error("Error assigning coach:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

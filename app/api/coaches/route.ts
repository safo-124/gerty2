import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const coaches = await prisma.user.findMany({
      where: { role: "COACH", approved: true },
      select: {
        id: true,
        name: true,
        email: true,
        coachProfile: {
          select: { bio: true, rating: true, availability: true }
        }
      },
      orderBy: { createdAt: "desc" }
    })
    return NextResponse.json({ coaches })
  } catch (err) {
    console.error("/api/coaches error", err)
    return NextResponse.json({ error: "Failed to load coaches" }, { status: 500 })
  }
}

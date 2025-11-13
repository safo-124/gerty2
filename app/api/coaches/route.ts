import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const coachesAll = await prisma.user.findMany({
      where: { role: "COACH" },
      select: {
        id: true,
        name: true,
        email: true,
        coachProfile: {
          select: { bio: true, rating: true, availability: true }
        }
      }
    })
    const coaches = (coachesAll as unknown as ({ id: number; name: string | null; email: string; coachProfile: { bio: string | null; rating: number | null; availability: string | null } | null } & { approved?: boolean })[])
      .filter((c) => c.approved !== false)
    return NextResponse.json({ coaches })
  } catch (err) {
    console.error("/api/coaches error", err)
    return NextResponse.json({ error: "Failed to load coaches" }, { status: 500 })
  }
}

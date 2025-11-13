import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { verifySession, SESSION_COOKIE } from "@/lib/auth";

async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = await verifySession(token);
  return session ? { id: Number(session.sub), email: session.email, role: session.role } : null;
}

export async function GET() {
  try {
    const user = await getUser();
    if (!user || user.role !== "STUDENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get student profile with assigned coach
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: user.id },
      include: {
        user: {
          include: {
            coachProfile: true,
          },
        },
      },
    });

    if (!studentProfile?.coachId) {
      return NextResponse.json(null);
    }

    // Get coach details
    const coach = await prisma.user.findUnique({
      where: { id: studentProfile.coachId },
      include: {
        coachProfile: true,
      },
    });

    return NextResponse.json(coach);
  } catch (error) {
    console.error("Error fetching coach:", error);
    return NextResponse.json(
      { error: "Failed to fetch coach" },
      { status: 500 }
    );
  }
}

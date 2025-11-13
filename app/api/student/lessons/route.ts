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

// GET: Fetch all lessons (with enrollment status)
export async function GET() {
  try {
    const user = await getUser();
    if (!user || user.role !== "STUDENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all scheduled lessons with enrollment info
    const lessons = await prisma.lesson.findMany({
      where: {
        status: "scheduled",
        scheduledAt: {
          gte: new Date(), // Only future lessons
        },
      },
      include: {
        coach: {
          select: {
            name: true,
            email: true,
          },
        },
        enrollments: {
          where: {
            userId: user.id,
          },
        },
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
      orderBy: {
        scheduledAt: "asc",
      },
    });

    // Map to include enrollment status
    const lessonsWithStatus = lessons.map((lesson) => ({
      ...lesson,
      enrollment: lesson.enrollments[0] || null,
    }));

    return NextResponse.json(lessonsWithStatus);
  } catch (error) {
    console.error("Error fetching lessons:", error);
    return NextResponse.json(
      { error: "Failed to fetch lessons" },
      { status: 500 }
    );
  }
}

// POST: Enroll in a lesson
export async function POST(request: Request) {
  try {
    const user = await getUser();
    if (!user || user.role !== "STUDENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { lessonId } = await request.json();

    if (!lessonId) {
      return NextResponse.json(
        { error: "Lesson ID is required" },
        { status: 400 }
      );
    }

    // Check if already enrolled
    const existing = await prisma.enrollment.findUnique({
      where: {
        userId_lessonId: {
          userId: user.id,
          lessonId: parseInt(lessonId),
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Already enrolled" },
        { status: 400 }
      );
    }

    // Create enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: user.id,
        lessonId: parseInt(lessonId),
        status: "enrolled",
      },
    });

    return NextResponse.json(enrollment);
  } catch (error) {
    console.error("Error enrolling in lesson:", error);
    return NextResponse.json(
      { error: "Failed to enroll in lesson" },
      { status: 500 }
    );
  }
}

// DELETE: Cancel enrollment
export async function DELETE(request: Request) {
  try {
    const user = await getUser();
    if (!user || user.role !== "STUDENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { lessonId } = await request.json();

    if (!lessonId) {
      return NextResponse.json(
        { error: "Lesson ID is required" },
        { status: 400 }
      );
    }

    // Delete enrollment
    await prisma.enrollment.delete({
      where: {
        userId_lessonId: {
          userId: user.id,
          lessonId: parseInt(lessonId),
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error canceling enrollment:", error);
    return NextResponse.json(
      { error: "Failed to cancel enrollment" },
      { status: 500 }
    );
  }
}

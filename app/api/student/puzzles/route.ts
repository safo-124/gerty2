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

// GET: Fetch all puzzles assigned to student
export async function GET() {
  try {
    const user = await getUser();
    if (!user || user.role !== "STUDENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all puzzles assigned to this student
    const assignments = await prisma.studentPuzzle.findMany({
      where: {
        studentId: user.id,
      },
      include: {
        puzzle: true,
      },
      orderBy: {
        assignedAt: "desc",
      },
    });

    // Map to include assignment status
    const puzzlesWithStatus = assignments.map((assignment) => ({
      ...assignment.puzzle,
      assignment: {
        status: assignment.status,
        score: assignment.score,
      },
    }));

    return NextResponse.json(puzzlesWithStatus);
  } catch (error) {
    console.error("Error fetching puzzles:", error);
    return NextResponse.json(
      { error: "Failed to fetch puzzles" },
      { status: 500 }
    );
  }
}

// POST: Submit puzzle solution (mark as completed)
export async function POST(request: Request) {
  try {
    const user = await getUser();
    if (!user || user.role !== "STUDENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { puzzleId, score } = await request.json();

    if (!puzzleId) {
      return NextResponse.json(
        { error: "Puzzle ID is required" },
        { status: 400 }
      );
    }

    // Update assignment to completed
    const updated = await prisma.studentPuzzle.update({
      where: {
        puzzleId_studentId: {
          puzzleId: parseInt(puzzleId),
          studentId: user.id,
        },
      },
      data: {
        status: "completed",
        score: score || 100,
        completedAt: new Date(),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error submitting puzzle:", error);
    return NextResponse.json(
      { error: "Failed to submit puzzle" },
      { status: 500 }
    );
  }
}

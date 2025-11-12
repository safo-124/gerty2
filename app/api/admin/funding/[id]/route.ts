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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession(request)
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { id: idParam } = await params
    const id = parseInt(idParam)
    const { title, description, goalAmount, imageUrl, status } = await request.json()

    const project = await prisma.fundingProject.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(goalAmount && { goalAmount }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(status && { status }),
      }
    })

    return NextResponse.json({ project })
  } catch (error) {
    console.error("Error updating funding project:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

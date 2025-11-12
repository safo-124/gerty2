import { NextResponse } from "next/server"
import prisma from "../../../../lib/prisma"
import { verifySession, SESSION_COOKIE } from "../../../../lib/auth"

export async function GET(request: Request) {
  const cookie = (request.headers.get("cookie") || "")
  const match = cookie.match(new RegExp(`${SESSION_COOKIE}=([^;]+)`))
  const token = match?.[1]

  if (!token) return NextResponse.json({ user: null })

  const session = await verifySession(token)
  if (!session) return NextResponse.json({ user: null })

  const user = await prisma.user.findUnique({
    where: { id: Number(session.sub) },
    select: { id: true, email: true, name: true, role: true },
  })

  return NextResponse.json({ user })
}

import { SignJWT, jwtVerify, JWTPayload } from "jose"

const alg = "HS256"
const SESSION_COOKIE = "session"

export type SessionPayload = {
  sub: string
  email: string
  role: "ADMIN" | "COACH" | "STUDENT"
}

function getSecret() {
  const secret = process.env.APP_JWT_SECRET
  if (!secret) throw new Error("APP_JWT_SECRET is not set")
  return new TextEncoder().encode(secret)
}

export async function createSession(payload: SessionPayload) {
  const token = await new SignJWT(payload as unknown as JWTPayload)
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret())
  return token
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret())
    return payload as unknown as SessionPayload
  } catch {
    return null
  }
}

export { SESSION_COOKIE }

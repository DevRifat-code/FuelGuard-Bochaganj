import * as bcrypt from "bcryptjs"
import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import {
  getUsersByField,
  getUserById,
  type FirestoreUser,
} from "./firestore-admin"

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fuelguard-uno-setabganj-secret-key-2026"
)

export interface AuthUser {
  id: string
  username: string
  role: "admin" | "manager" | "owner"
  fullName?: string | null
  phone?: string | null
  stationId?: string | null
  stationName?: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function createSession(userId: string): Promise<string> {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET)
  return token
}

export async function getUserFromToken(token: string): Promise<AuthUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    const userId = payload.userId as string

    const user = await getUserById(userId)
    if (!user) return null

    return {
      id: user.id!,
      username: user.username,
      role: user.role,
      fullName: user.fullName,
      phone: user.phone,
      stationId: user.stationId,
      stationName: user.stationName,
    }
  } catch {
    return null
  }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("session")?.value
  if (!token) return null
  return getUserFromToken(token)
}

export async function login(username: string, password: string): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  const users = await getUsersByField("username", username.toLowerCase().trim())
  if (users.length === 0) {
    return { success: false, error: "Invalid username or password" }
  }

  const user = users[0]

  const valid = await verifyPassword(password, user.passwordHash)
  if (!valid) {
    return { success: false, error: "Invalid username or password" }
  }

  const token = await createSession(user.id!)

  return {
    success: true,
    user: {
      id: user.id!,
      username: user.username,
      role: user.role,
      fullName: user.fullName,
      phone: user.phone,
      stationId: user.stationId,
      stationName: user.stationName,
    },
  }
}

export async function logout() {
  // Cookie cleared in route
}

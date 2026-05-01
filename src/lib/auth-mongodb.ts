import { SignJWT, jwtVerify } from "jose"
import * as bcrypt from "bcryptjs"
import { cookies } from "next/headers"
import { connectDB, User } from "./mongodb"

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

export async function getUserById(id: string): Promise<AuthUser | null> {
  await connectDB()
  const user = await User.findById(id).lean()
  if (!user) return null
  return {
    id: user._id.toString(),
    username: user.username,
    role: user.role,
    fullName: user.fullName,
    phone: user.phone,
    stationId: user.stationId,
  }
}

export async function getUsersByField(field: string, value: string): Promise<AuthUser[]> {
  await connectDB()
  const users = await User.find({ [field]: value }).lean()
  return users.map((u: any) => ({
    id: u._id.toString(),
    username: u.username,
    role: u.role,
    fullName: u.fullName,
    phone: u.phone,
    stationId: u.stationId,
    passwordHash: u.passwordHash
  }))
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("session")?.value
  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    const userId = payload.userId as string
    return getUserById(userId)
  } catch {
    return null
  }
}

export async function login(username: string, password: string): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  await connectDB()
  
  const user = await User.findOne({ username: username.toLowerCase().trim() })
  
  if (!user) {
    return { success: false, error: "Invalid username or password" }
  }

  const valid = await verifyPassword(password, user.passwordHash)
  if (!valid) {
    return { success: false, error: "Invalid username or password" }
  }

  const token = await createSession(user._id.toString())

  return {
    success: true,
    user: {
      id: user._id.toString(),
      username: user.username,
      role: user.role,
      fullName: user.fullName,
      phone: user.phone,
      stationId: user.stationId,
    },
    token
  }
}

export async function logout() {
  // Cookie cleared in route
}
import { NextRequest, NextResponse } from "next/server"
import { createUser, getUsersByField } from "@/lib/firestore"
import { getCurrentUser, hashPassword } from "@/lib/auth"

export async function POST(request: NextRequest) {
  const currentUser = await getCurrentUser()
  if (!currentUser || currentUser.role !== "admin") {
    return NextResponse.json({ error: "Admin access required" }, { status: 401 })
  }

  try {
    const { username, password, stationId } = await request.json()
    if (!username || !password) {
      return NextResponse.json({ error: "Username and password required" }, { status: 400 })
    }

    const normalizedUsername = username.toLowerCase().trim()
    const existing = await getUsersByField("username", normalizedUsername)
    if (existing.length > 0) {
      return NextResponse.json({ error: "Username already exists" }, { status: 409 })
    }

    const passwordHash = await hashPassword(password)
    const managerId = await createUser({
      username: normalizedUsername,
      passwordHash,
      role: "manager",
      stationId: stationId || null,
      fullName: normalizedUsername,
      phone: null,
    })

    return NextResponse.json({ success: true, manager: { id: managerId, username: normalizedUsername } })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create manager" }, { status: 500 })
  }
}

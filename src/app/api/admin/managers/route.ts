import { NextResponse } from "next/server"
import { getUsersByField } from "@/lib/firestore"
import { getCurrentUser } from "@/lib/auth"

export async function GET() {
  const user = await getCurrentUser()
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Admin access required" }, { status: 401 })
  }

  const managers = await getUsersByField("role", "manager")

  const formatted = managers.map(m => ({
    id: m.id,
    username: m.username,
    stationName: m.stationName || null,
  }))

  return NextResponse.json({ managers: formatted })
}

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser, hashPassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== "admin") {
    return NextResponse.json({ error: "Admin access required" }, { status: 401 });
  }

  try {
    const { username, password, stationId } = await request.json();
    if (!username || !password) {
      return NextResponse.json({ error: "Username and password required" }, { status: 400 });
    }

    const normalizedUsername = username.toLowerCase().trim();
    const existing = await db.query.users.findFirst({ where: eq(users.username, normalizedUsername) });
    if (existing) {
      return NextResponse.json({ error: "Username already exists" }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const manager = await db.insert(users).values({
      username: normalizedUsername,
      passwordHash,
      role: "manager",
      stationId: stationId || null,
      fullName: normalizedUsername,
      phone: null,
    }).returning();

    return NextResponse.json({ success: true, manager: { id: manager[0].id, username: manager[0].username } });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create manager" }, { status: 500 });
  }
}

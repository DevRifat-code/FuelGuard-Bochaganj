import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { username, password, stationId } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password required" }, { status: 400 });
    }

    const existing = await db.query.users.findFirst({
      where: eq(users.username, username),
    });

    if (existing) {
      return NextResponse.json({ error: "Manager username already exists" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await db.insert(users).values({
      username,
      passwordHash,
      role: "manager",
      stationId: stationId || null,
    }).returning();

    return NextResponse.json({ success: true, user: newUser[0] });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to add manager" }, { status: 500 });
  }
}

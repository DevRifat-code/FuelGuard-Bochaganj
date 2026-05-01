import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, stations } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Admin access required" }, { status: 401 });
  }

  const managers = await db.query.users.findMany({
    where: eq(users.role, "manager"),
    with: { station: true },
  });

  const formatted = managers.map(m => ({
    id: m.id,
    username: m.username,
    stationName: m.station?.name,
  }));

  return NextResponse.json({ managers: formatted });
}

import { NextResponse } from "next/server";
import { db } from "@/db";
import { vehicles } from "@/db/schema";
import { desc } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Admin access required" }, { status: 401 });
  }

  const allVehicles = await db.query.vehicles.findMany({
    orderBy: desc(vehicles.createdAt),
    limit: 50,
    with: { owner: true },
  });

  return NextResponse.json({ vehicles: allVehicles });
}

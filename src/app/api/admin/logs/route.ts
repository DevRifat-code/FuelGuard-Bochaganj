import { NextResponse } from "next/server";
import { db } from "@/db";
import { fuelLogs } from "@/db/schema";
import { desc } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Admin access required" }, { status: 401 });
  }

  const logs = await db.query.fuelLogs.findMany({
    orderBy: desc(fuelLogs.timestamp),
    limit: 100,
    with: {
      vehicle: true,
      station: true,
    },
  });

  const formatted = logs.map(l => ({
    id: l.id,
    amountBdt: l.amountBdt,
    fuelType: l.fuelType,
    timestamp: l.timestamp,
    vehicleReg: l.vehicle?.regNo,
    stationName: l.station?.name,
  }));

  return NextResponse.json({ logs: formatted });
}

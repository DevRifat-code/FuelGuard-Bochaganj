import { NextResponse } from "next/server";
import { db } from "@/db";
import { fuelLogs } from "@/db/schema";
import { desc } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

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
      manager: true,
    },
  });

  const formatted = logs.map((log) => ({
    id: log.id,
    amountBdt: log.amountBdt,
    fuelType: log.fuelType,
    timestamp: log.timestamp,
    vehicleReg: log.vehicle?.regNo,
    stationName: log.station?.name,
    managerName: log.manager?.username,
  }));

  return NextResponse.json({ logs: formatted });
}

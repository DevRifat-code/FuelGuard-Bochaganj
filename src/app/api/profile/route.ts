import { NextResponse } from "next/server";
import { db } from "@/db";
import { vehicles } from "@/db/schema";
import { eq } from "drizzle-orm";
import QRCode from "qrcode";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "owner") {
    return NextResponse.json({ error: "Owner login required" }, { status: 401 });
  }

  const ownedVehicles = await db.query.vehicles.findMany({
    where: eq(vehicles.ownerUserId, user.id),
    with: {
      fuelLogs: {
        with: { station: true },
      },
    },
  });

  const vehiclesWithQr = await Promise.all(
    ownedVehicles.map(async (vehicle) => ({
      ...vehicle,
      qrCodeUrl: await QRCode.toDataURL(vehicle.qrCodeData || JSON.stringify({ regNo: vehicle.regNo }), {
        width: 260,
        margin: 1,
      }),
    }))
  );

  return NextResponse.json({ user, vehicles: vehiclesWithQr });
}

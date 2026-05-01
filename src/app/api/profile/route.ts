import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { vehicles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { checkEligibility } from "@/lib/fuel";
import QRCode from "qrcode";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "user") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const vehicle = await db.query.vehicles.findFirst({
      where: eq(vehicles.id, user.id),
    });

    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle record missing" }, { status: 404 });
    }

    const eligibility = await checkEligibility(vehicle.id);
    
    // Generate QR code dynamically
    const qrData = JSON.stringify({ id: vehicle.id, regNo: vehicle.regNo, type: vehicle.vehicleType });
    const qrCode = await QRCode.toDataURL(qrData, { width: 300, margin: 1 });

    return NextResponse.json({
      vehicle,
      eligibility,
      qrCode,
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

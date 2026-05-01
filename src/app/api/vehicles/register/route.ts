import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { vehicles } from "@/db/schema";
import QRCode from "qrcode";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { regNo, ownerName, phone, nid, licenseNo, vehicleType, taxToken, passportPhoto, nidPhoto, licensePhoto, taxTokenPhoto, username, password } = body;

    if (!regNo || !ownerName || !phone || !nid || !licenseNo || !vehicleType || !username || !password) {
      return NextResponse.json({ error: "Missing required fields including account details" }, { status: 400 });
    }

    // Check duplicate reg
    const existing = await db.query.vehicles.findFirst({ where: eq(vehicles.regNo, regNo.toUpperCase()) });
    if (existing) {
      return NextResponse.json({ error: "A vehicle with this registration number already exists" }, { status: 409 });
    }

    // Check duplicate username
    const existingUser = await db.query.vehicles.findFirst({ where: eq(vehicles.username, username) });
    if (existingUser) {
      return NextResponse.json({ error: "Username already taken. Please choose another." }, { status: 409 });
    }

    const bcrypt = await import("bcryptjs");
    const passwordHash = await bcrypt.hash(password, 10);
    if (existing) {
      return NextResponse.json({ error: "A vehicle with this registration number already exists" }, { status: 409 });
    }

    // Generate QR Code data
    const qrData = JSON.stringify({ regNo, vehicleType });
    const qrCodeDataUrl = await QRCode.toDataURL(qrData, { width: 300, margin: 1 });

    const newVehicle = await db.insert(vehicles).values({
      regNo: regNo.toUpperCase(),
      ownerName,
      phone,
      nid,
      licenseNo,
      vehicleType,
      taxToken: taxToken || null,
      passportPhoto: passportPhoto || null,
      nidPhoto: nidPhoto || null,
      licensePhoto: licensePhoto || null,
      taxTokenPhoto: taxTokenPhoto || null,
      qrCodeData: qrData,
      username,
      passwordHash,
    }).returning();

    return NextResponse.json({
      success: true,
      vehicle: newVehicle[0],
      qrCode: qrCodeDataUrl,
    });
  } catch (error: any) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Failed to register vehicle" }, { status: 500 });
  }
}

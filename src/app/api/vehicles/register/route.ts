import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, vehicles } from "@/db/schema";
import QRCode from "qrcode";
import { eq, or } from "drizzle-orm";
import { hashPassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { regNo, ownerName, phone, nid, licenseNo, vehicleType, taxToken, passportPhoto, nidPhoto, licensePhoto, taxTokenPhoto, username, password } = body;

    if (!regNo || !ownerName || !phone || !nid || !licenseNo || !vehicleType || !username || !password) {
      return NextResponse.json({ error: "Missing required fields. Account username and password are required." }, { status: 400 });
    }

    const normalizedRegNo = regNo.toUpperCase().trim();
    const normalizedUsername = username.toLowerCase().trim();

    // Check duplicate vehicle and duplicate account
    const existingVehicle = await db.query.vehicles.findFirst({ where: eq(vehicles.regNo, normalizedRegNo) });
    if (existingVehicle) {
      return NextResponse.json({ error: "A vehicle with this registration number already exists" }, { status: 409 });
    }

    const existingUser = await db.query.users.findFirst({
      where: or(eq(users.username, normalizedUsername), eq(users.phone, phone)),
    });
    if (existingUser) {
      return NextResponse.json({ error: "An account with this username or phone already exists" }, { status: 409 });
    }

    // Create owner account first
    const passwordHash = await hashPassword(password);
    const ownerUser = await db.insert(users).values({
      username: normalizedUsername,
      passwordHash,
      role: "owner",
      fullName: ownerName,
      phone,
      stationId: null,
    }).returning();

    // Generate QR Code data
    const qrData = JSON.stringify({ regNo: normalizedRegNo, vehicleType });
    const qrCodeDataUrl = await QRCode.toDataURL(qrData, { width: 300, margin: 1 });

    const newVehicle = await db.insert(vehicles).values({
      ownerUserId: ownerUser[0].id,
      regNo: normalizedRegNo,
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
    }).returning();

    return NextResponse.json({
      success: true,
      vehicle: newVehicle[0],
      ownerAccount: {
        username: ownerUser[0].username,
        role: ownerUser[0].role,
      },
      qrCode: qrCodeDataUrl,
    });
  } catch (error: any) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Failed to register vehicle" }, { status: 500 });
  }
}

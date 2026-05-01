import { NextRequest, NextResponse } from "next/server"
import {
  createUser,
  getUsersByField,
} from "@/lib/firestore"
import QRCode from "qrcode"
import { hashPassword } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      regNo,
      ownerName,
      phone,
      nid,
      licenseNo,
      vehicleType,
      taxToken,
      passportPhoto,
      nidPhoto,
      licensePhoto,
      taxTokenPhoto,
      username,
      password,
    } = body

    if (!regNo || !ownerName || !phone || !nid || !licenseNo || !vehicleType || !username || !password) {
      return NextResponse.json({ error: "Missing required fields. Account username and password are required." }, { status: 400 })
    }

    const normalizedRegNo = regNo.toUpperCase().trim()
    const normalizedUsername = username.toLowerCase().trim()

    const existingVehicle = await (await import("@/lib/firestore")).getVehicleByRegNo(normalizedRegNo)
    if (existingVehicle) {
      return NextResponse.json({ error: "A vehicle with this registration number already exists" }, { status: 409 })
    }

    const existingUsers = await getUsersByField("username", normalizedUsername)
    if (existingUsers.length > 0) {
      return NextResponse.json({ error: "An account with this username already exists" }, { status: 409 })
    }

    const existingPhone = await getUsersByField("phone", phone)
    if (existingPhone.length > 0) {
      return NextResponse.json({ error: "An account with this phone already exists" }, { status: 409 })
    }

    const passwordHash = await hashPassword(password)
    const ownerId = await createUser({
      username: normalizedUsername,
      passwordHash,
      role: "owner",
      fullName: ownerName,
      phone,
      stationId: null,
    })

    const qrData = JSON.stringify({ regNo: normalizedRegNo, vehicleType })
    const qrCodeDataUrl = await QRCode.toDataURL(qrData, { width: 300, margin: 1 })

    const { createVehicle } = await import("@/lib/firestore")
    const vehicleId = await createVehicle({
      ownerUserId: ownerId,
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
    })

    return NextResponse.json({
      success: true,
      vehicle: { id: vehicleId, regNo: normalizedRegNo, ownerName, vehicleType },
      ownerAccount: {
        username: normalizedUsername,
        role: "owner",
      },
      qrCode: qrCodeDataUrl,
    })
  } catch (error: any) {
    console.error("Register error:", error)
    return NextResponse.json({ error: "Failed to register vehicle" }, { status: 500 })
  }
}

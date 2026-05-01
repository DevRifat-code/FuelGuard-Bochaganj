import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getDocs, query, where, collection } from "firebase/firestore"
import QRCode from "qrcode"
import { db } from "@/lib/firebase"

export async function GET() {
  const user = await getCurrentUser()
  if (!user || user.role !== "owner") {
    return NextResponse.json({ error: "Owner login required" }, { status: 401 })
  }

  const q = query(collection(db, "vehicles"), where("ownerUserId", "==", user.id))
  const snap = await getDocs(q)

  const vehicles = await Promise.all(
    snap.docs.map(async d => {
      const data = d.data() as any
      const vehicle = { id: d.id, ...data }
      const qrCodeUrl = await QRCode.toDataURL(
        data.qrCodeData || JSON.stringify({ regNo: data.regNo }),
        { width: 260, margin: 1 }
      )
      return { ...vehicle, qrCodeUrl }
    })
  )

  return NextResponse.json({ user, vehicles })
}

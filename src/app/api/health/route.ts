import { NextResponse } from "next/server"
import { getDocs, collection } from "firebase/firestore"
import { db } from "@/lib/firebase"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    await getDocs(collection(db, "vehicles"))
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}

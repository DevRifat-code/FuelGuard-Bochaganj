import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getDocs, query, orderBy, limit, collection } from "firebase/firestore"
import { db } from "@/lib/firebase"

export async function GET() {
  const user = await getCurrentUser()
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Admin access required" }, { status: 401 })
  }

  const q = query(collection(db, "vehicles"), orderBy("createdAt", "desc"), limit(50))
  const snap = await getDocs(q)

  const vehicles = snap.docs.map(d => ({
    id: d.id,
    ...d.data(),
    createdAt: d.data().createdAt?.toDate(),
  }))

  return NextResponse.json({ vehicles })
}

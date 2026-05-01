import { NextRequest, NextResponse } from "next/server"
import { login } from "@/lib/auth-mongodb"
import { createSession } from "@/lib/auth-mongodb"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password required" }, { status: 400 })
    }

    const result = await login(username, password)

    if (!result.success || !result.user) {
      return NextResponse.json({ error: result.error }, { status: 401 })
    }

    const token = await createSession(result.user.id)

    const response = NextResponse.json({ success: true, user: result.user })
    
    response.cookies.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    })

    return response
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
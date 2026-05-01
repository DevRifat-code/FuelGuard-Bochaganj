import { NextRequest, NextResponse } from "next/server"
import { login } from "@/lib/auth"
import { cookies } from "next/headers"

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

    // Create and set session cookie
    const { createSession } = await import("@/lib/auth")
    const token = await createSession(result.user.id!)

    const response = NextResponse.json({ success: true, user: result.user })
    
    response.cookies.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    return response
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}

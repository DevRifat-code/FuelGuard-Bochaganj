import { db } from "@/db";
import { users, stations } from "@/db/schema";
import { eq } from "drizzle-orm";
import * as bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fuelguard-uno-setabganj-secret-key-2026"
);

export interface AuthUser {
  id: number;
  username: string;
  role: "admin" | "manager" | "user";
  stationId?: number | null;
  stationName?: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSession(userId: number, isVehicleOwner: boolean = false): Promise<string> {
  const token = await new SignJWT({ userId, isVehicleOwner })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
  return token;
}

export async function getUserFromToken(token: string): Promise<AuthUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.userId as number;
    const isVehicleOwner = payload.isVehicleOwner as boolean;

    if (isVehicleOwner) {
      const { vehicles } = await import("@/db/schema");
      const vehicle = await db.query.vehicles.findFirst({
        where: eq(vehicles.id, userId),
      });
      if (!vehicle) return null;
      return {
        id: vehicle.id,
        username: vehicle.username || vehicle.regNo,
        role: "user",
      };
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      with: {
        station: true,
      },
    });

    if (!user) return null;

    return {
      id: user.id,
      username: user.username,
      role: user.role,
      stationId: user.stationId,
      stationName: user.station?.name,
    };
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return null;
  return getUserFromToken(token);
}

export async function login(username: string, password: string): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  // First check users table
  const user = await db.query.users.findFirst({
    where: eq(users.username, username),
    with: { station: true },
  });

  if (user) {
    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return { success: false, error: "Invalid username or password" };
    }

    const token = await createSession(user.id, false);
    return {
      success: true,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        stationId: user.stationId,
        stationName: user.station?.name,
      },
    };
  }

  // Fallback to vehicles table (for vehicle owners)
  const { vehicles } = await import("@/db/schema");
  const vehicle = await db.query.vehicles.findFirst({
    where: eq(vehicles.username, username),
  });

  if (vehicle && vehicle.passwordHash) {
    const valid = await verifyPassword(password, vehicle.passwordHash);
    if (!valid) {
      return { success: false, error: "Invalid username or password" };
    }

    const token = await createSession(vehicle.id, true);
    return {
      success: true,
      user: {
        id: vehicle.id,
        username: vehicle.username || vehicle.regNo,
        role: "user",
      },
    };
  }

  return { success: false, error: "Invalid username or password" };
}

export async function logout() {
  // Cookie cleared in route
}

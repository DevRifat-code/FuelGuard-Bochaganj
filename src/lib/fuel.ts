import { db } from "@/db";
import { fuelLogs, vehicles } from "@/db/schema";
import { eq, and, gte, desc } from "drizzle-orm";
import { differenceInDays } from "date-fns";

/**
 * Core Calculation Function: Checks if a vehicle is eligible for fuel.
 * Implements the 7-day blocking rule based on fuel thresholds.
 * 
 * Logic (in Bengali explanation):
 * - মোটরসাইকেল: ৫০০ টাকা বা তার বেশি জ্বালানি নিলে ৭ দিন ব্লক।
 * - মোটর ভেহিকল: ২০০০ টাকা বা তার বেশি জ্বালানি নিলে ৭ দিন ব্লক।
 * - ব্লক চলাকালীন চেষ্টা করলে Pump Manager-কে Red Alert দেখানো হয়।
 */
export interface EligibilityResult {
  eligible: boolean;
  daysRemaining: number;
  message: string;
  threshold: number;
  lastHighFuel?: {
    amountBdt: number;
    timestamp: Date;
    fuelType: string;
  };
  vehicleType: string;
}

export async function checkEligibility(vehicleId: number): Promise<EligibilityResult> {
  const vehicle = await db.query.vehicles.findFirst({
    where: eq(vehicles.id, vehicleId),
  });

  if (!vehicle) {
    return {
      eligible: false,
      daysRemaining: 0,
      message: "যানবাহন খুঁজে পাওয়া যায়নি।",
      threshold: 0,
      vehicleType: "",
    };
  }

  const threshold = vehicle.vehicleType === "motorcycle" ? 500 : 2000;
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  // Find the most recent high-value fuel log in the last 7 days
  const recentHighLog = await db.query.fuelLogs.findFirst({
    where: and(
      eq(fuelLogs.vehicleId, vehicleId),
      gte(fuelLogs.amountBdt, threshold),
      gte(fuelLogs.timestamp, sevenDaysAgo)
    ),
    orderBy: desc(fuelLogs.timestamp),
  });

  if (recentHighLog) {
    const daysSince = differenceInDays(new Date(), new Date(recentHighLog.timestamp));
    const daysRemaining = Math.max(0, 7 - daysSince);

    const banglaMessage = `এই ${vehicle.vehicleType === "motorcycle" ? "মোটরসাইকেল" : "মোটর ভেহিকল"}টি গত ${daysSince} দিন আগে ${recentHighLog.amountBdt} টাকার জ্বালানি নিয়েছে। বর্তমানে ${daysRemaining} দিনের ব্লক চলছে।`;

    return {
      eligible: false,
      daysRemaining,
      message: banglaMessage,
      threshold,
      lastHighFuel: {
        amountBdt: recentHighLog.amountBdt,
        timestamp: recentHighLog.timestamp,
        fuelType: recentHighLog.fuelType,
      },
      vehicleType: vehicle.vehicleType,
    };
  }

  return {
    eligible: true,
    daysRemaining: 0,
    message: `যানবাহনটি জ্বালানি নেওয়ার জন্য যোগ্য। (সীমা: ${threshold} টাকা)`,
    threshold,
    vehicleType: vehicle.vehicleType,
  };
}

/**
 * Record a fuel transaction. If amount >= threshold, it will automatically trigger the 7-day block for future attempts.
 */
export async function recordFuelLog(
  vehicleId: number,
  stationId: number,
  amountBdt: number,
  fuelType: "petrol" | "octane",
  managerId: number
) {
  const result = await db.insert(fuelLogs).values({
    vehicleId,
    stationId,
    amountBdt,
    fuelType,
    managerId,
  }).returning();

  return result[0];
}

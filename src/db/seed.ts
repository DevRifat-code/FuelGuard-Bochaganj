import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import { stations, users, vehicles } from "./schema";

const databaseUrl = "postgresql://postgres:postgres@127.0.0.1:5432/app_db";

const pool = new Pool({ connectionString: databaseUrl });
const db = drizzle(pool);

async function seed() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await db.delete(vehicles);
  await db.delete(users);
  await db.delete(stations);

  // Create 5 Stations
  const stationData = [
    { name: "Bakultala Fuel Station", location: "Bakultala, Setabganj" },
    { name: "Tulei Fuel Station", location: "Tulei, Setabganj" },
    { name: "Setabganj Main Fuel Station", location: "Setabganj Bazar" },
    { name: "Rampur Fuel Station", location: "Rampur, Setabganj" },
    { name: "MI Fuel Station", location: "MI Area, Setabganj" },
  ];

  const insertedStations = await db.insert(stations).values(stationData).returning();
  console.log(`✅ Created ${insertedStations.length} stations`);

  // Admin user - UNO
  const adminPass = await bcrypt.hash("admin123", 10);
  await db.insert(users).values({
    username: "uno_admin",
    passwordHash: adminPass,
    role: "admin",
    stationId: null,
  });
  console.log("✅ Admin created: uno_admin / admin123");

  // Managers for stations
  const managerPass = await bcrypt.hash("manager123", 10);
  const managerData = insertedStations.map((station) => ({
    username: `manager_${station.name.toLowerCase().replace(/[^a-z0-9]/g, "_").slice(0, 20)}`,
    passwordHash: managerPass,
    role: "manager" as const,
    stationId: station.id,
  }));

  const insertedManagers = await db.insert(users).values(managerData).returning();
  console.log(`✅ Created ${insertedManagers.length} pump managers`);

  // Sample Vehicle - Motorcycle
  const sampleVehicle = await db.insert(vehicles).values({
    regNo: "SET-4521",
    ownerName: "Md. Karim Hossain",
    phone: "01712-345678",
    nid: "1234567890123",
    licenseNo: "LIC-98765",
    vehicleType: "motorcycle",
    taxToken: "TT-2025-8841",
    passportPhoto: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2U1ZTdlNyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjE4IiBmaWxsPSIjNjY3Ij5QaG90byBQYXNzcG9ydDwvdGV4dD48L3N2Zz4=",
    nidPhoto: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2U1ZTdlNyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjE4IiBmaWxsPSIjNjY3Ij5O SUQgUGhvdG88L3RleHQ+PC9zdmc+",
    licensePhoto: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2U1ZTdlNyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjE4IiBmaWxsPSIjNjY3Ij5MaWNlbnNlIFBob3RvPC90ZXh0Pjwvc3ZnPg==",
    taxTokenPhoto: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2U1ZTdlNyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjE4IiBmaWxsPSIjNjY3Ij5UYXggVG9rZW48L3RleHQ+PC9zdmc+",
    qrCodeData: JSON.stringify({ id: 1, regNo: "SET-4521", type: "motorcycle" }),
  }).returning();
  console.log(`✅ Sample motorcycle created: ${sampleVehicle[0].regNo}`);

  // Sample Motor Vehicle
  await db.insert(vehicles).values({
    regNo: "SET-8834",
    ownerName: "Fatema Begum",
    phone: "01987-654321",
    nid: "9876543210987",
    licenseNo: "LIC-44521",
    vehicleType: "motor_vehicle",
    taxToken: "TT-2025-9912",
    passportPhoto: "",
    nidPhoto: "",
    licensePhoto: "",
    taxTokenPhoto: "",
    qrCodeData: JSON.stringify({ id: 2, regNo: "SET-8834", type: "motor_vehicle" }),
  });
  console.log("✅ Sample motor vehicle created: SET-8834");

  console.log("\n🎉 Seeding complete!");
  console.log("🔑 Admin Login: uno_admin / admin123");
  console.log("🔑 Manager Login: Use any manager_... / manager123 (e.g. manager_bakultala_fuel_station)");
  console.log("🚗 Vehicles: SET-4521 (motorcycle), SET-8834 (car)");

  await pool.end();
}

seed().catch(console.error);

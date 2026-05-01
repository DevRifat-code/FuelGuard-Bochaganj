import { pgTable, serial, text, integer, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const vehicleTypeEnum = pgEnum("vehicle_type", ["motorcycle", "motor_vehicle"]);
export const roleEnum = pgEnum("role", ["admin", "manager", "owner"]);
export const fuelTypeEnum = pgEnum("fuel_type", ["petrol", "octane"]);

export const stations = pgTable("stations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  location: text("location"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: roleEnum("role").notNull(),
  fullName: text("full_name"),
  phone: text("phone"),
  stationId: integer("station_id").references(() => stations.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const vehicles = pgTable("vehicles", {
  id: serial("id").primaryKey(),
  ownerUserId: integer("owner_user_id").references(() => users.id),
  regNo: text("reg_no").notNull().unique(),
  ownerName: text("owner_name").notNull(),
  phone: text("phone").notNull(),
  nid: text("nid").notNull(),
  licenseNo: text("license_no").notNull(),
  vehicleType: vehicleTypeEnum("vehicle_type").notNull(),
  taxToken: text("tax_token"),
  passportPhoto: text("passport_photo"),
  nidPhoto: text("nid_photo"),
  licensePhoto: text("license_photo"),
  taxTokenPhoto: text("tax_token_photo"),
  qrCodeData: text("qr_code_data"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const fuelLogs = pgTable("fuel_logs", {
  id: serial("id").primaryKey(),
  vehicleId: integer("vehicle_id").notNull().references(() => vehicles.id, { onDelete: "cascade" }),
  stationId: integer("station_id").notNull().references(() => stations.id),
  amountBdt: integer("amount_bdt").notNull(),
  fuelType: fuelTypeEnum("fuel_type").notNull(),
  managerId: integer("manager_id").references(() => users.id),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Relations
export const stationsRelations = relations(stations, ({ many }) => ({
  managers: many(users),
  fuelLogs: many(fuelLogs),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  station: one(stations, {
    fields: [users.stationId],
    references: [stations.id],
  }),
  ownedVehicles: many(vehicles),
  fuelLogs: many(fuelLogs),
}));

export const vehiclesRelations = relations(vehicles, ({ one, many }) => ({
  owner: one(users, {
    fields: [vehicles.ownerUserId],
    references: [users.id],
  }),
  fuelLogs: many(fuelLogs),
}));

export const fuelLogsRelations = relations(fuelLogs, ({ one }) => ({
  vehicle: one(vehicles, {
    fields: [fuelLogs.vehicleId],
    references: [vehicles.id],
  }),
  station: one(stations, {
    fields: [fuelLogs.stationId],
    references: [stations.id],
  }),
  manager: one(users, {
    fields: [fuelLogs.managerId],
    references: [users.id],
  }),
}));


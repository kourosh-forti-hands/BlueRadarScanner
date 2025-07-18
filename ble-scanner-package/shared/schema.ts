import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const bleDevices = pgTable("ble_devices", {
  id: serial("id").primaryKey(),
  name: text("name"),
  macAddress: text("mac_address").notNull().unique(),
  rssi: integer("rssi"),
  lastSeen: timestamp("last_seen").notNull().defaultNow(),
  deviceType: text("device_type"),
  isTargetDevice: boolean("is_target_device").notNull().default(false),
  firstSeen: timestamp("first_seen").notNull().defaultNow(),
  scanCount: integer("scan_count").notNull().default(1),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertBleDeviceSchema = createInsertSchema(bleDevices).pick({
  name: true,
  macAddress: true,
  rssi: true,
  deviceType: true,
  isTargetDevice: true,
  firstSeen: true,
  scanCount: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type BleDevice = typeof bleDevices.$inferSelect;
export type InsertBleDevice = z.infer<typeof insertBleDeviceSchema>;

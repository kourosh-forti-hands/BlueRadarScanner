import { users, bleDevices, type User, type InsertUser, type BleDevice, type InsertBleDevice } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getBleDevice(id: number): Promise<BleDevice | undefined>;
  getBleDeviceByMacAddress(macAddress: string): Promise<BleDevice | undefined>;
  createBleDevice(insertBleDevice: InsertBleDevice): Promise<BleDevice>;
  updateBleDevice(id: number, updates: Partial<BleDevice>): Promise<BleDevice | undefined>;
  getAllBleDevices(): Promise<BleDevice[]>;
  getTargetBleDevices(): Promise<BleDevice[]>;
  deleteBleDevice(id: number): Promise<boolean>;
}

import { db } from "./db";
import { eq } from "drizzle-orm";

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getBleDevice(id: number): Promise<BleDevice | undefined> {
    const [device] = await db.select().from(bleDevices).where(eq(bleDevices.id, id));
    return device || undefined;
  }

  async getBleDeviceByMacAddress(macAddress: string): Promise<BleDevice | undefined> {
    const [device] = await db.select().from(bleDevices).where(eq(bleDevices.macAddress, macAddress));
    return device || undefined;
  }

  async createBleDevice(insertBleDevice: InsertBleDevice): Promise<BleDevice> {
    const [device] = await db
      .insert(bleDevices)
      .values(insertBleDevice)
      .returning();
    return device;
  }

  async updateBleDevice(id: number, updates: Partial<BleDevice>): Promise<BleDevice | undefined> {
    const [device] = await db
      .update(bleDevices)
      .set(updates)
      .where(eq(bleDevices.id, id))
      .returning();
    return device || undefined;
  }

  async getAllBleDevices(): Promise<BleDevice[]> {
    return await db.select().from(bleDevices);
  }

  async getTargetBleDevices(): Promise<BleDevice[]> {
    return await db.select().from(bleDevices).where(eq(bleDevices.isTargetDevice, true));
  }

  async deleteBleDevice(id: number): Promise<boolean> {
    const result = await db.delete(bleDevices).where(eq(bleDevices.id, id));
    return (result.rowCount ?? 0) > 0;
  }
}

export const storage = new DatabaseStorage();

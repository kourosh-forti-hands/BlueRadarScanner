import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertBleDeviceSchema } from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import express from "express";

export async function registerRoutes(app: Express): Promise<Server> {
  app.use(express.json());

  // Health check endpoint
  app.get("/health", (req, res) => {
    res.json({ 
      status: "healthy", 
      timestamp: new Date().toISOString(),
      service: "ble-scanner"
    });
  });

  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: fromZodError(error).message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // BLE device routes
  app.get("/api/ble-devices", async (req, res) => {
    try {
      const devices = await storage.getAllBleDevices();
      res.json(devices);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/ble-devices/target", async (req, res) => {
    try {
      const devices = await storage.getTargetBleDevices();
      res.json(devices);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/ble-devices", async (req, res) => {
    try {
      const deviceData = insertBleDeviceSchema.parse(req.body);
      
      // Check if device already exists
      const existingDevice = await storage.getBleDeviceByMacAddress(deviceData.macAddress);
      if (existingDevice) {
        // Update existing device
        const updatedDevice = await storage.updateBleDevice(existingDevice.id, {
          ...deviceData,
          lastSeen: new Date(),
          scanCount: existingDevice.scanCount + 1,
        });
        res.json(updatedDevice);
      } else {
        // Create new device
        const device = await storage.createBleDevice({
          ...deviceData,
          firstSeen: new Date(),
          scanCount: 1,
        });
        res.json(device);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: fromZodError(error).message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.get("/api/ble-devices/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const device = await storage.getBleDevice(id);
      if (!device) {
        return res.status(404).json({ message: "Device not found" });
      }
      res.json(device);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/ble-devices/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      const device = await storage.updateBleDevice(id, updateData);
      if (!device) {
        return res.status(404).json({ message: "Device not found" });
      }
      res.json(device);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/ble-devices/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteBleDevice(id);
      if (!deleted) {
        return res.status(404).json({ message: "Device not found" });
      }
      res.json({ message: "Device deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

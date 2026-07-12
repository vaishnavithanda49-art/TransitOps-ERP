import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { listDrivers, listExpenses, listMaintenance, listTrips, listVehicles } from "./routes/transit";
import { pingMysql } from "./db/mysql";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);
  app.get("/api/health/db", async (_req, res) => {
    const ok = await pingMysql();
    res.json({ ok, source: ok ? "mysql" : "unavailable" });
  });
  app.get("/api/vehicles", listVehicles);
  app.get("/api/drivers", listDrivers);
  app.get("/api/trips", listTrips);
  app.get("/api/maintenance", listMaintenance);
  app.get("/api/expenses", listExpenses);

  return app;
}

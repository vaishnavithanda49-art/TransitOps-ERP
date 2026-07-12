import { RequestHandler } from "express";
import { initializeDatabaseSchema, queryMysql, pingMysql } from "../db/mysql";

interface TransitListResponse {
  ok: boolean;
  source: "mysql" | "fallback";
  data: any[];
  message?: string;
}

async function ensureSeedData() {
  const dbReady = await pingMysql();
  if (!dbReady) {
    return false;
  }

  await initializeDatabaseSchema();

  const existing = await queryMysql("SELECT COUNT(*) as count FROM vehicles");
  const count = Number((existing[0] as any)?.count || 0);

  if (count === 0) {
    await queryMysql(
      `INSERT INTO vehicles (registration_number, name, model, manufacturer, type, status, odometer, capacity, last_maintenance, next_maintenance, registration_expiry, assigned_to) VALUES ?`,
      [
        [
          "TRN-2024-001",
          "Fleet Truck 01",
          "Volvo FH16",
          "Volvo",
          "Truck",
          "Active",
          45230,
          25,
          "2024-01-15",
          "2024-04-15",
          "2025-06-30",
          "John Doe",
        ],
        [
          "TRN-2024-002",
          "Fleet Truck 02",
          "Scania R450",
          "Scania",
          "Truck",
          "Active",
          32156,
          20,
          "2024-01-20",
          "2024-04-20",
          "2025-07-15",
          "Mike Johnson",
        ],
        [
          "TRN-2024-003",
          "Delivery Van 01",
          "Mercedes Sprinter",
          "Mercedes",
          "Van",
          "Maintenance",
          28900,
          8,
          "2024-02-01",
          "2024-05-01",
          "2025-05-20",
          null,
        ],
      ],
    );

    await queryMysql(
      `INSERT INTO drivers (name, employee_id, license_number, license_expiry, license_category, status, safety_score, rating, experience, joining_date, phone, email, current_vehicle) VALUES ?`,
      [
        [
          "John Doe",
          "EMP001",
          "DL-2024-001",
          "2026-06-15",
          "HCV",
          "Available",
          95,
          4.8,
          12,
          "2015-03-10",
          "+1-555-0101",
          "john.doe@transitops.com",
          "TRN-2024-001",
        ],
        [
          "Mike Johnson",
          "EMP002",
          "DL-2024-002",
          "2025-12-20",
          "HCV",
          "On Duty",
          88,
          4.5,
          8,
          "2018-07-22",
          "+1-555-0102",
          "mike.johnson@transitops.com",
          "TRN-2024-002",
        ],
      ],
    );

    await queryMysql(
      `INSERT INTO trips (source, destination, driver, vehicle, status, cargo_type, cargo_weight, planned_distance, estimated_time, scheduled_date, priority, revenue) VALUES ?`,
      [
        [
          "New York, NY",
          "Boston, MA",
          "John Doe",
          "TRN-2024-001",
          "Completed",
          "Electronics",
          15,
          215,
          4,
          "2024-02-10",
          "High",
          2500,
        ],
        [
          "Chicago, IL",
          "Detroit, MI",
          "Mike Johnson",
          "TRN-2024-002",
          "In Progress",
          "Furniture",
          20,
          280,
          5,
          "2024-02-11",
          "Medium",
          3200,
        ],
      ],
    );

    await queryMysql(
      `INSERT INTO maintenance_records (vehicle_id, vehicle_name, type, start_date, completion_date, status, cost, technician, description, next_due_date) VALUES ?`,
      [
        [
          "VEH001",
          "Fleet Truck 01",
          "Preventive",
          "2024-02-10",
          "2024-02-12",
          "Completed",
          2500,
          "Robert Tech",
          "Regular servicing, oil change, filter replacement",
          "2024-05-10",
        ],
      ],
    );

    await queryMysql(
      `INSERT INTO expenses (date, vehicle_id, vehicle_name, category, description, amount, status, odometer, quantity, unit_price) VALUES ?`,
      [
        [
          "2024-02-11",
          "VEH001",
          "Fleet Truck 01",
          "Fuel",
          "Diesel fuel - 50L",
          350,
          "Approved",
          45230,
          50,
          7,
        ],
      ],
    );
  }

  return true;
}

export const listVehicles: RequestHandler = async (_req, res) => {
  try {
    await ensureSeedData();
    const data = await queryMysql<any>("SELECT * FROM vehicles ORDER BY id ASC");
    const response: TransitListResponse = {
      ok: true,
      source: "mysql",
      data,
    };
    res.json(response);
  } catch (error) {
    res.status(500).json({ ok: false, source: "fallback", data: [], message: (error as Error).message });
  }
};

export const listDrivers: RequestHandler = async (_req, res) => {
  try {
    await ensureSeedData();
    const data = await queryMysql<any>("SELECT * FROM drivers ORDER BY id ASC");
    res.json({ ok: true, source: "mysql", data });
  } catch (error) {
    res.status(500).json({ ok: false, source: "fallback", data: [], message: (error as Error).message });
  }
};

export const listTrips: RequestHandler = async (_req, res) => {
  try {
    await ensureSeedData();
    const data = await queryMysql<any>("SELECT * FROM trips ORDER BY id ASC");
    res.json({ ok: true, source: "mysql", data });
  } catch (error) {
    res.status(500).json({ ok: false, source: "fallback", data: [], message: (error as Error).message });
  }
};

export const listMaintenance: RequestHandler = async (_req, res) => {
  try {
    await ensureSeedData();
    const data = await queryMysql<any>("SELECT * FROM maintenance_records ORDER BY id ASC");
    res.json({ ok: true, source: "mysql", data });
  } catch (error) {
    res.status(500).json({ ok: false, source: "fallback", data: [], message: (error as Error).message });
  }
};

export const listExpenses: RequestHandler = async (_req, res) => {
  try {
    await ensureSeedData();
    const data = await queryMysql<any>("SELECT * FROM expenses ORDER BY id ASC");
    res.json({ ok: true, source: "mysql", data });
  } catch (error) {
    res.status(500).json({ ok: false, source: "fallback", data: [], message: (error as Error).message });
  }
};

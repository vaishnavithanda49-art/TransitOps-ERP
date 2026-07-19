import { RequestHandler } from "express";
import { getCollection, pingMongo } from "../db/mongo";

interface TransitListResponse {
  ok: boolean;
  source: "mysql" | "mongodb" | "fallback";
  data: any[];
  message?: string;
}

const fallbackVehicles = [
  {
    id: 1,
    registration_number: "TRN-2024-001",
    name: "Fleet Truck 01",
    model: "Volvo FH16",
    manufacturer: "Volvo",
    type: "Truck",
    status: "Active",
    odometer: 45230,
    capacity: 25,
    last_maintenance: "2024-01-15",
    next_maintenance: "2024-04-15",
    registration_expiry: "2025-06-30",
    assigned_to: "John Doe",
  },
  {
    id: 2,
    registration_number: "TRN-2024-002",
    name: "Fleet Truck 02",
    model: "Scania R450",
    manufacturer: "Scania",
    type: "Truck",
    status: "Active",
    odometer: 32156,
    capacity: 20,
    last_maintenance: "2024-01-20",
    next_maintenance: "2024-04-20",
    registration_expiry: "2025-07-15",
    assigned_to: "Mike Johnson",
  },
  {
    id: 3,
    registration_number: "TRN-2024-003",
    name: "Delivery Van 01",
    model: "Mercedes Sprinter",
    manufacturer: "Mercedes",
    type: "Van",
    status: "Maintenance",
    odometer: 28900,
    capacity: 8,
    last_maintenance: "2024-02-01",
    next_maintenance: "2024-05-01",
    registration_expiry: "2025-05-20",
    assigned_to: null,
  },
];

const fallbackDrivers = [
  {
    id: 1,
    name: "John Doe",
    employee_id: "EMP001",
    license_number: "DL-2024-001",
    license_expiry: "2026-06-15",
    license_category: "HCV",
    status: "Available",
    safety_score: 95,
    rating: 4.8,
    experience: 12,
    joining_date: "2015-03-10",
    phone: "+1-555-0101",
    email: "john.doe@transitops.com",
    current_vehicle: "TRN-2024-001",
  },
  {
    id: 2,
    name: "Mike Johnson",
    employee_id: "EMP002",
    license_number: "DL-2024-002",
    license_expiry: "2025-12-20",
    license_category: "HCV",
    status: "On Duty",
    safety_score: 88,
    rating: 4.5,
    experience: 8,
    joining_date: "2018-07-22",
    phone: "+1-555-0102",
    email: "mike.johnson@transitops.com",
    current_vehicle: "TRN-2024-002",
  },
];

const fallbackTrips = [
  {
    id: 1,
    source: "New York, NY",
    destination: "Boston, MA",
    driver: "John Doe",
    vehicle: "TRN-2024-001",
    status: "Completed",
    cargo_type: "Electronics",
    cargo_weight: 15,
    planned_distance: 215,
    estimated_time: 4,
    scheduled_date: "2024-02-10",
    priority: "High",
    revenue: 2500,
  },
  {
    id: 2,
    source: "Chicago, IL",
    destination: "Detroit, MI",
    driver: "Mike Johnson",
    vehicle: "TRN-2024-002",
    status: "In Progress",
    cargo_type: "Furniture",
    cargo_weight: 20,
    planned_distance: 280,
    estimated_time: 5,
    scheduled_date: "2024-02-11",
    priority: "Medium",
    revenue: 3200,
  },
];

const fallbackMaintenance = [
  {
    id: 1,
    vehicle_id: "VEH001",
    vehicle_name: "Fleet Truck 01",
    type: "Preventive",
    start_date: "2024-02-10",
    completion_date: "2024-02-12",
    status: "Completed",
    cost: 2500,
    technician: "Robert Tech",
    description: "Regular servicing, oil change, filter replacement",
    next_due_date: "2024-05-10",
  },
];

const fallbackExpenses = [
  {
    id: 1,
    date: "2024-02-11",
    vehicle_id: "VEH001",
    vehicle_name: "Fleet Truck 01",
    category: "Fuel",
    description: "Diesel fuel - 50L",
    amount: 350,
    status: "Approved",
    odometer: 45230,
    quantity: 50,
    unit_price: 7,
  },
];

function createResponse(data: any[], source: "mysql" | "mongodb" | "fallback" = "fallback"): TransitListResponse {
  return { ok: true, source, data };
}

async function ensureSeedData() {
  const dbReady = await pingMongo();
  if (!dbReady) {
    return false;
  }

  const collection = await getCollection("vehicles");
  const count = await collection.countDocuments();

  if (count === 0) {
    await collection.insertMany([
      {
        registration_number: "TRN-2024-001",
        name: "Fleet Truck 01",
        model: "Volvo FH16",
        manufacturer: "Volvo",
        type: "Truck",
        status: "Active",
        odometer: 45230,
        capacity: 25,
        last_maintenance: "2024-01-15",
        next_maintenance: "2024-04-15",
        registration_expiry: "2025-06-30",
        assigned_to: "John Doe",
      },
      {
        registration_number: "TRN-2024-002",
        name: "Fleet Truck 02",
        model: "Scania R450",
        manufacturer: "Scania",
        type: "Truck",
        status: "Active",
        odometer: 32156,
        capacity: 20,
        last_maintenance: "2024-01-20",
        next_maintenance: "2024-04-20",
        registration_expiry: "2025-07-15",
        assigned_to: "Mike Johnson",
      },
      {
        registration_number: "TRN-2024-003",
        name: "Delivery Van 01",
        model: "Mercedes Sprinter",
        manufacturer: "Mercedes",
        type: "Van",
        status: "Maintenance",
        odometer: 28900,
        capacity: 8,
        last_maintenance: "2024-02-01",
        next_maintenance: "2024-05-01",
        registration_expiry: "2025-05-20",
        assigned_to: null,
      },
    ]);

    await (await getCollection("drivers")).insertMany([
      {
        name: "John Doe",
        employee_id: "EMP001",
        license_number: "DL-2024-001",
        license_expiry: "2026-06-15",
        license_category: "HCV",
        status: "Available",
        safety_score: 95,
        rating: 4.8,
        experience: 12,
        joining_date: "2015-03-10",
        phone: "+1-555-0101",
        email: "john.doe@transitops.com",
        current_vehicle: "TRN-2024-001",
      },
      {
        name: "Mike Johnson",
        employee_id: "EMP002",
        license_number: "DL-2024-002",
        license_expiry: "2025-12-20",
        license_category: "HCV",
        status: "On Duty",
        safety_score: 88,
        rating: 4.5,
        experience: 8,
        joining_date: "2018-07-22",
        phone: "+1-555-0102",
        email: "mike.johnson@transitops.com",
        current_vehicle: "TRN-2024-002",
      },
    ]);

    await (await getCollection("trips")).insertMany([
      {
        source: "New York, NY",
        destination: "Boston, MA",
        driver: "John Doe",
        vehicle: "TRN-2024-001",
        status: "Completed",
        cargo_type: "Electronics",
        cargo_weight: 15,
        planned_distance: 215,
        estimated_time: 4,
        scheduled_date: "2024-02-10",
        priority: "High",
        revenue: 2500,
      },
      {
        source: "Chicago, IL",
        destination: "Detroit, MI",
        driver: "Mike Johnson",
        vehicle: "TRN-2024-002",
        status: "In Progress",
        cargo_type: "Furniture",
        cargo_weight: 20,
        planned_distance: 280,
        estimated_time: 5,
        scheduled_date: "2024-02-11",
        priority: "Medium",
        revenue: 3200,
      },
    ]);

    await (await getCollection("maintenance_records")).insertMany([
      {
        vehicle_id: "VEH001",
        vehicle_name: "Fleet Truck 01",
        type: "Preventive",
        start_date: "2024-02-10",
        completion_date: "2024-02-12",
        status: "Completed",
        cost: 2500,
        technician: "Robert Tech",
        description: "Regular servicing, oil change, filter replacement",
        next_due_date: "2024-05-10",
      },
    ]);

    await (await getCollection("expenses")).insertMany([
      {
        date: "2024-02-11",
        vehicle_id: "VEH001",
        vehicle_name: "Fleet Truck 01",
        category: "Fuel",
        description: "Diesel fuel - 50L",
        amount: 350,
        status: "Approved",
        odometer: 45230,
        quantity: 50,
        unit_price: 7,
      },
    ]);
  }

  return true;
}

export const listVehicles: RequestHandler = async (_req, res) => {
  const dbReady = await pingMongo();
  if (!dbReady) {
    res.json(createResponse(fallbackVehicles, "fallback"));
    return;
  }

  try {
    await ensureSeedData();
    const data = await (await getCollection("vehicles")).find({}).sort({ _id: 1 }).toArray();
    res.json(createResponse(data, "mongodb"));
  } catch (error) {
    res.json(createResponse(fallbackVehicles, "fallback"));
  }
};

export const listDrivers: RequestHandler = async (_req, res) => {
  const dbReady = await pingMongo();
  if (!dbReady) {
    res.json(createResponse(fallbackDrivers, "fallback"));
    return;
  }

  try {
    await ensureSeedData();
    const data = await (await getCollection("drivers")).find({}).sort({ _id: 1 }).toArray();
    res.json(createResponse(data, "mongodb"));
  } catch (error) {
    res.json(createResponse(fallbackDrivers, "fallback"));
  }
};

export const listTrips: RequestHandler = async (_req, res) => {
  const dbReady = await pingMongo();
  if (!dbReady) {
    res.json(createResponse(fallbackTrips, "fallback"));
    return;
  }

  try {
    await ensureSeedData();
    const data = await (await getCollection("trips")).find({}).sort({ _id: 1 }).toArray();
    res.json(createResponse(data, "mongodb"));
  } catch (error) {
    res.json(createResponse(fallbackTrips, "fallback"));
  }
};

export const listMaintenance: RequestHandler = async (_req, res) => {
  const dbReady = await pingMongo();
  if (!dbReady) {
    res.json(createResponse(fallbackMaintenance, "fallback"));
    return;
  }

  try {
    await ensureSeedData();
    const data = await (await getCollection("maintenance_records")).find({}).sort({ _id: 1 }).toArray();
    res.json(createResponse(data, "mongodb"));
  } catch (error) {
    res.json(createResponse(fallbackMaintenance, "fallback"));
  }
};

export const listExpenses: RequestHandler = async (_req, res) => {
  const dbReady = await pingMongo();
  if (!dbReady) {
    res.json(createResponse(fallbackExpenses, "fallback"));
    return;
  }

  try {
    await ensureSeedData();
    const data = await (await getCollection("expenses")).find({}).sort({ _id: 1 }).toArray();
    res.json(createResponse(data, "mongodb"));
  } catch (error) {
    res.json(createResponse(fallbackExpenses, "fallback"));
  }
};

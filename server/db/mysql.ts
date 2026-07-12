import "dotenv/config";
import mysql, { Pool } from "mysql2/promise";

interface MysqlConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

let pool: Pool | null = null;

export function getMysqlConfig(): MysqlConfig | null {
  const host = process.env.MYSQL_HOST?.trim();
  const user = process.env.MYSQL_USER?.trim();
  const password = process.env.MYSQL_PASSWORD?.trim();
  const database = process.env.MYSQL_DATABASE?.trim();

  if (!host || !user || !password || !database) {
    return null;
  }

  return {
    host,
    port: Number(process.env.MYSQL_PORT || 3306),
    user,
    password,
    database,
  };
}

export async function getMysqlPool(): Promise<Pool | null> {
  const config = getMysqlConfig();
  if (!config) {
    return null;
  }

  if (!pool) {
    pool = mysql.createPool({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.database,
      connectionLimit: 10,
      waitForConnections: true,
      queueLimit: 0,
    });
  }

  return pool;
}

export async function initializeDatabaseSchema(): Promise<void> {
  const dbPool = await getMysqlPool();
  if (!dbPool) {
    return;
  }

  const statements = [
    `CREATE TABLE IF NOT EXISTS vehicles (
      id INT AUTO_INCREMENT PRIMARY KEY,
      registration_number VARCHAR(50) NOT NULL UNIQUE,
      name VARCHAR(100) NOT NULL,
      model VARCHAR(100),
      manufacturer VARCHAR(100),
      type VARCHAR(20),
      status VARCHAR(20),
      odometer INT DEFAULT 0,
      capacity INT DEFAULT 0,
      last_maintenance DATE,
      next_maintenance DATE,
      registration_expiry DATE,
      assigned_to VARCHAR(100)
    )`,
    `CREATE TABLE IF NOT EXISTS drivers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      employee_id VARCHAR(50) NOT NULL UNIQUE,
      license_number VARCHAR(50),
      license_expiry DATE,
      license_category VARCHAR(20),
      status VARCHAR(20),
      safety_score INT DEFAULT 0,
      rating DECIMAL(3, 2) DEFAULT 0,
      experience INT DEFAULT 0,
      joining_date DATE,
      phone VARCHAR(50),
      email VARCHAR(100),
      current_vehicle VARCHAR(50)
    )`,
    `CREATE TABLE IF NOT EXISTS trips (
      id INT AUTO_INCREMENT PRIMARY KEY,
      source VARCHAR(100),
      destination VARCHAR(100),
      driver VARCHAR(100),
      vehicle VARCHAR(50),
      status VARCHAR(30),
      cargo_type VARCHAR(100),
      cargo_weight DECIMAL(10, 2) DEFAULT 0,
      planned_distance INT DEFAULT 0,
      estimated_time DECIMAL(5, 2) DEFAULT 0,
      scheduled_date DATE,
      priority VARCHAR(20),
      revenue DECIMAL(10, 2) DEFAULT 0
    )`,
    `CREATE TABLE IF NOT EXISTS maintenance_records (
      id INT AUTO_INCREMENT PRIMARY KEY,
      vehicle_id VARCHAR(50),
      vehicle_name VARCHAR(100),
      type VARCHAR(20),
      start_date DATE,
      completion_date DATE,
      status VARCHAR(20),
      cost DECIMAL(10, 2) DEFAULT 0,
      technician VARCHAR(100),
      description TEXT,
      next_due_date DATE
    )`,
    `CREATE TABLE IF NOT EXISTS expenses (
      id INT AUTO_INCREMENT PRIMARY KEY,
      date DATE,
      vehicle_id VARCHAR(50),
      vehicle_name VARCHAR(100),
      category VARCHAR(20),
      description TEXT,
      amount DECIMAL(10, 2) DEFAULT 0,
      status VARCHAR(20),
      odometer INT DEFAULT 0,
      quantity DECIMAL(10, 2) DEFAULT 0,
      unit_price DECIMAL(10, 2) DEFAULT 0
    )`,
  ];

  for (const statement of statements) {
    await dbPool.execute(statement);
  }
}

export async function queryMysql<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const dbPool = await getMysqlPool();
  if (!dbPool) {
    return [];
  }

  const [rows] = await dbPool.execute(sql, params);
  return rows as T[];
}

export async function pingMysql(): Promise<boolean> {
  const dbPool = await getMysqlPool();
  if (!dbPool) {
    return false;
  }

  try {
    await dbPool.query("SELECT 1");
    return true;
  } catch {
    return false;
  }
}

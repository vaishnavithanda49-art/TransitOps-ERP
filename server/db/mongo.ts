import "dotenv/config";
import { MongoClient, Db, Collection } from "mongodb";

let client: MongoClient | null = null;
let db: Db | null = null;

const DEFAULT_URI = "mongodb://127.0.0.1:27017";
const DEFAULT_DB = "transitops";

export function getMongoUri() {
  return process.env.MONGO_URI || DEFAULT_URI;
}

export function getMongoDbName() {
  return process.env.MONGO_DB || DEFAULT_DB;
}

export async function connectMongo() {
  if (client && db) {
    return db;
  }

  const uri = getMongoUri();
  client = new MongoClient(uri);
  await client.connect();
  db = client.db(getMongoDbName());
  return db;
}

export async function pingMongo() {
  try {
    const database = await connectMongo();
    await database.command({ ping: 1 });
    return true;
  } catch {
    return false;
  }
}

export async function getCollection<T = any>(name: string): Promise<Collection<T>> {
  const database = await connectMongo();
  return database.collection<T>(name);
}

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set. Add it to .env before hitting any /api route.");
  }
  const sql = neon(url);
  return drizzle(sql, { schema });
}

export const db = getDb();
export * as schema from "./schema";

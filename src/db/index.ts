import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema.js";

function createDb() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set. Add it to .env before hitting any /api route.");
  }
  const sql = neon(url);
  return drizzle(sql, { schema });
}

type Db = ReturnType<typeof createDb>;
let cached: Db | undefined;

function getDb(): Db {
  if (!cached) cached = createDb();
  return cached;
}

// Lazy: importing this module (e.g. via api/[...path].ts's static handler imports)
// must not throw just because DATABASE_URL is unset — only an actual query should.
export const db = new Proxy({} as Db, {
  get(_target, prop) {
    const real = getDb();
    const value = Reflect.get(real, prop);
    return typeof value === "function" ? value.bind(real) : value;
  },
});

export * as schema from "./schema.js";

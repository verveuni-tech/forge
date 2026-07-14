import path from "node:path";
import type { IncomingMessage } from "node:http";
import type { Plugin, ViteDevServer } from "vite";

interface RouteEntry {
  pattern: string[];
  modulePath: string;
}

// Mirrors Vercel's file-based /api routing. Keep in sync with the api/ directory.
const routes: RouteEntry[] = [
  { pattern: ["api", "health"], modulePath: "api/health.ts" },
  { pattern: ["api", "exercises"], modulePath: "api/exercises/index.ts" },
  { pattern: ["api", "exercises", ":id"], modulePath: "api/exercises/[id].ts" },
  { pattern: ["api", "templates"], modulePath: "api/templates/index.ts" },
  { pattern: ["api", "templates", "activate"], modulePath: "api/templates/activate.ts" },
  { pattern: ["api", "home"], modulePath: "api/home.ts" },
  { pattern: ["api", "sessions"], modulePath: "api/sessions/index.ts" },
  { pattern: ["api", "sessions", "active"], modulePath: "api/sessions/active.ts" },
  { pattern: ["api", "sessions", ":id"], modulePath: "api/sessions/[id]/index.ts" },
  { pattern: ["api", "sessions", ":id", "sets"], modulePath: "api/sessions/[id]/sets/index.ts" },
  {
    pattern: ["api", "sessions", ":id", "sets", ":setId"],
    modulePath: "api/sessions/[id]/sets/[setId].ts",
  },
  { pattern: ["api", "records"], modulePath: "api/records.ts" },
  { pattern: ["api", "recommendations", ":exerciseId"], modulePath: "api/recommendations/[exerciseId].ts" },
];

function matchRoute(pathname: string): { modulePath: string; params: Record<string, string> } | null {
  const segments = pathname.split("/").filter(Boolean);
  for (const route of routes) {
    if (route.pattern.length !== segments.length) continue;
    const params: Record<string, string> = {};
    let ok = true;
    for (let i = 0; i < route.pattern.length; i++) {
      const p = route.pattern[i];
      if (p.startsWith(":")) {
        params[p.slice(1)] = decodeURIComponent(segments[i]);
      } else if (p !== segments[i]) {
        ok = false;
        break;
      }
    }
    if (ok) return { modulePath: route.modulePath, params };
  }
  return null;
}

async function readJsonBody(req: IncomingMessage): Promise<unknown> {
  const method = req.method ?? "GET";
  if (method === "GET" || method === "HEAD" || method === "DELETE") return undefined;
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(chunk as Buffer);
  if (chunks.length === 0) return undefined;
  const raw = Buffer.concat(chunks).toString("utf-8");
  if (!raw) return undefined;
  try {
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}

/**
 * Dev-only middleware emulating Vercel's serverless function runtime, since
 * Vite's dev server has no native concept of /api/*.ts functions — it would
 * otherwise just serve them as raw transformed source. Production deploys
 * still rely on Vercel's own routing; this only exists for `npm run dev`.
 */
export function devApiPlugin(): Plugin {
  return {
    name: "forge-dev-api",
    apply: "serve",
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith("/api/")) return next();

        const url = new URL(req.url, "http://localhost");
        const match = matchRoute(url.pathname);
        if (!match) return next();

        try {
          const body = await readJsonBody(req);
          const query: Record<string, string> = { ...match.params };
          for (const [key, value] of url.searchParams.entries()) query[key] = value;

          let statusCode = 200;
          const mockRes = {
            setHeader(name: string, value: string) {
              res.setHeader(name, value);
              return mockRes;
            },
            status(code: number) {
              statusCode = code;
              return mockRes;
            },
            json(payload: unknown) {
              res.statusCode = statusCode;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify(payload));
              return mockRes;
            },
          };

          const modulePath = path.resolve(__dirname, match.modulePath);
          const mod = await server.ssrLoadModule(modulePath);
          const handler = mod.default as (req: unknown, res: unknown) => Promise<void> | void;
          await handler({ method: req.method, query, body, headers: req.headers }, mockRes);
        } catch (err) {
          console.error(`[forge-dev-api] ${req.method} ${req.url} failed:`, err);
          if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(
              JSON.stringify({
                error: err instanceof Error ? err.message : "Internal server error",
              }),
            );
          }
        }
      });
    },
  };
}

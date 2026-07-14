import path from "node:path";
import type { IncomingMessage } from "node:http";
import type { Plugin, ViteDevServer } from "vite";

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
 * otherwise just serve them as raw transformed source. Loads the same catch-all
 * router used in production (api/[...path].ts) so there's one source of truth
 * for routing, not two tables that can drift out of sync.
 */
export function devApiPlugin(): Plugin {
  return {
    name: "forge-dev-api",
    apply: "serve",
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith("/api/")) return next();

        const url = new URL(req.url, "http://localhost");
        const segments = url.pathname.replace(/^\/api\//, "").split("/").filter(Boolean);

        try {
          const body = await readJsonBody(req);
          const query: Record<string, unknown> = { path: segments };
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

          const modulePath = path.resolve(__dirname, "api/[...path].ts");
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

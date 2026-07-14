import type { VercelRequest, VercelResponse } from "@vercel/node";
import healthHandler from "./_handlers/health.js";
import homeHandler from "./_handlers/home.js";
import recordsHandler from "./_handlers/records.js";
import exercisesListHandler from "./_handlers/exercises-list.js";
import exerciseDetailHandler from "./_handlers/exercise-detail.js";
import templatesListHandler from "./_handlers/templates-list.js";
import templatesActivateHandler from "./_handlers/templates-activate.js";
import sessionsHandler from "./_handlers/sessions.js";
import sessionsActiveHandler from "./_handlers/sessions-active.js";
import sessionDetailHandler from "./_handlers/session-detail.js";
import sessionSetsHandler from "./_handlers/session-sets.js";
import sessionSetDetailHandler from "./_handlers/session-set-detail.js";
import recommendationHandler from "./_handlers/recommendation.js";

type Handler = (req: VercelRequest, res: VercelResponse) => Promise<void> | void;

interface RouteEntry {
  pattern: string[];
  handler: Handler;
}

/**
 * Single Vercel function fronting all of /api/* (Hobby plan caps at 12 functions —
 * one per route file blew past that). Keep this table in sync with api/_handlers/.
 */
export const routes: RouteEntry[] = [
  { pattern: ["health"], handler: healthHandler },
  { pattern: ["home"], handler: homeHandler },
  { pattern: ["records"], handler: recordsHandler },
  { pattern: ["exercises"], handler: exercisesListHandler },
  { pattern: ["exercises", ":id"], handler: exerciseDetailHandler },
  { pattern: ["templates"], handler: templatesListHandler },
  { pattern: ["templates", "activate"], handler: templatesActivateHandler },
  { pattern: ["sessions"], handler: sessionsHandler },
  { pattern: ["sessions", "active"], handler: sessionsActiveHandler },
  { pattern: ["sessions", ":id"], handler: sessionDetailHandler },
  { pattern: ["sessions", ":id", "sets"], handler: sessionSetsHandler },
  { pattern: ["sessions", ":id", "sets", ":setId"], handler: sessionSetDetailHandler },
  { pattern: ["recommendations", ":exerciseId"], handler: recommendationHandler },
];

export function matchRoute(
  segments: string[],
): { handler: Handler; params: Record<string, string> } | null {
  for (const route of routes) {
    if (route.pattern.length !== segments.length) continue;
    const params: Record<string, string> = {};
    let ok = true;
    for (let i = 0; i < route.pattern.length; i++) {
      const p = route.pattern[i];
      if (p.startsWith(":")) {
        params[p.slice(1)] = segments[i];
      } else if (p !== segments[i]) {
        ok = false;
        break;
      }
    }
    if (ok) return { handler: route.handler, params };
  }
  return null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const pathParam = req.query.path;
  const segments = Array.isArray(pathParam) ? pathParam : pathParam ? [pathParam] : [];

  const match = matchRoute(segments);
  if (!match) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  Object.assign(req.query, match.params);
  await match.handler(req, res);
}

import type { PerformedSession, PerformedSet } from "./types.js";

function workingSets(session: PerformedSession): PerformedSet[] {
  return session.sets.filter((s) => !s.isWarmup);
}

function setsEqual(a: PerformedSet[], b: PerformedSet[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((set, i) => set.weight === b[i].weight && set.reps === b[i].reps);
}

/**
 * True when the most recent `windowSize` sessions all logged the identical
 * weight/rep pattern — no progression, no regression, just repetition.
 */
export function detectPlateau(history: PerformedSession[], windowSize = 3): boolean {
  if (history.length < windowSize) return false;
  const recent = history.slice(-windowSize).map(workingSets);
  const [first, ...rest] = recent;
  if (first.length === 0) return false;
  return rest.every((sets) => setsEqual(sets, first));
}

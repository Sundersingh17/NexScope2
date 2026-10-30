// Pure rules (no database): unit-tested.
export type Zone = "OFFICE" | "REMOTE" | "OUTSIDE" | "UNKNOWN";

// g comes from geo.evaluate(). netMatch = request came from an allowed office network (null = not configured).
export function zoneFor(g: { ok: boolean; inside: boolean; reason: string }, sessionZone: string, netMatch: boolean | null): Zone {
  if (g.reason === "INVALID_FIX") return "UNKNOWN";
  if (g.ok && g.inside) return "OFFICE";
  if (sessionZone === "REMOTE") return "REMOTE";
  if (!g.ok) return netMatch === true ? "OFFICE" : "UNKNOWN"; // poor GPS: only the office network can vouch
  return "OUTSIDE";
}

// Compares with the last KNOWN zone, so a bad GPS reading never raises or clears an alert.
export function transition(lastKnown: string | null, zone: Zone): "EXIT" | "ENTER" | null {
  if (zone === "UNKNOWN" || !lastKnown || lastKnown === zone) return null;
  if (zone === "OUTSIDE") return "EXIT";
  if (lastKnown === "OUTSIDE") return "ENTER";
  return null;
}

// Live warnings for an open session. Missing data is "unknown", never a violation.

export function liveFlags(i: {
  now: number;
  startedAt: number;
  lastPingAt: number | null;
  agentSeenAt: number | null;
}) {
  const f: string[] = [];
  const sessionAge = i.now - i.startedAt;
  const locationAge =
    i.lastPingAt === null ? null : i.now - i.lastPingAt;

  // Allow initial startup, then flag a missing or stale location
  // after 10 minutes without a successful location ping.
  if (
    sessionAge > 5 * 60_000 &&
    (locationAge === null || locationAge > 10 * 60_000)
  ) {
    f.push("LOCATION_UNKNOWN");
  }

  // Agent availability is independent of GPS availability.
  if (
    sessionAge > 5 * 60_000 &&
    (i.agentSeenAt === null ||
      i.now - i.agentSeenAt > 3 * 60_000)
  ) {
    f.push("AGENT_OFFLINE");
  }

  return f;
}

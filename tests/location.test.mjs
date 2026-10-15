// node --experimental-strip-types --no-warnings --test tests/location.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import { zoneFor, transition, liveFlags } from "../src/lib/workforce/zones.ts";
import { aggregate } from "../src/lib/workforce/analytics.ts";

const g = (reason) => ({ ok: reason === "INSIDE" || reason === "OUTSIDE", inside: reason === "INSIDE", reason });
test("zoneFor", () => {
  assert.equal(zoneFor(g("INSIDE"), "OFFICE", null), "OFFICE");
  assert.equal(zoneFor(g("OUTSIDE"), "OFFICE", null), "OUTSIDE");
  assert.equal(zoneFor(g("OUTSIDE"), "REMOTE", null), "REMOTE");
  assert.equal(zoneFor(g("LOW_ACCURACY"), "OFFICE", null), "UNKNOWN");
  assert.equal(zoneFor(g("LOW_ACCURACY"), "OFFICE", true), "OFFICE");
  assert.equal(zoneFor(g("LOW_ACCURACY"), "OFFICE", false), "UNKNOWN");
  assert.equal(zoneFor(g("INVALID_FIX"), "OFFICE", true), "UNKNOWN");
});
test("transition ignores UNKNOWN and repeats", () => {
  assert.equal(transition("OFFICE", "OUTSIDE"), "EXIT");
  assert.equal(transition("OUTSIDE", "OFFICE"), "ENTER");
  assert.equal(transition("OFFICE", "UNKNOWN"), null);
  assert.equal(transition("OUTSIDE", "OUTSIDE"), null);
  assert.equal(transition("OFFICE", "OFFICE"), null);
  assert.equal(transition(null, "OUTSIDE"), null);
});

test("liveFlags: location becomes unknown after grace periods", () => {
  const now = 1_000_000_000;

  // Initial grace period: no warning yet.
  assert.deepEqual(
    liveFlags({
      now,
      startedAt: now - 2 * 60_000,
      lastPingAt: null,
      agentSeenAt: now - 10_000,
    }),
    []
  );

  // No location has ever arrived after the initial grace period.
  assert.deepEqual(
    liveFlags({
      now,
      startedAt: now - 6 * 60_000,
      lastPingAt: null,
      agentSeenAt: now - 10_000,
    }),
    ["LOCATION_UNKNOWN"]
  );

  // A location update from 11 minutes ago is stale.
  assert.deepEqual(
    liveFlags({
      now,
      startedAt: now - 30 * 60_000,
      lastPingAt: now - 11 * 60_000,
      agentSeenAt: now - 10_000,
    }),
    ["LOCATION_UNKNOWN"]
  );

  // A recent GPS ping does not hide an offline desktop agent.
  assert.deepEqual(
    liveFlags({
      now,
      startedAt: now - 30 * 60_000,
      lastPingAt: now - 60_000,
      agentSeenAt: now - 10 * 60_000,
    }),
    ["AGENT_OFFLINE"]
  );
});

const d = (s) => new Date("2026-10-0" + s + "T09:00:00Z");
test("aggregate: team stats, hides small teams, counts per day", () => {
  const rows = [
    { employeeId: "a", team: "Dev", startedAt: d("1"), endedAt: new Date(d("1").getTime() + 3600_000), zone: "OFFICE", active: 50, idle: 10 },
    { employeeId: "b", team: "Dev", startedAt: d("1"), endedAt: new Date(d("1").getTime() + 7200_000), zone: "REMOTE", active: 100, idle: 20 },
    { employeeId: "c", team: "Dev", startedAt: d("2"), endedAt: new Date(d("2").getTime() + 3600_000), zone: "OFFICE", active: 40, idle: 20 },
    { employeeId: "x", team: "Ops", startedAt: d("1"), endedAt: new Date(d("1").getTime() + 3600_000), zone: "OFFICE", active: 59, idle: 1 },
  ];
  const r = aggregate(rows, { Dev: 3, Ops: 1 }, 3);
  const dev = r.teams.find((t) => t.team === "Dev");
  assert.equal(dev.hidden, false);
  assert.equal(dev.sessions, 3);
  assert.equal(dev.remoteSessions, 1);
  assert.equal(dev.avgSessionMin, 80);
  assert.equal(dev.activePct, 79); // 190 / 240
  assert.equal(r.teams.find((t) => t.team === "Ops").hidden, true);
  const ops = r.teams.find((t) => t.team === "Ops");

assert.deepEqual(ops, {
  team: "Ops",
  hidden: true,
});
  assert.deepEqual(r.days, [{ date: "2026-10-01", present: 3 }, { date: "2026-10-02", present: 1 }]);
});


test("aggregate: fills missing calendar dates with zero attendance", () => {
  const rows = [
    {
      employeeId: "a",
      team: "Dev",
      startedAt: new Date("2026-10-01T09:00:00Z"),
      endedAt: new Date("2026-10-01T10:00:00Z"),
      zone: "OFFICE",
      active: 50,
      idle: 10,
    },
    {
      employeeId: "b",
      team: "Dev",
      startedAt: new Date("2026-10-03T09:00:00Z"),
      endedAt: new Date("2026-10-03T10:00:00Z"),
      zone: "REMOTE",
      active: 40,
      idle: 20,
    },
  ];

  const r = aggregate(
    rows,
    { Dev: 3 },
    3,
    new Date("2026-10-04T12:00:00Z"),
    {
      start: new Date("2026-10-01T00:00:00Z"),
      end: new Date("2026-10-04T23:59:59Z"),
    },
  );

  assert.deepEqual(r.days, [
    { date: "2026-10-01", present: 1 },
    { date: "2026-10-02", present: 0 },
    { date: "2026-10-03", present: 1 },
    { date: "2026-10-04", present: 0 },
  ]);
});

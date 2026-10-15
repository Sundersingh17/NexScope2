
import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { writeFileSync, unlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

// Run each test scenario in a fresh Node process so module state,
// rate-limit history, and environment variables remain isolated.
function runScenario(source) {
  const file = join(
    tmpdir(),
    `nexscope-http-test-${process.pid}-${Date.now()}-${Math.random()
      .toString(16)
      .slice(2)}.mjs`
  );

  writeFileSync(file, source, "utf8");

  try {
    const result = spawnSync(
      process.execPath,
      ["--import", "tsx", file],
      {
        encoding: "utf8",
        cwd: process.cwd(),
        env: process.env,
        timeout: 15000,
      }
    );

    assert.equal(
      result.status,
      0,
      `Scenario failed.\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`
    );
  } finally {
    unlinkSync(file);
  }
}

const handlerUrl = pathToFileURL(
  join(process.cwd(), "src/lib/workforce/http.ts")
).href;

test("feature flag blocks workforce requests when disabled", () => {
  runScenario(`
    import assert from "node:assert/strict";
    process.env.WF_ENABLED = "false";
    process.env.WF_APP_ORIGIN = "http://localhost:3000";
    const { handle } = await import(${JSON.stringify(handlerUrl)});
    let called = false;
    const route = handle(async () => {
      called = true;
      return Response.json({ ok: true });
    });
    const response = await route(new Request("http://localhost/api", {
      method: "GET"
    }));
    assert.equal(response.status, 404);
    assert.equal(called, false);
  `);
});

test("configured same-origin write requests are accepted", () => {
  runScenario(`
    import assert from "node:assert/strict";
    process.env.WF_ENABLED = "true";
    process.env.WF_APP_ORIGIN = "http://localhost:3000";
    const { handle } = await import(${JSON.stringify(handlerUrl)});
    const route = handle(async () => Response.json({ ok: true }));
    const response = await route(new Request("http://localhost/api", {
      method: "POST",
      headers: { origin: "http://localhost:3000" }
    }));
    assert.equal(response.status, 200);
  `);
});

test("mismatched-origin write requests are rejected", () => {
  runScenario(`
    import assert from "node:assert/strict";
    process.env.WF_ENABLED = "true";
    process.env.WF_APP_ORIGIN = "http://localhost:3000";
    const { handle } = await import(${JSON.stringify(handlerUrl)});
    const route = handle(async () => Response.json({ ok: true }));
    const response = await route(new Request("http://localhost/api", {
      method: "POST",
      headers: { origin: "https://attacker.example" }
    }));
    assert.equal(response.status, 403);
  `);
});

test("GET requests are not blocked by the write-origin check", () => {
  runScenario(`
    import assert from "node:assert/strict";
    process.env.WF_ENABLED = "true";
    process.env.WF_APP_ORIGIN = "http://localhost:3000";
    const { handle } = await import(${JSON.stringify(handlerUrl)});
    const route = handle(async () => Response.json({ ok: true }));
    const response = await route(new Request("http://localhost/api", {
      method: "GET",
      headers: { origin: "https://other.example" }
    }));
    assert.equal(response.status, 200);
  `);
});

test("rate limiter rejects requests beyond the configured limit", () => {
  runScenario(`
    import assert from "node:assert/strict";
    process.env.WF_ENABLED = "true";
    const { limit, HttpError } = await import(${JSON.stringify(handlerUrl)});
    limit("http-test-key", 2, 60000);
    limit("http-test-key", 2, 60000);
    assert.throws(
      () => limit("http-test-key", 2, 60000),
      (error) => error instanceof HttpError && error.status === 429
    );
  `);
});

test("write requests without an Origin header are rejected", () => {
  runScenario(`
    import assert from "node:assert/strict";
    process.env.WF_ENABLED = "true";
    process.env.WF_APP_ORIGIN = "http://localhost:3000";
    const { handle } = await import(${JSON.stringify(handlerUrl)});
    const route = handle(async () => Response.json({ ok: true }));
    const response = await route(new Request("http://localhost/api", {
      method: "POST"
    }));
    assert.equal(response.status, 403);
  `);
});

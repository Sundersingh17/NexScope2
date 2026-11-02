import test from "node:test";
import assert from "node:assert/strict";
import { handle } from "../src/lib/workforce/http.ts";

test("native agent POSTs may omit Origin without allowing untrusted origins", async () => {
  process.env.WF_ENABLED = "true";
  process.env.WF_APP_ORIGIN = "https://workforce.example";

  const normalPost = handle(async () => Response.json({ ok: true }));
  const agentPost = handle(
    async () => Response.json({ ok: true }),
    { allowMissingOrigin: true },
  );
  const request = (origin) =>
    new Request("https://workforce.example/api/workforce/agent/register", {
      method: "POST",
      ...(origin ? { headers: { origin } } : {}),
    });

  assert.equal((await normalPost(request())).status, 403);
  assert.equal((await agentPost(request())).status, 200);
  assert.equal(
    (await agentPost(request("https://attacker.example"))).status,
    403,
  );
  assert.equal(
    (await agentPost(request("https://workforce.example"))).status,
    200,
  );
});

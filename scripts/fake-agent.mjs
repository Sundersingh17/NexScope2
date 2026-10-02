// Test the whole pipeline BEFORE the real Tauri agent exists.
//   node scripts/fake-agent.mjs http://localhost:3000 PAIRINGCODE
// 1) employee clicks "Add this PC" on the web -> code   2) run this   3) employee checks in   4) watch minutes grow
const [base = "http://localhost:3000", code] = process.argv.slice(2);
if (!code) { console.error("Usage: node scripts/fake-agent.mjs <baseUrl> <pairingCode>"); process.exit(1); }
const post = (p, body, token) => fetch(base + "/api/workforce" + p, { method: "POST", headers: { "content-type": "application/json", ...(token ? { authorization: "Bearer " + token } : {}) }, body: JSON.stringify(body) }).then(async (r) => ({ status: r.status, ...(await r.json()) }));
const reg = await post("/agent/register", { code, deviceName: "Fake test PC" });
if (!reg.deviceToken) { console.error("Register failed:", reg); process.exit(1); }
console.log("Paired as", reg.employeeName, "(token kept in memory only)");
const apps = ["VS Code", "Chrome", "Figma", "Slack"];
let last = "";
setInterval(async () => {
  const minute = new Date(Math.floor(Date.now() / 60000) * 60000).toISOString();
  const idle = Math.random() < 0.15;
  const r = await post("/agent/sync", { samples: [{ minute, app: apps[Math.floor(Math.random() * apps.length)], idle }] }, reg.deviceToken);
  const line = `${r.state} accepted=${r.accepted ?? 0}`;
  if (line !== last || r.accepted) console.log(new Date().toLocaleTimeString(), line);
  last = line;
}, 20000);

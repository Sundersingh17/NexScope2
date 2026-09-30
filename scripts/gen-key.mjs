import { randomBytes } from "node:crypto";
// node scripts/gen-key.mjs          -> 32-byte base64 key for WF_KEYS
// node scripts/gen-key.mjs secret   -> random string for WF_SESSION_SECRET
console.log(randomBytes(process.argv[2] === "secret" ? 48 : 32).toString(process.argv[2] === "secret" ? "base64url" : "base64"));

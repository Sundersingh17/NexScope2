import { mkdir, readFile, writeFile, unlink } from "node:fs/promises";
import path from "node:path";

// Free option: encrypted files on the server's disk (works on your own VM; add .wf-files to .gitignore).
// Serverless hosting has no persistent disk: swap these three functions for S3/R2 later.
const root = () => path.resolve(process.env.WF_FILES_DIR ?? "./.wf-files");
function at(k: string) {
  const p = path.resolve(root(), k);
  if (!p.startsWith(root() + path.sep)) throw new Error("Bad storage key");
  return p;
}
export async function put(k: string, buf: Buffer) { const p = at(k); await mkdir(path.dirname(p), { recursive: true }); await writeFile(p, buf); }
export const get = (k: string) => readFile(at(k));
export const del = (k: string) => unlink(at(k)).catch(() => {});

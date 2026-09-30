import { hash, verify } from "@node-rs/argon2"; // Argon2id by default

export const hashPassword = (p: string) => hash(p, { memoryCost: 19456, timeCost: 2, parallelism: 1 });
export const verifyPassword = (hashed: string, p: string) => verify(hashed, p).catch(() => false);

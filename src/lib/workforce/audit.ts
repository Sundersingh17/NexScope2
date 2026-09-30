import { prisma } from "./db";

// Never put passwords, codes, tokens or file contents in meta.
export const audit = (actorId: string, action: string, targetId?: string, meta?: Record<string, unknown>) =>
  prisma.wfAuditLog.create({ data: { actorId, action, targetId, meta: meta as any } });


import { Prisma } from "@prisma/client";

/**
 * Acquires a PostgreSQL row-level lock on a workforce session.
 *
 * Call this inside an interactive Prisma transaction before checking
 * or modifying the session's state, its location hold, or its activity.
 *
 * All competing session operations must acquire this same lock first.
 */
export async function lockWorkforceSession(
  tx: Prisma.TransactionClient,
  sessionId: string,
): Promise<{
  id: string;
  employeeId: string;
  startedAt: Date;
  endedAt: Date | null;
} | null> {
  const rows = await tx.$queryRaw<
    Array<{
      id: string;
      employeeId: string;
      startedAt: Date;
      endedAt: Date | null;
    }>
  >`
    SELECT "id", "employeeId", "startedAt", "endedAt"
    FROM "wf_session"
    WHERE "id" = ${sessionId}
    FOR UPDATE
  `;

  return rows[0] ?? null;
}

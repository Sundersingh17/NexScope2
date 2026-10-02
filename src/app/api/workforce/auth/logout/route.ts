import { cookies } from "next/headers";
import { handle } from "@/lib/workforce/http";

export const POST = handle(async () => {
  (await cookies()).delete("wf_session");
  return Response.json({ ok: true });
});

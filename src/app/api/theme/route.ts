import { NextResponse } from "next/server";
import { getPublishedThemePresets } from "@/lib/content";

// Public, unauthenticated, read-only — this only ever returns the small set
// of admin-curated color presets. No write access lives here; that's the
// admin route under /api/admin/theme.
export async function GET() {
  const presets = await getPublishedThemePresets();
  return NextResponse.json({ presets });
}

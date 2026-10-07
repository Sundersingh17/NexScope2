import { createClient } from "@supabase/supabase-js";

const BUCKET = "workforce-evidence";

function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variable"
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

function safeKey(k: string) {
  const normalized = k.replace(/\\/g, "/");

  if (
    !normalized ||
    normalized.startsWith("/") ||
    normalized.includes("..") ||
    normalized.includes("//")
  ) {
    throw new Error("Bad storage key");
  }

  return normalized;
}

export async function put(k: string, buf: Buffer) {
  const key = safeKey(k);
  const supabase = getSupabaseAdmin();

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(key, buf, {
      contentType: "application/octet-stream",
      upsert: false,
    });

  if (error) {
    throw new Error(`Supabase Storage upload failed: ${error.message}`);
  }
}

export async function get(k: string): Promise<Buffer> {
  const key = safeKey(k);
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .download(key);

  if (error || !data) {
    throw new Error(
      `Supabase Storage download failed: ${error?.message ?? "No data returned"}`
    );
  }

  return Buffer.from(await data.arrayBuffer());
}

export async function del(k: string) {
  const key = safeKey(k);
  const supabase = getSupabaseAdmin();

  const { error } = await supabase.storage
    .from(BUCKET)
    .remove([key]);

  if (error) {
    throw new Error(`Supabase Storage delete failed: ${error.message}`);
  }
}
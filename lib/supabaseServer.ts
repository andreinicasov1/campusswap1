import { createClient } from "@supabase/supabase-js";

export function supabaseServer() {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;
  if (!url || !serviceKey) throw new Error("Missing SUPABASE_URL or SUPABASE key env var");
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}

export function publicBucketUrl(path: string) {
  const url = process.env.SUPABASE_URL!;
  // Public URL format:
  // {SUPABASE_URL}/storage/v1/object/public/{bucket}/{path}
  const bucket = process.env.SUPABASE_BUCKET || "listing-images";
  return `${url}/storage/v1/object/public/${bucket}/${path}`;
}

import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { supabaseServer, publicBucketUrl } from "@/lib/supabaseServer";

const BUCKET = process.env.SUPABASE_BUCKET || "listing-images";

export async function GET() {
  const sb = supabaseServer();
  const { data, error } = await sb
    .from("listings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, listings: data ?? [] });
}

export async function POST(req: Request) {
  const sb = supabaseServer();
  const form = await req.formData();

  const title = String(form.get("title") ?? "").trim();
  const price = Number(form.get("price") ?? 0);
  const currency = String(form.get("currency") ?? "MDL").trim() || "MDL";
  const category = String(form.get("category") ?? "Other");
  const condition = String(form.get("condition") ?? "Used");
  const description = String(form.get("description") ?? "").trim();

  const seller_id = String(form.get("seller_id") ?? "guest");
  const seller_name = String(form.get("seller_name") ?? "Guest");
  const seller_username = form.get("seller_username") ? String(form.get("seller_username")) : null;

  if (!title || !Number.isFinite(price) || price <= 0) {
    return NextResponse.json({ ok: false, error: "Invalid title/price" }, { status: 400 });
  }

  // Optional image upload
  let image_url: string | null = null;
  const file = form.get("image");
  const isUpload =
    file &&
    typeof file === "object" &&
    "arrayBuffer" in file &&
    "type" in file &&
    "size" in file;

  if (isUpload && (file as any).size > 0) {
    const f = file as any;
    const maxBytes = 6 * 1024 * 1024;
    if (f.size > maxBytes) {
      return NextResponse.json({ ok: false, error: "Image too large (max 6MB)" }, { status: 400 });
    }

    const allowed = ["image/png", "image/jpeg", "image/webp"];
    if (!allowed.includes(f.type)) {
      return NextResponse.json({ ok: false, error: "Only png/jpg/webp allowed" }, { status: 400 });
    }

    const ext = f.type === "image/png" ? "png" : f.type === "image/webp" ? "webp" : "jpg";
    const path = `${seller_id}/${crypto.randomUUID()}.${ext}`;
    const bytes = new Uint8Array(await f.arrayBuffer());

    const up = await sb.storage.from(BUCKET).upload(path, bytes, {
      contentType: f.type,
      upsert: false
    });

    if (up.error) {
      return NextResponse.json({ ok: false, error: up.error.message }, { status: 500 });
    }

    image_url = publicBucketUrl(path);
  }

  const { data, error } = await sb
    .from("listings")
    .insert([{ title, price, currency, category, condition, description, image_url, seller_id, seller_name, seller_username }])
    .select("*")
    .single();

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, item: data });
}

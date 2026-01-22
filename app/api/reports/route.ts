import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { isAdminId } from "@/lib/admin";

export async function GET(req: Request) {
  const userId = req.headers.get("x-user-id") || "";
  if (!isAdminId(userId)) return NextResponse.json({ ok: false, error: "Admin only" }, { status: 403 });

  const sb = supabaseServer();
  const { data, error } = await sb.from("reports").select("*").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, reports: data ?? [] });
}

export async function POST(req: Request) {
  const sb = supabaseServer();
  const body = await req.json();

  const listing_id = String(body.listing_id ?? "");
  const reason = String(body.reason ?? "").trim();
  const reporter_id = String(body.reporter_id ?? "guest");

  if (!listing_id || !reason) return NextResponse.json({ ok: false, error: "listing_id/reason required" }, { status: 400 });

  const { data, error } = await sb.from("reports").insert([{ listing_id, reason, reporter_id }]).select("*").single();
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, report: data });
}

import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { isAdminId } from "@/lib/admin";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const sb = supabaseServer();
  const { data, error } = await sb.from("listings").select("*").eq("id", params.id).single();
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 404 });
  return NextResponse.json({ ok: true, item: data });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const userId = req.headers.get("x-user-id") || "";
  if (!isAdminId(userId)) return NextResponse.json({ ok: false, error: "Admin only" }, { status: 403 });

  const sb = supabaseServer();
  const { error } = await sb.from("listings").delete().eq("id", params.id);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, deleted: true });
}

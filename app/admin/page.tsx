"use client";

import { useEffect, useMemo, useState } from "react";
import { Listing, Report } from "@/lib/types";
import { getTgUser, tgReady } from "@/lib/tg";

export default function Admin() {
  const user = getTgUser();
  const [listings, setListings] = useState<Listing[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [adminOk, setAdminOk] = useState(false);

  useEffect(() => {
    tgReady();
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function refresh() {
    const res = await fetch("/api/listings", { cache: "no-store" });
    const data = await res.json();
    if (data.ok) setListings(data.listings as Listing[]);

    const r = await fetch("/api/reports", { headers: { "x-user-id": user.id }, cache: "no-store" });
    const rd = await r.json();
    if (rd.ok) {
      setAdminOk(true);
      setReports(rd.reports as Report[]);
    } else {
      setAdminOk(false);
      setReports([]);
    }
  }

  async function del(id: string) {
    if (!confirm("Delete listing?")) return;
    const res = await fetch(`/api/listings/${id}`, { method: "DELETE", headers: { "x-user-id": user.id } });
    const data = await res.json();
    if (!data.ok) alert(data.error ?? "Error");
    await refresh();
  }

  const byId = useMemo(() => {
    const m = new Map<string, Listing>();
    for (const l of listings) m.set(l.id, l);
    return m;
  }, [listings]);

  return (
    <div className="mx-auto max-w-[980px] px-4 py-6">
      <a href="/" className="text-blue-300/90 hover:text-blue-200">← Back</a>

      <div className="mt-4 cardGlass glow rounded-3xl p-6">
        <h2 className="text-2xl font-bold">Admin</h2>
        <p className="mt-1 subtle">
          Your Telegram user id: <b>{user.id}</b>. Admin is controlled by <code>ADMIN_USER_IDS</code>.
        </p>

        {!adminOk && (
          <div className="mt-4 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
            <p className="font-semibold">Not an admin.</p>
            <p className="mt-1 muted">
              Add your id to <code>.env.local</code>: <code>ADMIN_USER_IDS={user.id}</code>, restart <code>npm run dev</code>.
            </p>
          </div>
        )}

        {adminOk && (
          <>
            <div className="mt-5">
              <h3 className="text-lg font-semibold">Reports</h3>
              <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                {reports.map((r) => {
                  const l = byId.get(r.listing_id);
                  return (
                    <div key={r.id} className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
                      <div className="flex items-center justify-between">
                        <span className="badge">Report</span>
                        <span className="text-xs muted">{new Date(r.created_at).toLocaleString()}</span>
                      </div>
                      <p className="mt-2 font-semibold">{l?.title ?? "Listing not found"}</p>
                      <p className="mt-1 text-sm subtle">Reason: {r.reason}</p>
                      <p className="mt-2 text-xs muted">Reporter: {r.reporter_id}</p>

                      {l && (
                        <div className="mt-3 flex gap-2">
                          <a className="btn btnGhost" href={`/listing/${l.id}`}>Open</a>
                          <button className="btn btnPrimary" onClick={() => del(l.id)}>Delete</button>
                        </div>
                      )}
                    </div>
                  );
                })}
                {reports.length === 0 && (
                  <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 muted">No reports yet.</div>
                )}
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold">All listings (quick delete)</h3>
              <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                {listings.map(l => (
                  <div key={l.id} className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
                    <div className="flex items-center justify-between">
                      <span className="font-bold">{l.price} {l.currency}</span>
                      <span className="badge">{l.category}</span>
                    </div>
                    <p className="mt-2 lineClamp1 font-semibold">{l.title}</p>
                    <p className="mt-1 text-sm subtle lineClamp2">{l.description}</p>
                    <p className="mt-3 text-xs muted">Seller: {l.seller_id}</p>
                    <div className="mt-3 flex gap-2">
                      <a className="btn btnGhost" href={`/listing/${l.id}`}>Open</a>
                      <button className="btn btnPrimary" onClick={() => del(l.id)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

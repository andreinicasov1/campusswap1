"use client";

import { useEffect, useMemo, useState } from "react";
import { Listing } from "@/lib/types";
import { getTgUser, tgReady } from "@/lib/tg";

export default function MyListings() {
  const user = getTgUser();
  const [all, setAll] = useState<Listing[]>([]);

  useEffect(() => {
    tgReady();
    (async () => {
      const res = await fetch("/api/listings", { cache: "no-store" });
      const data = await res.json();
      if (data.ok) setAll(data.listings as Listing[]);
    })();
  }, []);

  const mine = useMemo(() => all.filter(x => x.seller_id === user.id), [all, user.id]);

  return (
    <div className="mx-auto max-w-[980px] px-4 py-6">
      <a href="/" className="text-blue-300/90 hover:text-blue-200">← Back</a>

      <div className="mt-4 cardGlass glow rounded-3xl p-6">
        <h2 className="text-2xl font-bold">My listings</h2>
        <p className="mt-1 subtle">Owner: {user.name} • id: {user.id}</p>

        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {mine.map(x => (
            <a key={x.id} href={`/listing/${x.id}`} className="cardGlass rounded-3xl p-4 ring-1 ring-blue-400/15 hover:ring-blue-300/30 transition">
              <div className="flex items-center justify-between">
                <span className="font-bold">{x.price} {x.currency}</span>
                <span className="badge">{x.condition}</span>
              </div>
              <p className="mt-2 lineClamp1 font-semibold">{x.title}</p>
              <p className="mt-1 text-sm subtle lineClamp2">{x.description}</p>
              <p className="mt-3 text-xs muted">{new Date(x.created_at).toLocaleString()}</p>
            </a>
          ))}
          {mine.length === 0 && (
            <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 muted">
              You have no listings yet. Create one with <a className="text-blue-200 underline" href="/create">Post</a>.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

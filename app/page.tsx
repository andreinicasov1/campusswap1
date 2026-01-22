"use client";

import { useEffect, useMemo, useState } from "react";
import Topbar from "@/components/Topbar";
import ListingCard from "@/components/ListingCard";
import { Listing } from "@/lib/types";
import { getTgUser, openTelegramChat, tgReady } from "@/lib/tg";

const categories = ["All", "Books", "Tech", "Furniture", "Clothes", "Other"] as const;

export default function Home() {
  const user = getTgUser();
  const [all, setAll] = useState<Listing[]>([]);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof categories)[number]>("All");
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  useEffect(() => {
    tgReady();
    refresh();
  }, []);

  async function refresh() {
    const res = await fetch("/api/listings", { cache: "no-store" });
    const data = await res.json();
    if (data.ok) setAll(data.listings as Listing[]);
  }

  const filtered = useMemo(() => {
    return all
      .filter(x => (cat === "All" ? true : x.category === cat))
      .filter(x => (maxPrice ? x.price <= maxPrice : true))
      .filter(x => (x.title + " " + x.description).toLowerCase().includes(q.toLowerCase()));
  }, [all, cat, maxPrice, q]);

  return (
    <div className="mx-auto max-w-[980px] px-4 py-6">
      <Topbar />

      <div className="mt-5 cardGlass glow rounded-3xl p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="flex-1">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search: macbook, textbook, chair..." className="inp" />
          </div>

          <div className="flex gap-2">
            <a href="/create" className="btn btnPrimary">+ Post</a>
            <a href="/my" className="btn btnGhost">My</a>
            <a href="/admin" className="btn btnGhost">Admin</a>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={["rounded-full px-3 py-1.5 text-sm ring-1 transition",
                c === cat ? "bg-blue-500/80 ring-blue-300/30" : "bg-white/5 ring-white/10 hover:bg-white/10"
              ].join(" ")}
            >
              {c}
            </button>
          ))}

          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm subtle">Max price</span>
            <input type="number" placeholder="MDL" className="w-28 inp !py-2 !px-3"
              onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : null)} />
          </div>
        </div>

        <div className="mt-3 text-xs muted">
          Admin is controlled by <code>ADMIN_USER_IDS</code>. Your Telegram user id: <b>{user.id}</b>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((x) => (
          <ListingCard
            key={x.id}
            item={x}
            onOpen={() => (window.location.href = `/listing/${x.id}`)}
            onWrite={() => openTelegramChat(x.seller_username ?? x.seller_id)}
          />
        ))}
      </div>

      <div className="mt-10 text-center text-sm muted">
        CampusSwap • Supabase DB + photo upload
      </div>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Listing } from "@/lib/types";
import { getTgUser, openTelegramChat, tgReady } from "@/lib/tg";

export default function ListingPage({ params }: { params: { id: string } }) {
  const user = getTgUser();
  const [item, setItem] = useState<Listing | null>(null);

  useEffect(() => {
    tgReady();
    (async () => {
      const res = await fetch(`/api/listings/${params.id}`, { cache: "no-store" });
      const data = await res.json();
      if (data.ok) setItem(data.item as Listing);
    })();
  }, [params.id]);

  const sellerLink = useMemo(() => (item ? (item.seller_username ?? item.seller_id) : ""), [item]);
  const img = item?.image_url || "https://placehold.co/1400x900/png?text=CampusSwap";

  async function report() {
    if (!item) return;
    const reason = prompt("Why are you reporting this listing? (spam/scam/etc)");
    if (!reason) return;

    const res = await fetch("/api/reports", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ listing_id: item.id, reason, reporter_id: user.id })
    });
    const data = await res.json();
    if (data.ok) alert("Reported. Thank you!");
    else alert(data.error ?? "Error");
  }

  if (!item) {
    return (
      <div className="mx-auto max-w-[980px] px-4 py-6">
        <a href="/" className="text-blue-300/90 hover:text-blue-200">← Back</a>
        <div className="mt-6 cardGlass glow rounded-3xl p-6">Loading...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[980px] px-4 py-6">
      <a href="/" className="text-blue-300/90 hover:text-blue-200">← Back</a>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="cardGlass glow rounded-3xl overflow-hidden">
          <Image src={img} alt={item.title} width={1400} height={900} className="h-[320px] w-full object-cover opacity-95" />
        </div>

        <div className="cardGlass glow rounded-3xl p-6">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-2xl font-bold">{item.title}</h1>
            <span className="badge">{item.condition}</span>
          </div>

          <p className="mt-3 text-3xl font-extrabold">
            {item.price} <span className="subtle">{item.currency}</span>
          </p>

          <p className="mt-3 subtle leading-relaxed">{item.description}</p>

          <div className="mt-5 flex flex-wrap items-center gap-2 text-sm muted">
            <span className="rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">{item.category}</span>
            <span className="rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">
              Posted: {new Date(item.created_at).toLocaleString()}
            </span>
          </div>

          <div className="mt-6 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
            <p className="text-sm muted">Seller</p>
            <p className="font-semibold">{item.seller_name}</p>
            <p className="text-blue-200/80 text-sm">{item.seller_username ?? "no username"}</p>
          </div>

          <button onClick={() => openTelegramChat(sellerLink)} className="mt-5 w-full btn btnPrimary">
            Write to seller
          </button>

          <button onClick={report} className="mt-3 w-full btn btnGhost">
            Report listing
          </button>
        </div>
      </div>
    </div>
  );
}

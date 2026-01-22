"use client";

import { Listing } from "@/lib/types";
import Image from "next/image";

export default function ListingCard({
  item,
  onOpen,
  onWrite
}: {
  item: Listing;
  onOpen: () => void;
  onWrite: () => void;
}) {
  const img = item.image_url || "https://placehold.co/1200x800/png?text=CampusSwap";

  return (
    <div className="cardGlass glow rounded-3xl overflow-hidden">
      <button onClick={onOpen} className="w-full text-left">
        <div className="h-44 w-full overflow-hidden">
          <Image src={img} alt={item.title} width={1200} height={800} className="h-full w-full object-cover opacity-90" />
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-lg font-bold">
              {item.price} <span className="subtle">{item.currency}</span>
            </p>
            <span className="badge">{item.condition}</span>
          </div>

          <p className="mt-2 lineClamp1 font-semibold">{item.title}</p>
          <p className="mt-1 lineClamp2 text-sm subtle">{item.description}</p>

          <div className="mt-3 flex items-center justify-between text-xs muted">
            <span>{item.category}</span>
            <span>{new Date(item.created_at).toLocaleString()}</span>
          </div>
        </div>
      </button>

      <div className="px-4 pb-4">
        <button onClick={onWrite} className="btn btnPrimary w-full">Write to seller</button>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { getTgUser, tgReady } from "@/lib/tg";

export default function Topbar() {
  const [user, setUser] = useState(() => getTgUser());

  useEffect(() => {
    tgReady();

    // Update a few times (Telegram initData can appear after initial render)
    let tries = 0;
    const maxTries = 20;
    const t = setInterval(() => {
      tries += 1;
      const u = getTgUser();
      setUser(u);
      if (u.id !== "guest" || tries >= maxTries) clearInterval(t);
    }, 200);

    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1 ring-1 ring-blue-400/20">
          <span className="h-2 w-2 rounded-full bg-blue-400" />
          <span className="text-sm text-blue-200/90">Telegram Mini App</span>
        </div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">
          CampusSwap <span className="text-blue-300/80">Marketplace</span>
        </h1>
        <p className="mt-1 subtle">Buy & sell stuff fast. Local. Simple. No signup.</p>
      </div>

      <div className="cardGlass glow rounded-2xl px-4 py-3 text-right min-w-[180px]">
        <p className="text-xs muted">Signed in as</p>
        <p className="font-semibold">{user.name}</p>
        <p className="text-sm text-blue-200/80">{user.username ?? "no username"}</p>
      </div>
    </div>
  );
}

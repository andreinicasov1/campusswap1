"use client";

import { useEffect, useState } from "react";
import { getTelegramUser } from "@/lib/tg-client";

export default function Topbar() {
  const [name, setName] = useState("guest");

  useEffect(() => {
    (async () => {
      const u = await getTelegramUser();
      if (u?.first_name) setName(u.first_name);
      else if (u?.username) setName(u.username);
      else if (u?.id) setName(String(u.id));
    })();
  }, []);

  return (
    <div className="...">
      <span>{name}</span>
    </div>
  );
}

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

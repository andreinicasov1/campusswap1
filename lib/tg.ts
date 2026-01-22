"use client";

import WebApp from "@twa-dev/sdk";

export function getTg() {
  if (typeof window === "undefined") return null as any;
  // @ts-ignore
  return window.Telegram?.WebApp ?? null;
}

export function tgReady() {
  try {
    WebApp.ready();
    WebApp.expand();
  } catch {
    const tg = getTg();
    tg?.ready?.();
    tg?.expand?.();
  }
}

type UiUser = { id: string; username: string | null; name: string };

function fromUnsafe(user: any): UiUser | null {
  if (!user) return null;
  const name = [user.first_name, user.last_name].filter(Boolean).join(" ").trim() || "User";
  const username = user.username ? `@${user.username}` : null;
  return { id: String(user.id), username, name };
}

export function getTgUser(): UiUser {
  // 1) Preferred: SDK (reads initDataUnsafe)
  try {
    const u = WebApp.initDataUnsafe?.user;
    const parsed = fromUnsafe(u);
    if (parsed) return parsed;
  } catch {
    // ignore
  }

  // 2) Fallback: window.Telegram.WebApp
  const tg = getTg();
  const parsed2 = fromUnsafe(tg?.initDataUnsafe?.user);
  if (parsed2) return parsed2;

  // 3) Fallback: cached user from TelegramInit (avoids "guest" flash)
  if (typeof window !== "undefined") {
    const cached = localStorage.getItem("tg_user");
    if (cached) {
      try {
        const u = JSON.parse(cached);
        const parsed3 = fromUnsafe(u);
        if (parsed3) return parsed3;
      } catch {
        // ignore
      }
    }
  }

  return { id: "guest", username: null, name: "Guest" };
}

export function openTelegramChat(usernameOrId: string) {
  const tg = getTg();
  const url = usernameOrId.startsWith("@")
    ? `https://t.me/${usernameOrId.slice(1)}`
    : `tg://user?id=${usernameOrId}`;

  if (tg?.openTelegramLink) tg.openTelegramLink(url);
  else window.open(url, "_blank");
}

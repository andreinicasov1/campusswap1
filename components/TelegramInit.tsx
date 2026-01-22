"use client";

import { useEffect } from "react";
import WebApp from "@twa-dev/sdk";

/**
 * Ensures Telegram Mini App API is initialized and caches user info for UI.
 * Works even if initData becomes available a moment after mount.
 */
export default function TelegramInit() {
  useEffect(() => {
    const tryInit = () => {
      try {
        WebApp.ready();
        WebApp.expand();

        const u = WebApp.initDataUnsafe?.user;
        if (u?.id) {
          localStorage.setItem("tg_user", JSON.stringify(u));
          return true;
        }
      } catch {
        // ignore
      }
      return false;
    };

    // Try immediately + retry a few times (Telegram sometimes injects data slightly later)
    let tries = 0;
    const maxTries = 20; // ~4s
    if (tryInit()) return;

    const t = setInterval(() => {
      tries += 1;
      if (tryInit() || tries >= maxTries) clearInterval(t);
    }, 200);

    return () => clearInterval(t);
  }, []);

  return null;
}

"use client";

import { useEffect } from "react";

export default function TelegramInit() {
  useEffect(() => {
    (async () => {
      try {
        const mod = await import("@twa-dev/sdk");
        const WebApp = mod.default;
        WebApp.ready();
        WebApp.expand();
      } catch (e) {
        // если открыто не в Telegram — просто молча
      }
    })();
  }, []);

  return null;
}

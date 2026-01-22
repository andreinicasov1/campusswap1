"use client";

export async function getTelegramUser() {
  if (typeof window === "undefined") return null;

  // динамический импорт, чтобы точно не попало в SSR
  const mod = await import("@twa-dev/sdk");
  const WebApp = mod.default;

  WebApp.ready();
  WebApp.expand();

  return WebApp.initDataUnsafe?.user ?? null;
}

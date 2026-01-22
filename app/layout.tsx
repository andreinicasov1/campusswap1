import "./globals.css";
import Script from "next/script";
import TelegramInit from "@/components/TelegramInit";

export const metadata = {
  title: "CampusSwap",
  description: "Ultra-modern student marketplace inside Telegram"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className="min-h-screen bg-app text-white">
        <TelegramInit />
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RASEED — Consumer Dispute Assistant",
  description:
    "RASEED helps you prepare evidence-backed consumer complaints for online shopping and refund disputes in India.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-surface-50">
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "FuelGuard | UNO Setabganj - Fuel Control & Monitoring System",
  description: "Fuel Control & Monitoring System for Bochaganj Upazila Nirbahi Office (UNO). Regulating fuel consumption for motorcycles and motor vehicles across 5 fuel stations in Setabganj: Bakultala, Tulei, Setabganj, Rampur, and MI Fuel Station.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased">
        <Header />
        <main className="min-h-[calc(100vh-4rem)]">{children}</main>
        <footer className="bg-slate-900 text-slate-400 py-6 text-center text-sm border-t">
          © {new Date().getFullYear()} Bochaganj UNO Office • FuelGuard System • Setabganj, Bangladesh
        </footer>
      </body>
    </html>
  );
}

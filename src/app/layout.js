"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { MarmaladeProvider } from "./context/MarmaladeContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <header>
          <span>Free Delivery</span>
          <a className="basket" href="/basket">Basket</a>
        </header>
        <div className="logo" onClick={() => window.location.href = '/'}>
          Marmalade
        </div>

        <MarmaladeProvider>
          {children}
        </MarmaladeProvider>
        <footer>Help   Contact Us</footer>
        </body>
    </html>
  );
}

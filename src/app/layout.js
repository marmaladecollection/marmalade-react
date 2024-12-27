"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MyProvider } from "./context/MyContext";

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
        <header>Free Delivery</header>
        <MyProvider>
          {children}
        </MyProvider>
        <footer>Help   Contact Us</footer>
        </body>
    </html>
  );
}

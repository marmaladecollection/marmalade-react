"use client";

import { Libre_Baskerville, Noto_Sans } from "next/font/google";
import { MarmaladeProvider } from "./context/MarmaladeContext";
import "./globals.css";
import Header from "./header";

const serifFont = Libre_Baskerville({
  variable: "--font-s",
  subsets: ['latin'],
  weight: '400',
});

const sansSerifFont = Noto_Sans({
  variable: "--font-ss",
  subsets: ['latin'],
});


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${serifFont.variable} ${sansSerifFont.variable}`}>
        <Header/>

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

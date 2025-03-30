"use client";

import { Libre_Baskerville, Noto_Sans } from "next/font/google";
import { MarmaladeProvider } from "./context/MarmaladeContext";
import Footer from "./footer";
import "./globals.css";
import Header from "./header";
import TopBar from "./topbar";

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
        <MarmaladeProvider>
          <Header/>
          <TopBar/>
          {children}
        </MarmaladeProvider>
        <Footer/>
      </body>
    </html>
  );
}

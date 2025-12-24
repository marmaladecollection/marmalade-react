"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Libre_Baskerville, Noto_Sans } from "next/font/google";
import { MarmaladeProvider } from "./context/MarmaladeContext";
import Footer from "./footer";
import "./globals.css";
import Header from "./header";
import TopBar from "./topbar";
import { trackEvent } from "./firebase";

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
  const pathname = usePathname();

  useEffect(() => {
    // Track page views automatically
    trackEvent('page_view', {
      page_path: pathname,
      page_title: typeof document !== 'undefined' ? document.title : pathname
    });
  }, [pathname]);

  return (
    <html lang="en">
      <body className={`${serifFont.variable} ${sansSerifFont.variable}`}>
        <div className="page-wrapper">
          <div className="content-wrapper">
            <MarmaladeProvider>
              <Header/>
              <TopBar/>
              {children}
            </MarmaladeProvider>
          </div>
          <Footer/>
        </div>
      </body>
    </html>
  );
}

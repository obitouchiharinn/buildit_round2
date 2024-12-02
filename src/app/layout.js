"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Providers from "./Providers";
import SearchBox from "@/components/SearchBox";
import dynamic from "next/dynamic"; // Import dynamic
import { useState, useEffect } from "react";

// Dynamically load components if needed
const DynamicHeader = dynamic(() => import("@/components/Header"));
const DynamicSearchBox = dynamic(() => import("@/components/SearchBox"));

const inter = Inter({ subsets: ["latin"], display: "swap" });

export default function RootLayout({ children }) {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    // Optional: Add logic to detect system theme preference or user settings
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    setTheme(prefersDark ? "dark" : "light");
  }, []);

  return (
    <html lang="en" className={theme}>
      <head>
        {/* Preload font with proper attributes */}
        <link
          rel="preload"
          href="/path-to-inter-font.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className={inter.className}>
        <Providers>
          {/* Dynamically load components */}
          <DynamicHeader />
          <DynamicSearchBox />
          {children}
        </Providers>
      </body>
    </html>
  );
}

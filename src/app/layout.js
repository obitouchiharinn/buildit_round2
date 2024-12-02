'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";
import Providers from "./Providers";

// Dynamically load non-critical components with loading states
const DynamicHeader = dynamic(() => import("@/components/Header"), {
  ssr: false, // Load only on the client-side
  loading: () => <div>Loading Header...</div>,
});
const DynamicSearchBox = dynamic(() => import("@/components/SearchBox"), {
  ssr: false,
  loading: () => <div>Loading Search Box...</div>,
});

// Load Inter font with optimal settings
const inter = Inter({
  subsets: ["latin"],
  display: "swap", // Ensure text is visible while fonts load
});

export default function RootLayout({ children }) {
  // Theme detection on the client side
  const theme =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";

  return (
    <html lang="en" className={theme}>
      <head>
        {/* Preload fonts */}
        <link
          rel="preload"
          href="/fonts/inter.woff2" // Replace with the actual font file path
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className={inter.className}>
        {/* Provide theme and global context */}
        <Providers>
          {/* Dynamically loaded components */}
          <DynamicHeader />
          <DynamicSearchBox />
          {children}
        </Providers>
      </body>
    </html>
  );
}

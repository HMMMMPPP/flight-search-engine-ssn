import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SettingsProvider } from "@/context/SettingsContext";
import { SpeedInsights } from "@vercel/speed-insights/next";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SkySpeed Neo",
  description: "Find the best flight deals with AI-powered search. Real-time price analysis, smart filters, and strategic booking advice powered by Amadeus Intelligence.",
  keywords: ["flight search", "cheap flights", "flight deals", "AI flight search", "Amadeus", "travel", "flight booking"],
  authors: [{ name: "SkySpeed Team" }],
  creator: "SkySpeed Neo",
  icons: {
    icon: '/icon.png',
  },
  metadataBase: new URL('https://skyspeed-neo.netlify.app'), // Update with your actual domain
  openGraph: {
    title: "SkySpeed Neo",
    description: "Smart flight search with AI-powered price predictions and strategic booking advice",
    type: "website",
    locale: "en_US",
    siteName: "SkySpeed Neo",
  },
  twitter: {
    card: "summary_large_image",
    title: "SkySpeed Neo",
    description: "Find the best flight deals with AI-powered analysis",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SettingsProvider>
          {children}
        </SettingsProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}

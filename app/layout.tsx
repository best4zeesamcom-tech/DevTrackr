import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
//import Header from "@/components/ui/Header";
//import Footer from "@/components/ui/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DEVTRACKR - AI Career Coach for Developers",
  description: "Upload your resume, get personalized learning roadmap, track progress, and land your dream developer job.",
  keywords: "developer career, coding roadmap, skill analyzer, tech jobs, programming interview prep",
  authors: [{ name: "DEVTRACKR" }],
  openGraph: {
    title: "DEVTRACKR - Your Developer Career Path",
    description: "AI-powered career guidance for software engineers",
    url: "https://devtrackr.vercel.app",
    siteName: "DEVTRACKR",
    images: [{ url: "https://devtrackr.vercel.app/og-image.png", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DEVTRACKR - AI Career Coach",
    description: "Track your developer journey",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
      
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
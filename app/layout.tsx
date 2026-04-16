import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "DEVTRACKR - AI Career Coach for Developers",
    template: "%s | DEVTRACKR",
  },
  description: "Upload your resume and get personalized AI-powered skill recommendations, learning roadmap, and interview preparation. Start your developer career journey today.",
  keywords: [
    "developer career",
    "coding roadmap",
    "skill analyzer",
    "tech jobs",
    "programming interview prep",
    "resume analyzer",
    "AI career coach",
    "software engineer roadmap",
  ],
  authors: [{ name: "DEVTRACKR", url: "https://dev-trackr-7j6q.vercel.app" }],
  creator: "DEVTRACKR",
  publisher: "DEVTRACKR",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "DEVTRACKR - AI Career Coach for Developers",
    description: "Upload your resume and get personalized AI-powered skill recommendations, learning roadmap, and interview preparation.",
    url: "https://dev-trackr-7j6q.vercel.app",
    siteName: "DEVTRACKR",
    images: [
      {
        url: "https://dev-trackr-7j6q.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "DEVTRACKR - AI Career Coach for Developers",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DEVTRACKR - AI Career Coach for Developers",
    description: "Upload your resume and get personalized AI-powered skill recommendations, learning roadmap, and interview preparation.",
    images: ["https://dev-trackr-7j6q.vercel.app/og-image.png"],
  },
  verification: {
    google: "YOUR_GOOGLE_VERIFICATION_CODE_HERE", // 👈 Replace with your actual code from Google Search Console
  },
  alternates: {
    canonical: "https://dev-trackr-7j6q.vercel.app",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={inter.className}>
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
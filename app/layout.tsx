import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VELRYA AI - Intelligent Chat Assistant",
  description: "Build and chat with VELRYA AI - Your intelligent assistant for coding, writing, and ideas.",
  keywords: "AI chat, assistant, coding, writing, velrya",
  authors: [{ name: "VELRYA AI" }],
  openGraph: {
    title: "VELRYA AI - Intelligent Chat Assistant",
    description: "Build and chat with VELRYA AI - Your intelligent assistant.",
    url: "https://velrya-ai.vercel.app",
    siteName: "VELRYA AI",
    images: [
      {
        url: "https://velrya-ai.vercel.app/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VELRYA AI - Intelligent Chat Assistant",
    description: "Build and chat with VELRYA AI - Your intelligent assistant.",
    images: ["https://velrya-ai.vercel.app/og-image.png"],
  },
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
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

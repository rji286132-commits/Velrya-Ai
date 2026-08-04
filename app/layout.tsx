import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://velrya-ai.vercel.app"),
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
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "VELRYA AI",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VELRYA AI - Intelligent Chat Assistant",
    description: "Build and chat with VELRYA AI - Your intelligent assistant.",
    images: ["/og-image.png"],
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#08080f",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h- w-screen bg-[#08080f] antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}

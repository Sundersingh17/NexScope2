import type { Metadata } from "next";
import { Space_Grotesk, Archivo, Fraunces, Manrope, Syne, Inter } from "next/font/google";
import "./globals.css";
import { SchemaScript } from "@/components/layout/schema-script";
import { AnalyticsScripts } from "@/components/layout/analytics-scripts";
import { SiteChrome } from "@/components/layout/site-chrome";
import { ServiceWorkerRegister } from "@/components/layout/service-worker-register";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
});

const archivo = Archivo({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-archivo",
});

// Two additional headline/body pairings, loaded alongside the default so a
// Design Preset can switch --font-family-display / --font-family-sans to
// point at any of them. preload: false on all four of these — they're not
// applied to anything until a visitor actually picks a non-default preset,
// so eagerly preloading them just adds unused weight to every normal page
// load and trips Chrome's "preloaded but not used" warning. Without
// preload they're fetched on demand the first time they're needed, which
// is imperceptible for a manual click and still uses display: "swap".
const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
  weight: ["600", "900"],
  preload: false,
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: false,
});

const syne = Syne({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-syne",
  weight: ["700", "800"],
  preload: false,
});

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
  preload: false,
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nexscope.in";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "NexScope — AI, Design & Growth Solutions Agency",
    template: "%s | NexScope Agency — AI, Design & Growth",
  },
  description:
    "NexScope is a full-stack digital agency in India offering AI automation, web & app development, branding, and digital marketing. Build, automate, and grow your business with expert solutions.",
  keywords: [
    "AI automation agency",
    "web development company",
    "branding agency India",
    "digital marketing agency",
    "NexScope",
    "growth solutions",
    "app development",
    "UI UX design",
    "SEO services",
    "content marketing",
    "Indian digital agency",
    "business automation",
  ],
  authors: [{ name: "NexScope Agency", url: siteUrl }],
  creator: "NexScope Agency",
  publisher: "NexScope Agency",
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
    type: "website",
    locale: "en_IN",
    siteName: "NexScope Agency",
    title: "NexScope — AI, Design & Growth Solutions Agency",
    description:
      "NexScope helps businesses build, automate and grow through AI automation, web development, branding, and digital marketing. Based in India, serving the world.",
    url: siteUrl,
    images: [
      {
        url: `${siteUrl}/images/og-default.jpg`,
        width: 1200,
        height: 630,
        alt: "NexScope Agency — AI, Design & Growth Solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NexScope — AI, Design & Growth Solutions Agency",
    description:
      "NexScope helps businesses build, automate and grow through AI automation, web development, branding, and digital marketing.",
    images: [`${siteUrl}/images/og-default.jpg`],
  },
  alternates: {
    canonical: siteUrl,
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/logo/5.png", sizes: "96x96", type: "image/png" },
      { url: "/logo/10.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#050505",
      },
    ],
  },
  other: {
    "msapplication-TileColor": "#050505",
    "msapplication-config": "/browserconfig.xml",
    "apple-mobile-web-app-title": "NexScope",
    "application-name": "NexScope",
    "og:latitude": "20.5937",
    "og:longitude": "78.9629",
    "og:country-name": "India",
  },
  category: "technology",
  classification: "Digital Agency",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${archivo.variable} ${fraunces.variable} ${inter.variable} ${syne.variable} ${manrope.variable}`}
    >
      <head>
        <SchemaScript />
        <AnalyticsScripts />
      </head>
      <body className="antialiased">
        <ServiceWorkerRegister />
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
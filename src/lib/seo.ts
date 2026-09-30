import { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nexscope.in";
const siteName = "NexScope Agency";

interface SEOParams {
  title: string;
  description: string;
  path?: string;
  ogImage?: string;
  noIndex?: boolean;
  publishedAt?: string;
  updatedAt?: string;
  type?: "website" | "article";
  tags?: string[];
}

export function generateMetadata({
  title,
  description,
  path = "",
  ogImage = "/images/og-default.jpg",
  noIndex = false,
  type = "website",
  tags,
}: SEOParams): Metadata {
  const url = `${siteUrl}${path}`;
  const fullTitle = `${title} | ${siteName}`;

  return {
    title: fullTitle,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName,
      type,
      images: [
        {
          url: `${siteUrl}${ogImage}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [`${siteUrl}${ogImage}`],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    keywords: tags?.join(", "),
    other: {
      "og:locale": "en_IN",
    },
  };
}

export const homeMetadata: Metadata = generateMetadata({
  title: "AI, Design & Growth Solutions",
  description:
    "NexScope helps businesses build, automate and grow through technology, branding and digital marketing. Scale faster with AI, design & growth solutions.",
  path: "/",
});

export const siteConfig = {
  name: siteName,
  url: siteUrl,
  ogImage: `${siteUrl}/images/og-default.jpg`,
  description:
    "NexScope helps businesses build, automate and grow through AI automation, web development, branding, and digital marketing.",
  email: "hello@nexscope.in",
  phone: "+91 98765 43210",
  address: "India",
  links: {
    twitter: "https://twitter.com/nexscope",
    instagram: "https://instagram.com/nexscope",
    linkedin: "https://linkedin.com/company/nexscope",
    github: "https://github.com/nexscope",
  },
};

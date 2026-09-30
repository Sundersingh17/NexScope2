import { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nexscope.in";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/thank-you", "/error", "/not-found", "/admin"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/", "/thank-you", "/error", "/not-found"],
      },
      {
        userAgent: "Googlebot-Image",
        allow: ["/logo/", "/images/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}

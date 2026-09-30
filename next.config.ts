import type { NextConfig } from "next";

const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://analytics.google.com https://apis.google.com https://*.firebaseapp.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: https: https://cdn.sanity.io https://*.googleusercontent.com;
  font-src 'self';
  connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://va.vercel-scripts.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://*.firebaseio.com https://www.googleapis.com;
  frame-src 'self' https://calendly.com https://www.google.com https://apis.google.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
`;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        // The admin upload flow (/api/admin/upload) pushes files to Vercel
        // Blob storage, not Sanity — without this, any next/image usage
        // against an uploaded image (team photos, portfolio images) would
        // fail at request time even though the URL itself is valid.
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        {
          key: "X-Frame-Options",
          value: "DENY",
        },
        {
          key: "X-Content-Type-Options",
          value: "nosniff",
        },
        {
          key: "Referrer-Policy",
          value: "strict-origin-when-cross-origin",
        },
        {
          key: "X-XSS-Protection",
          value: "1; mode=block",
        },
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
        },
        {
          key: "Content-Security-Policy",
          value: cspHeader.replace(/\n/g, "").trim(),
        },
      ],
    },
  ],
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
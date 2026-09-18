import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "NexScope Privacy Policy — how we collect, use, and protect your data.",
  robots: { index: false, follow: true },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="pt-28 py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 prose prose-invert prose-zinc">
        <h1>Privacy Policy</h1>
        <p className="text-[var(--color-gray)]">Last updated: January 2026</p>

        <h2>Information We Collect</h2>
        <p>We collect information you provide directly, such as your name, email address, phone number, and project details when you fill out forms on our website.</p>

        <h2>How We Use Your Information</h2>
        <p>We use the information to respond to inquiries, provide services, improve our website, and send relevant communications with your consent.</p>

        <h2>Data Protection</h2>
        <p>We implement industry-standard security measures to protect your personal information.</p>

        <h2>Third-Party Services</h2>
        <p>We may use third-party services (analytics, hosting, email) that process data according to their privacy policies.</p>

        <h2>Contact</h2>
        <p>For privacy-related inquiries, email us at <a href="mailto:hello@nexscope.in" className="text-[var(--color-orange)] underline">hello@nexscope.in</a>.</p>
      </div>
    </div>
  );
}
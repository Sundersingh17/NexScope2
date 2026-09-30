import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "NexScope Cookie Policy — how we use cookies on our website.",
  robots: { index: false, follow: true },
};

export default function CookiePolicyPage() {
  return (
    <div className="pt-28 pb-20">
      <section className="py-16 border-b-2 border-[var(--color-ink)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
            Cookie Policy
          </h1>
          <p className="text-[var(--color-gray)] text-sm mb-12">Last updated: June 2026</p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 prose prose-invert prose-zinc">
          <h2>What Are Cookies</h2>
          <p>
            Cookies are small text files stored on your device when you visit a website. They help us improve your browsing experience by remembering preferences, analysing traffic, and enabling core functionality.
          </p>

          <h2>How We Use Cookies</h2>
          <p>We use the following types of cookies:</p>
          <ul>
            <li><strong>Essential Cookies:</strong> Required for the website to function properly. These cannot be disabled.</li>
            <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our site so we can improve performance.</li>
            <li><strong>Functional Cookies:</strong> Remember your preferences for a personalised experience.</li>
            <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements and track campaign effectiveness.</li>
          </ul>

          <h2>Third-Party Cookies</h2>
          <p>
            We may use third-party services such as Google Analytics and Meta Pixel, which set their own cookies. These providers have their own privacy and cookie policies.
          </p>

          <h2>Managing Cookies</h2>
          <p>
            You can control cookies through your browser settings. Disabling certain cookies may affect website functionality. Most browsers allow you to:
          </p>
          <ul>
            <li>View and delete cookies</li>
            <li>Block third-party cookies</li>
            <li>Block all cookies</li>
            <li>Set preferences for specific websites</li>
          </ul>

          <h2>Changes to This Policy</h2>
          <p>
            We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated revision date.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have any questions about our use of cookies, please contact us at{" "}
            <a href="mailto:hello@nexscope.in" className="text-[var(--color-orange)] underline">hello@nexscope.in</a>.
          </p>
        </div>
      </section>
    </div>
  );
}
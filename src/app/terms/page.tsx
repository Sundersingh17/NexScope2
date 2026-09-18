import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "NexScope Terms of Service — terms and conditions for using our services.",
  robots: { index: false, follow: true },
};

export default function TermsPage() {
  return (
    <div className="pt-28 py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 prose prose-invert prose-zinc">
        <h1>Terms of Service</h1>
        <p className="text-[var(--color-gray)]">Last updated: January 2026</p>

        <h2>Services</h2>
        <p>NexScope provides digital agency services including web development, AI automation, branding, design, and marketing. All services are delivered according to the scope defined in your project agreement.</p>

        <h2>Intellectual Property</h2>
        <p>Upon full payment, clients receive full ownership of deliverables created specifically for their project. NexScope retains the right to display work in its portfolio.</p>

        <h2>Payments</h2>
        <p>Payment terms are defined in individual project agreements. Late payments may result in project delays or suspension.</p>

        <h2>Limitation of Liability</h2>
        <p>NexScope's liability is limited to the total amount paid for the specific project giving rise to the claim.</p>

        <h2>Contact</h2>
        <p>For questions about these terms, email <a href="mailto:hello@nexscope.in" className="text-[var(--color-orange)] underline">hello@nexscope.in</a>.</p>
      </div>
    </div>
  );
}
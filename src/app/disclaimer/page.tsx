import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "NexScope Disclaimer — general information about our website content and services.",
  robots: { index: false, follow: true },
};

export default function DisclaimerPage() {
  return (
    <div className="pt-28 pb-20">
      <section className="py-16 border-b-2 border-[var(--color-ink)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
            Disclaimer
          </h1>
          <p className="text-[var(--color-gray)] text-sm mb-12">Last updated: June 2026</p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 prose prose-invert prose-zinc">
          <h2>General Information</h2>
          <p>
            The information provided on this website is for general informational purposes only. While we strive to keep the information accurate and up to date, NexScope makes no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the information contained on the website.
          </p>

          <h2>Professional Advice</h2>
          <p>
            The content on this website does not constitute professional advice. You should consult with a qualified professional before making any decisions based on the information provided. Any reliance you place on such information is strictly at your own risk.
          </p>

          <h2>External Links</h2>
          <p>
            This website may contain links to external websites that are not provided or maintained by NexScope. We do not guarantee the accuracy, relevance, timeliness, or completeness of any information on these external websites. The inclusion of any link does not imply endorsement by NexScope.
          </p>

          <h2>Limitation of Liability</h2>
          <p>
            In no event shall NexScope be liable for any loss or damage including without limitation, indirect or consequential loss or damage, or any loss or damage whatsoever arising from loss of data or profits arising out of, or in connection with, the use of this website.
          </p>

          <h2>Testimonials</h2>
          <p>
            Testimonials appearing on this website are received in various forms via multiple channels. They are individual experiences, reflecting real-life experiences of those who have used our services. However, they are not necessarily representative of all users. We do not claim that they are typical results that consumers will generally achieve.
          </p>

          <h2>Changes</h2>
          <p>
            We reserve the right to update or change this disclaimer at any time. Your continued use of the website after any changes constitutes acceptance of the new terms.
          </p>

          <h2>Contact</h2>
          <p>
            If you have any questions about this disclaimer, please contact us at{" "}
            <a href="mailto:hello@nexscope.in" className="text-[var(--color-orange)] underline">hello@nexscope.in</a>.
          </p>
        </div>
      </section>
    </div>
  );
}
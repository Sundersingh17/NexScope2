"use client";

import { usePathname } from "next/navigation";
import { FloatingWhatsApp } from "@/components/layout/floating-whatsapp";
import { CookieConsentBanner } from "@/components/layout/cookie-consent-banner";
import { CustomCursor } from "@/components/layout/custom-cursor";
import { MobileProjectCta } from "@/components/layout/mobile-project-cta";
import { PageTransition } from "@/components/layout/page-transition";
import { ThemeSwitcher } from "@/components/layout/theme-switcher";
import {
  DesignProvider,
  useDesign,
} from "@/components/design-system/design-provider";
import { Crossfade } from "@/components/design-system/design-renderer";

function SiteChromeInner({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { design: Design, designSlug } = useDesign();

  const isAdmin =
    pathname === "/admin" ||
    pathname.startsWith("/admin/");

  const isPortal =
    pathname === "/portal" ||
    pathname.startsWith("/portal/");

  const isWorkforce =
    pathname === "/workforce" ||
    pathname.startsWith("/workforce/");

  /*
   * Workforce is a completely separate application area.
   *
   * It must not inherit the public NexScope website chrome:
   * - public Navbar
   * - public Footer
   * - design/theme switcher
   * - floating WhatsApp button
   * - mobile project CTA
   * - cookie banner
   * - custom cursor
   * - public page transitions
   *
   * Workforce pages have their own navigation and UI.
   */
  if (isAdmin || isPortal || isWorkforce) {
    return <>{children}</>;
  }

  return (
    <>
      {/* Everything the "mood" filter (see globals.css html[data-mood=...])
          should visually affect lives inside this wrapper. Floating chrome
          (WhatsApp, the CTA bar, the switcher itself) stays outside it on
          purpose — a CSS filter composites its whole subtree into one
          layer, so there's no way for a descendant to opt back out of it;
          the only way to exclude the floating buttons is to keep them out
          of the filtered subtree entirely. Navbar/Footer now come from the
          active design (see src/designs/registry.ts) rather than being
          hardcoded — Signature's by default. Crossfade smooths the swap
          instead of hard-cutting between two completely different
          component trees. */}

      <div id="nx-page-surface">
        <Crossfade designSlug={designSlug}>
          <Design.Navbar />
        </Crossfade>

        <main className="min-h-screen">
          <PageTransition>
            {children}
          </PageTransition>
        </main>

        <Crossfade designSlug={designSlug}>
          <Design.Footer />
        </Crossfade>
      </div>

      <FloatingWhatsApp />

      <MobileProjectCta
        hidden={pathname === "/get-quote"}
      />

      <CookieConsentBanner />

      <CustomCursor />

      <ThemeSwitcher />
    </>
  );
}

export function SiteChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DesignProvider>
      <SiteChromeInner>
        {children}
      </SiteChromeInner>
    </DesignProvider>
  );
}
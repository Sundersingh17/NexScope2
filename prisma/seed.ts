/**
 * Seed script — loads the same placeholder content that's already baked
 * into the frontend as fallback data (services, packages, FAQs,
 * testimonials, portfolio, blog posts) directly into the database.
 *
 * Why this exists: every public page falls back to hardcoded content when
 * the database is empty, so a fresh deploy looks fine even with nothing
 * seeded. But that also means /admin starts completely empty, and adding
 * 8 services + 8 packages + 5 FAQs etc. by hand through the UI is a lot
 * of retyping. This script gives you a populated starting point instead —
 * edit or delete these through /admin once you have real content to
 * replace them with.
 *
 * Safe to re-run: every insert is an `upsert` keyed on a unique field
 * (slug/email/name), so running this twice updates existing rows instead
 * of creating duplicates.
 *
 * Usage:
 *   npx tsx prisma/seed.ts
 * or, once wired into package.json (see note at the bottom of this file):
 *   npx prisma db seed
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Matches ALLOWED_EMAIL in src/lib/admin-auth.ts, so the seeded blog posts
// are attributed to the same account that can actually manage them.
const AUTHOR_EMAIL = "ncompanyhq@gmail.com";
const AUTHOR_NAME = "NexScope Team";

async function seedAuthor() {
  return prisma.user.upsert({
    where: { email: AUTHOR_EMAIL },
    update: {},
    create: { email: AUTHOR_EMAIL, name: AUTHOR_NAME, role: "ADMIN" },
  });
}

async function seedCategories() {
  const names = ["AI & Automation", "Design", "Marketing"];
  const categories: Record<string, { id: string }> = {};
  for (const name of names) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    categories[name] = await prisma.category.upsert({
      where: { slug },
      update: {},
      create: { name, slug },
    });
  }
  return categories;
}

async function seedBlogPosts(authorId: string, categories: Record<string, { id: string }>) {
  const posts = [
    {
      slug: "ai-automation-guide-2026",
      title: "The Complete Guide to AI Automation in 2026",
      excerpt: "Discover how businesses are leveraging AI to automate workflows, reduce costs, and scale operations.",
      category: "AI & Automation",
      readingTime: 8,
      content: `<p>Artificial intelligence is no longer a futuristic concept — it's a practical tool that businesses of every size are using to transform their operations. In 2026, AI automation has become accessible, affordable, and essential for staying competitive.</p>
<h2>Why AI Automation Matters Now</h2>
<p>Companies leveraging AI automation report 30-50% reductions in operational costs, faster decision-making, and the ability to scale without proportional headcount increases.</p>
<h2>Key Areas to Automate</h2>
<p><strong>1. Customer Support:</strong> AI-powered chatbots handle up to 80% of routine inquiries, freeing your team for complex issues.</p>
<p><strong>2. Data Processing:</strong> Automate data entry, report generation, and document processing with machine learning models.</p>
<p><strong>3. Marketing:</strong> Personalize campaigns at scale with AI-driven content recommendations and audience segmentation.</p>
<p><strong>4. Workflow Automation:</strong> Connect your tools with intelligent automation to eliminate manual handoffs.</p>
<h2>Getting Started</h2>
<p>Start small. Identify one repetitive process in your business, map it out, and explore how AI can streamline it.</p>`,
    },
    {
      slug: "web-design-trends-2026",
      title: "Web Design Trends That Will Define 2026",
      excerpt: "From dark mode dominance to micro-interactions — the design trends shaping the web this year.",
      category: "Design",
      readingTime: 6,
      content: `<p>The web design landscape continues to evolve, and 2026 brings a fresh set of trends that prioritize user experience, performance, and visual sophistication.</p>
<h2>1. Dark Mode as Default</h2>
<p>More sites are launching with dark mode as the primary experience, reducing eye strain and creating a premium, modern feel.</p>
<h2>2. Micro-Interactions</h2>
<p>Subtle animations on hover, scroll, and click events create delightful experiences that keep users engaged.</p>
<h2>3. Minimalist Typography</h2>
<p>Bold, clean typography takes center stage. Variable fonts and generous spacing create hierarchy without clutter.</p>
<h2>4. Performance-First Design</h2>
<p>With Core Web Vitals being critical for SEO, designers are prioritizing lightweight assets, lazy loading, and optimized images.</p>`,
    },
    {
      slug: "seo-strategy-2026",
      title: "SEO Strategy for 2026: What's Changed",
      excerpt: "Google's latest updates and how to adapt your SEO strategy for better rankings.",
      category: "Marketing",
      readingTime: 7,
      content: `<p>Google's ranking algorithms continue to evolve, placing greater emphasis on user experience, content quality, and technical excellence.</p>
<h2>AI Overviews & Search Generative Experience</h2>
<p>Google's AI-powered search results mean your content needs to be structured, authoritative, and directly answer user questions.</p>
<h2>Core Web Vitals Are Non-Negotiable</h2>
<p>LCP under 2.5s, FID under 100ms, and CLS under 0.1 are baseline requirements for ranking well.</p>
<h2>E-E-A-T Matters More</h2>
<p>Experience, Expertise, Authoritativeness, and Trustworthiness — Google evaluates these factors rigorously, especially for YMYL topics.</p>
<h2>Content Strategy Shift</h2>
<p>Quality over quantity. A single comprehensive, well-researched article outperforms dozens of thin posts.</p>`,
    },
  ];

  for (const post of posts) {
    await prisma.blog.upsert({
      where: { slug: post.slug },
      update: {},
      create: {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        readingTime: post.readingTime,
        published: true,
        featured: false,
        authorId,
        categoryId: categories[post.category]?.id,
      },
    });
  }
}

async function seedServices() {
  const services = [
    {
      slug: "digital-foundations",
      title: "Digital Foundations",
      shortDesc: "Everything a brand needs to exist and function online.",
      description: "We engineer the full digital foundation — from fast, secure websites to cloud deployment and performance optimization. This is where your brand gets a reliable, scalable home on the internet.",
      benefits: ["Website Engineering", "Web App Development", "Lightning-Fast Landing Pages", "Secure Hosting & Cloud Deployment", "Website Maintenance & Upgrades", "Performance & Speed Optimization", "Security Hardening & Compliance Setup", "Conversion-Optimized UI Systems", "Multi-platform Responsiveness"],
      process: [{ title: "Audit", desc: "Analyze current infrastructure, performance, and security posture." }, { title: "Architect", desc: "Design scalable, secure, and fast digital architecture." }, { title: "Build", desc: "Develop using modern frameworks with CI/CD pipelines." }, { title: "Launch", desc: "Deploy with monitoring, security, and performance guarantees." }],
    },
    {
      slug: "brand-experience",
      title: "Brand & Experience Design",
      shortDesc: "Make the brand look intentional, premium, and consistent.",
      description: "We craft complete brand identities that communicate your values, differentiate you in the market, and resonate across every touchpoint. Premium design systems that scale.",
      benefits: ["Logo & Visual Identity Systems", "Brand Strategy & Positioning", "UX Architecture & Wireframing", "High-Fidelity UI Design", "Complete Brand Guidelines", "Creative Content Design Kits", "Rebranding & Modernization", "Design Systems for Scale (Reusable UI libraries)"],
      process: [{ title: "Research", desc: "Understand your market, audience, and competitive landscape." }, { title: "Ideation", desc: "Explore concepts through moodboards, sketches, and creative direction." }, { title: "Design", desc: "Refine chosen direction into a comprehensive visual system." }, { title: "Deliver", desc: "Provide complete brand assets, guidelines, and production files." }],
    },
    {
      slug: "growth-marketing",
      title: "Growth & Marketing Engine",
      shortDesc: "Not 'marketing services.' A predictable, measurable growth system.",
      description: "We build full-funnel growth engines — from technical SEO to paid media, content ecosystems to conversion optimization. Every channel measured, every dollar accounted for.",
      benefits: ["Advanced SEO (Technical + Content + Authority)", "Performance Marketing (Meta, Google, LinkedIn)", "Social Media Strategy & Management", "Content Ecosystem Buildout", "Lead-Gen Funnels & CRO", "Email Marketing & Drip Journeys", "Influencer & Creator Campaign Architecture", "Analytics Dashboards & Insights", "A/B Testing & Optimization Loops"],
      process: [{ title: "Audit", desc: "Analyze current performance, channels, and competition." }, { title: "Strategy", desc: "Develop a data-backed growth plan with clear KPIs." }, { title: "Execute", desc: "Implement campaigns, content, and optimization levers." }, { title: "Optimize", desc: "Continuously test, measure, and refine for better results." }],
    },
    {
      slug: "automation-systems",
      title: "Automation & Business Systems",
      shortDesc: "Replace manual effort with clean, efficient systems that run 24/7.",
      description: "We design and deploy automation systems that handle the heavy lifting — from CRM optimization to workflow automation, email sequences to custom integrations. Your business runs while you sleep.",
      benefits: ["CRM Setup & Optimization (HubSpot, Zoho, Salesforce)", "Sales & Lead Automation Systems", "Workflow Automation (Internal + Client-facing)", "Email Automation Flows", "Custom Integrations (CRM / CMS / Payments / APIs)", "Internal Tool Automation (Ops + Support + Sales)", "No-Code Systems Engineering (n8n, Zapier, Make)", "End-to-End Funnel Automation"],
      process: [{ title: "Map", desc: "Identify bottlenecks, manual tasks, and automation opportunities." }, { title: "Design", desc: "Architect automated workflows with the right tool stack." }, { title: "Build", desc: "Implement integrations, triggers, and fail-safes." }, { title: "Monitor", desc: "Optimize flows, track performance, and scale." }],
    },
    {
      slug: "ops-consulting",
      title: "Operations & Digital Consulting",
      shortDesc: "Fix the internal mess clients pretend they don't have.",
      description: "We audit, diagnose, and fix broken systems. From business process optimization to digital transformation roadmaps, we help you build operations that scale without chaos.",
      benefits: ["Business Process Optimization", "Digital Transformation Roadmaps", "System Audits (Tech + Ops + Marketing)", "Brand Positioning & Communication Strategy", "Scaling Blueprints & Hiring Structure", "Automation Feasibility Planning", "Full Funnel Audits & Performance Breakdown", "SOP Development & Documentation"],
      process: [{ title: "Audit", desc: "Deep dive into current operations, systems, and pain points." }, { title: "Diagnose", desc: "Identify root causes and prioritize quick wins vs long-term fixes." }, { title: "Plan", desc: "Deliver a clear roadmap with timelines and resource requirements." }, { title: "Execute", desc: "Implement changes with ongoing support and iteration." }],
    },
    {
      slug: "custom-product-builds",
      title: "Custom Product Builds",
      shortDesc: "For when the client needs something beyond usual agency scope.",
      description: "We engineer custom digital products — from SaaS MVPs to internal dashboards, data-driven applications to advanced API integrations. Strategy, architecture, and production in one package.",
      benefits: ["SaaS MVP Development", "Internal Dashboards & Admin Tools", "Custom Web Platforms", "Data-Driven Applications", "Advanced API Integrations", "Product Strategy + UX Architecture", "Prototype → Production Development", "Long-Term Tech Partnership & Support"],
      process: [{ title: "Strategy", desc: "Define product vision, user stories, and technical requirements." }, { title: "Design", desc: "Create wireframes, prototypes, and system architecture." }, { title: "Build", desc: "Develop iteratively with agile sprints and continuous delivery." }, { title: "Ship", desc: "Deploy, monitor, and iterate based on real usage data." }],
    },
    {
      slug: "next-gen-services",
      title: "Specialized 'Next-Gen' Services",
      shortDesc: "Extraordinary category. This is where you stand out.",
      description: "We build AI-powered systems that give your business a genuine competitive advantage — chatbots, automation workflows, predictive analytics, and intelligent tools that transform how you operate.",
      benefits: ["AI-Powered Chatbots & Assistants", "AI Automation Workflows (Internal + Customer-side)", "AI-Based Lead Qualification & Support Systems", "Data Visualization Dashboards", "Predictive Analytics Systems", "Automated Reporting Systems", "Custom AI Tools for Workflow Efficiency", "Intelligent Content & Campaign Generators"],
      process: [{ title: "Discover", desc: "Identify high-impact areas for AI integration in your workflows." }, { title: "Design", desc: "Architect AI solutions tailored to your data and infrastructure." }, { title: "Build", desc: "Develop, train, and integrate AI models into existing systems." }, { title: "Deploy", desc: "Roll out with monitoring, retraining pipelines, and optimization." }],
    },
    {
      slug: "done-for-you",
      title: "The 'Done-For-You' Scale Suite",
      shortDesc: "For brands that want end-to-end growth without micromanaging anything.",
      description: "Full digital ecosystem setup — brand, website, CRM, and campaigns in one unified system. Automated lead engines, monthly growth management, and dedicated ops support. You focus on the vision, we run the machine.",
      benefits: ["Full Digital Ecosystem Setup", "Brand + Website + CRM + Campaigns in One System", "Automated Lead Engine Deployment", "Monthly Growth Management", "Always-On Optimization Loops", "Quarterly Scale Strategy", "Dedicated Ops Support"],
      process: [{ title: "Onboard", desc: "Full discovery of your business, goals, and existing systems." }, { title: "Build", desc: "Set up the complete digital ecosystem in one seamless build." }, { title: "Launch", desc: "Go live with campaigns, automation, and monitoring active." }, { title: "Scale", desc: "Monthly optimization, quarterly strategy, always-on support." }],
    },
  ];

  for (const [index, s] of services.entries()) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: {},
      create: {
        slug: s.slug,
        title: s.title,
        shortDesc: s.shortDesc,
        description: s.description,
        benefits: JSON.stringify(s.benefits),
        process: JSON.stringify(s.process),
        order: index,
        published: true,
      },
    });
  }
}

async function seedPackages() {
  const packages = [
    { slug: "starter", title: "Starter Digital Launch Pack", icon: "Zap", color: "from-blue-500 to-cyan-500", signal: "Starting out? This is enough.", purpose: "Build your entire digital foundation from zero.", forWhom: "New founders, service providers, small teams.", outcome: "A stable, clean, trustworthy online presence.", items: ["Website (5–7 pages)", "Brand identity mini-kit", "One high-converting landing page", "Hosting + deployment", "Speed + security setup", "Basic CRM setup", "1 lead-capture → email automation", "Mobile responsiveness", "Basic analytics setup"] },
    { slug: "growth", title: "Growth Engine Pack", icon: "TrendingUp", color: "from-green-500 to-emerald-500", signal: "You have presence. Now you need traffic + leads.", purpose: "Build a predictable, measurable growth system.", forWhom: "Growing brands, coaches, agencies, D2C, consultants.", outcome: "Consistent lead flow and organized growth.", items: ["Everything in Starter", "SEO setup + monthly strategy", "Social media management (8–12 posts/month)", "Paid ads (Meta + Google)", "Lead-gen funnel", "Email drip journeys", "Content calendar", "Analytics dashboard", "Monthly optimization cycle"] },
    { slug: "scale-automation", title: "Scale Automation Pack", icon: "Cpu", color: "from-orange-500 to-amber-500", signal: "Your growth is fine, but operations are choking.", purpose: "Remove all manual work and fix broken processes.", forWhom: "Teams that want speed, not chaos.", outcome: "Business runs faster. Team works less. Errors tank.", items: ["Everything in Growth", "CRM full build + optimization", "Workflow automation (ops + sales + support)", "Email automation systems", "Internal tool automation (no-code)", "API integrations (CRM/CMS/payments)", "Automated reporting system", "AI assistants (support + lead qualification)"] },
    { slug: "brand-os", title: "Brand Operating System Pack", icon: "Palette", color: "from-purple-500 to-pink-500", signal: "You want a premium, consistent, personality-rich brand.", purpose: "Give your brand a visual + verbal identity that behaves like a system.", forWhom: "Premium brands, D2C, creators, agencies.", outcome: "Your brand finally looks intentional everywhere.", items: ["Complete visual identity", "Brand guidelines", "Messaging playbook", "UX/UI design system", "Positioning document", "Content template kit", "Tone + behavior rulebook", "Creative direction (3 months)"] },
    { slug: "influencer", title: "Influencer Growth Machine Pack", icon: "Users", color: "from-pink-500 to-rose-500", signal: "You're a creator. You need systems, not vibes.", purpose: "Turn creators into structured, scalable brands.", forWhom: "Influencers, creators, coaches, educators.", outcome: "Predictable content. Predictable revenue.", items: ["Brand kit for creators", "Content style system", "Monthly content calendar", "Short-form scripting framework", "Creator website + media kit", "Influencer analytics dashboard", "Collaboration outreach engine", "Funnels (course/DM/booking)", "Posting automation", "AI idea + reply assistant"] },
    { slug: "custom-build", title: "Custom Build Lab Pack", icon: "Box", color: "from-red-500 to-rose-500", signal: "Your idea doesn't fit anyone's template.", purpose: "Engineer custom digital products and internal tools.", forWhom: "Tech founders, enterprise teams, B2B companies.", outcome: "A working, launch-ready product — not a dream.", items: ["SaaS MVP development", "Custom dashboards", "Internal business tools", "Advanced API integrations", "Product strategy + UX architecture", "Prototype → production development", "Ops + support systems"] },
    { slug: "enterprise", title: "Enterprise Digital OS Pack", icon: "LayoutGrid", color: "from-indigo-500 to-violet-500", signal: "You want EVERYTHING in one unified system.", purpose: "Build the company's entire digital operating system.", forWhom: "Scaling brands, SMEs, high-growth companies.", outcome: "The whole business runs like one coordinated machine.", items: ["Everything from Starter + Growth + Scale + Brand OS", "Predictive analytics", "AI employee suite (content + support + sales)", "Ops-in-a-Box (SOPs, hiring templates)", "Dedicated ops manager", "Crisis-response architecture", "Founder cockpit dashboard (KPIs, bottlenecks, recommendations)", "Quarterly scale blueprint", "Data normalization layer"] },
    { slug: "build-your-own", title: "Build-Your-Own System Pack", icon: "Sliders", color: "from-teal-500 to-cyan-500", signal: "You want total freedom.", purpose: "Mix & match modules, we assemble the system.", forWhom: "Anyone who wants a custom-engineered build without confusion.", outcome: "Your own custom system tailored exactly to your needs.", items: ["Choose modules from any service pillar", "Choose Depth: Light / Standard / Advanced", "Set your timeline & budget band", "Select automation count & design complexity", "Pick funnel count & platform choices", "System auto-creates price range & scope", "Detailed timeline estimate", "Proposal PDF delivered"] },
  ];

  for (const [index, p] of packages.entries()) {
    await prisma.package.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        slug: p.slug,
        title: p.title,
        icon: p.icon,
        color: p.color,
        signal: p.signal,
        purpose: p.purpose,
        forWhom: p.forWhom,
        outcome: p.outcome,
        items: JSON.stringify(p.items),
        order: index,
        published: true,
      },
    });
  }
}

async function seedTestimonials() {
  const testimonials = [
    { name: "Ananya Mehta", company: "Aurelia Skin Studio", role: "Founder & Director", content: "NexScope gave our brand a much more premium online presence. The website is clean, easy to navigate, and the appointment flow has made it much easier for customers to enquire and book. The WhatsApp integration was especially useful for quick communication.", rating: 5, featured: true, isSample: false },
    { name: "Arjun Malhotra", company: "NorthPeak Fitness", role: "Founder", content: "The team understood our requirements and built a system that actually fits our day-to-day operations. Managing leads, memberships and follow-ups is much easier now, and we have reduced a lot of repetitive administrative work.", rating: 5, featured: true, isSample: false },
    { name: "Priya Shah", company: "UrbanNest Interiors", role: "Creative Director", content: "NexScope helped us present our interior projects in a much more professional way. The portfolio structure looks premium and the enquiry experience is much smoother. We now have a website that feels aligned with the quality of our work.", rating: 5, featured: true, isSample: false },
    { name: "Kavya Nair", company: "Velora Fashion", role: "Founder", content: "The website gave us a proper online shopping experience instead of just displaying products. Customers can browse easily, place orders and receive updates. The overall buying journey feels much more organized and professional.", rating: 5, featured: true, isSample: false },
    { name: "Aditya Rao", company: "Brew & Bean Roasters", role: "Co-Founder", content: "NexScope helped us build a digital presence that is actually useful for our customers. The online menu and ordering flow are simple, and the feedback setup gives us a better understanding of customer experience.", rating: 5, featured: true, isSample: false },
    { name: "Rahul Kapoor", company: "PrimeLedger Consultants", role: "Managing Partner", content: "The biggest improvement was that our website stopped being just an information page and became part of our lead-generation process. The CRM and automation setup gives our team much better visibility over prospects and follow-ups.", rating: 5, featured: true, isSample: false },
    { name: "Dr. Isha Verma", company: "Medora Wellness", role: "Founder", content: "The new website is much easier for our visitors to understand and navigate. We can also update content more easily, and the WhatsApp enquiry flow has made it simpler for people to connect with us directly.", rating: 5, featured: true, isSample: false },
    { name: "Rohan Prabhulkar", company: "Shweroh Cafe", role: "Owner", content: "Working with NexScope has been an awesome experience. The team delivered quality work on time and was very supportive throughout the project. The website, custom POS system, and management tools helped streamline our operations. Their support also helped during the launch of our new franchise, making daily operations easier and saving significant time.", rating: 5, featured: true, isSample: false },
  ];

  await prisma.testimonial.deleteMany({
    where: { name: { in: ["Rahul Sharma", "Priya Patel", "Arjun Mehta"] } },
  });

  for (const t of testimonials) {
    const existing = await prisma.testimonial.findFirst({ where: { name: t.name, company: t.company } });
    if (existing) {
      await prisma.testimonial.update({ where: { id: existing.id }, data: t });
    } else {
      await prisma.testimonial.create({ data: t });
    }
  }
}

async function seedPortfolio() {
  const items = [
    { slug: "aurelia-skin-studio", title: "Aurelia Skin Studio", client: "Ananya Mehta", url: "https://aureliaskinstudio.in", category: "Website & Local Growth", description: "Premium skin studio website with appointment enquiries, service catalogue, WhatsApp integration, local SEO setup, and social creative support.", testimonial: "NexScope gave our brand a much more premium online presence. The website is clean, easy to navigate, and the appointment flow has made it much easier for customers to enquire and book.", isSample: true },
    { slug: "northpeak-fitness", title: "NorthPeak Fitness", client: "Arjun Malhotra", url: "https://northpeakfitness.in", category: "Fitness Management System", description: "Fitness business platform combining membership management, lead capture, payments, WhatsApp automation, and a performance dashboard.", testimonial: "Managing leads, memberships and follow-ups is much easier now, and we have reduced a lot of repetitive administrative work.", isSample: true },
    { slug: "urbannest-interiors", title: "UrbanNest Interiors", client: "Priya Shah", url: "https://urbannestinteriors.com", category: "Portfolio Website", description: "Corporate interiors website with premium project showcase, lead generation, SEO optimization, and content management.", testimonial: "The portfolio structure looks premium and the enquiry experience is much smoother.", isSample: true },
    { slug: "velora-fashion", title: "Velora Fashion", client: "Kavya Nair", url: "https://velorafashion.in", category: "E-Commerce", description: "Fashion storefront with product catalogue, payment gateway, order management, WhatsApp order updates, and social integration.", testimonial: "Customers can browse easily, place orders and receive updates. The overall buying journey feels much more organized and professional.", isSample: true },
    { slug: "brew-and-bean-roasters", title: "Brew & Bean Roasters", client: "Aditya Rao", url: "https://brewandbean.in", category: "Cafe & Ordering", description: "Cafe digital presence with online ordering, menu management, QR menu, customer feedback, and Google Business optimization.", testimonial: "The online menu and ordering flow are simple, and the feedback setup gives us a better understanding of customer experience.", isSample: true },
    { slug: "primeledger-consultants", title: "PrimeLedger Consultants", client: "Rahul Kapoor", url: "https://primeledgerconsultants.com", category: "Lead Generation & CRM", description: "Consulting growth system with business website, lead-generation funnel, CRM, email automation, appointment booking, and analytics dashboard.", testimonial: "Our website stopped being just an information page and became part of our lead-generation process.", isSample: true },
    { slug: "medora-wellness", title: "Medora Wellness", client: "Dr. Isha Verma", url: "https://medorawellness.in", category: "Wellness Website", description: "Wellness website with service booking, content management, WhatsApp enquiry automation, SEO setup, and brand content.", testimonial: "The new website is much easier for our visitors to understand and navigate, and the WhatsApp enquiry flow has made it simpler for people to connect with us.", isSample: true },
    { slug: "shweroh-cafe", title: "Shweroh Cafe", client: "Rohan Prabhulkar", url: "https://shweroh.com", category: "Cafe Operations System", description: "Cafe growth and operations project covering website development, custom POS, complete management system, professional shoot, video editing, and social media management.", testimonial: "The website, custom POS system, and management tools helped streamline our operations. Their support also helped during the launch of our new franchise.", isSample: false },
  ];

  await prisma.portfolio.deleteMany({
    where: { slug: { in: ["business-website", "ecommerce-store", "ai-automation-system", "brand-identity-project"] } },
  });

  for (const [index, p] of items.entries()) {
    await prisma.portfolio.upsert({
      where: { slug: p.slug },
      update: {
        title: p.title,
        description: p.description,
        category: p.category,
        client: p.client,
        url: p.url,
        testimonial: p.testimonial,
        isSample: p.isSample,
        published: true,
        featured: index === 7,
      },
      create: {
        slug: p.slug,
        title: p.title,
        description: p.description,
        category: p.category,
        client: p.client,
        url: p.url,
        testimonial: p.testimonial,
        isSample: p.isSample,
        published: true,
        featured: index === 7,
      },
    });
  }
}

async function seedFAQs() {
  const faqs = [
    { question: "What services does NexScope offer?", answer: "We offer AI & Automation, Web & App Development, Branding & Design, and Marketing & Growth services. Each solution is tailored to your business needs." },
    { question: "How long does a typical project take?", answer: "Timelines vary based on scope. A typical website takes 4-6 weeks, while larger projects like AI automation systems can take 8-12 weeks. We provide clear timelines during our discovery call." },
    { question: "Do you work with startups or only established businesses?", answer: "We work with businesses of all sizes — from early-stage startups to established enterprises. Our solutions are scalable and adapt to your budget and growth stage." },
    { question: "What is your pricing model?", answer: "We offer project-based pricing with transparent quotes. After understanding your requirements, we provide a detailed proposal with fixed costs and clear deliverables." },
    { question: "Do you provide post-launch support?", answer: "Yes, we offer ongoing maintenance, support, and growth services. Our 24/7 support ensures your digital assets remain secure, updated, and performing optimally." },
  ];

  for (const [index, f] of faqs.entries()) {
    const existing = await prisma.fAQ.findFirst({ where: { question: f.question } });
    if (existing) {
      await prisma.fAQ.update({ where: { id: existing.id }, data: { ...f, order: index } });
    } else {
      await prisma.fAQ.create({ data: { ...f, order: index, published: true } });
    }
  }
}

async function seedThemePresets() {
  const presets = [
    { slug: "signature", name: "Signature", isDefault: true, fontPair: "grotesk-archivo", design: "signature", mood: "none", colors: { cream: "#FBF7EE", paper: "#F3EDE2", ink: "#141414", "ink-soft": "#2A2622", orange: "#FF4D00", yellow: "#FFC72E", gray: "#6B6B62" } },
    { slug: "violet-pop", name: "Violet Pop (Sharp + Vivid)", isDefault: false, fontPair: "syne-manrope", design: "sharp", mood: "vivid", colors: { cream: "#F7F5FB", paper: "#EDE9F5", ink: "#191420", "ink-soft": "#2B2438", orange: "#7C3AED", yellow: "#C4B5FD", gray: "#6E6580" } },
    { slug: "teal-tide", name: "Teal Tide (Soft)", isDefault: false, fontPair: "fraunces-inter", design: "soft", mood: "none", colors: { cream: "#F2FAF7", paper: "#E4F3EC", ink: "#0F211C", "ink-soft": "#1D3830", orange: "#0EA37A", yellow: "#7EE8C6", gray: "#5E7A70" } },
    { slug: "sunset-blush", name: "Sunset Blush (Sharp + Noir)", isDefault: false, fontPair: "fraunces-inter", design: "sharp", mood: "noir", colors: { cream: "#FEF6F3", paper: "#FBE7E0", ink: "#2A1512", "ink-soft": "#432420", orange: "#E8467A", yellow: "#FFB37B", gray: "#8A6A63" } },
    { slug: "midnight-pill", name: "Midnight Pill (Soft + Vivid)", isDefault: false, fontPair: "syne-manrope", design: "soft", mood: "vivid", colors: { cream: "#F4F6FB", paper: "#E6EAF5", ink: "#0B1220", "ink-soft": "#1B2436", orange: "#4E8CF5", yellow: "#7EE8C6", gray: "#5F6B85" } },
    { slug: "shadow-mode", name: "Shadow Mode (Noir)", isDefault: false, fontPair: "grotesk-archivo", design: "sharp", mood: "noir", colors: { cream: "#EDEDED", paper: "#DCDCDC", ink: "#0A0A0A", "ink-soft": "#2A2A2A", orange: "#8A8A8A", yellow: "#C9C9C9", gray: "#5A5A5A" } },
  ];

  for (const [index, p] of presets.entries()) {
    await prisma.themePreset.upsert({
      where: { slug: p.slug },
      update: { name: p.name, colors: JSON.stringify(p.colors), fontPair: p.fontPair, design: p.design, mood: p.mood, isDefault: p.isDefault, order: index, published: true },
      create: { slug: p.slug, name: p.name, colors: JSON.stringify(p.colors), fontPair: p.fontPair, design: p.design, mood: p.mood, isDefault: p.isDefault, order: index, published: true },
    });
  }
}

async function main() {
  console.log("Seeding database...");

  const author = await seedAuthor();
  console.log("✓ Author user ready");

  const categories = await seedCategories();
  console.log("✓ Blog categories ready");

  await seedBlogPosts(author.id, categories);
  console.log("✓ 3 blog posts seeded");

  await seedServices();
  console.log("✓ 8 services seeded");

  await seedPackages();
  console.log("✓ 8 packages seeded");

  await seedTestimonials();
  console.log("✓ 8 testimonials seeded");

  await seedPortfolio();
  console.log("✓ 8 portfolio items seeded");

  await seedFAQs();
  console.log("✓ 5 FAQs seeded");

  await seedThemePresets();
  console.log("✓ 6 theme+design+mood presets seeded (Signature is default)");

  console.log("\nDone. Everything is marked published/featured where relevant, so it");
  console.log("should appear on the live site immediately. Edit or delete any of it");
  console.log("through /admin whenever you have real content to replace it with.");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

/**
 * package.json already has this wired up:
 *   "prisma": { "seed": "tsx prisma/seed.ts" }
 * and "tsx" is in devDependencies — so after `npm install`, just run:
 *   npx prisma db seed
 */

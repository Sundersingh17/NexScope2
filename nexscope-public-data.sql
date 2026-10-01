SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict ukamLPOdEZuobL7kqNz8lgCSG2aIi2EUnpQEx7CNl0dQAbLy5sh8fXYCgMwhfOg

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: Category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."Category" ("id", "name", "slug", "description") FROM stdin;
cmtyfzb9i0001aw1lxf1pv12h	AI & Automation	ai-automation	\N
cmtyfzbbd0002aw1lukp71ke4	Design	design	\N
cmtyfzbd90003aw1l0ws1hxzv	Marketing	marketing	\N
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."User" ("id", "email", "name", "role", "image", "createdAt", "updatedAt") FROM stdin;
cmtyfzb720000aw1lmnx7x50t	ncompanyhq@gmail.com	NexScope Team	ADMIN	\N	2026-09-12 13:49:49.546	2026-09-12 13:49:49.546
\.


--
-- Data for Name: Blog; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."Blog" ("id", "title", "slug", "excerpt", "content", "coverImage", "readingTime", "published", "featured", "createdAt", "updatedAt", "authorId", "categoryId", "seoTitle", "seoDesc") FROM stdin;
cmtyfzbfg0005aw1l87f6wmbr	The Complete Guide to AI Automation in 2026	ai-automation-guide-2026	Discover how businesses are leveraging AI to automate workflows, reduce costs, and scale operations.	<p>Artificial intelligence is no longer a futuristic concept — it's a practical tool that businesses of every size are using to transform their operations. In 2026, AI automation has become accessible, affordable, and essential for staying competitive.</p>\n<h2>Why AI Automation Matters Now</h2>\n<p>Companies leveraging AI automation report 30-50% reductions in operational costs, faster decision-making, and the ability to scale without proportional headcount increases.</p>\n<h2>Key Areas to Automate</h2>\n<p><strong>1. Customer Support:</strong> AI-powered chatbots handle up to 80% of routine inquiries, freeing your team for complex issues.</p>\n<p><strong>2. Data Processing:</strong> Automate data entry, report generation, and document processing with machine learning models.</p>\n<p><strong>3. Marketing:</strong> Personalize campaigns at scale with AI-driven content recommendations and audience segmentation.</p>\n<p><strong>4. Workflow Automation:</strong> Connect your tools with intelligent automation to eliminate manual handoffs.</p>\n<h2>Getting Started</h2>\n<p>Start small. Identify one repetitive process in your business, map it out, and explore how AI can streamline it.</p>	\N	8	t	f	2026-09-12 13:49:49.852	2026-09-12 13:49:49.852	cmtyfzb720000aw1lmnx7x50t	cmtyfzb9i0001aw1lxf1pv12h	\N	\N
cmtyfzbhd0007aw1laud13cd1	Web Design Trends That Will Define 2026	web-design-trends-2026	From dark mode dominance to micro-interactions — the design trends shaping the web this year.	<p>The web design landscape continues to evolve, and 2026 brings a fresh set of trends that prioritize user experience, performance, and visual sophistication.</p>\n<h2>1. Dark Mode as Default</h2>\n<p>More sites are launching with dark mode as the primary experience, reducing eye strain and creating a premium, modern feel.</p>\n<h2>2. Micro-Interactions</h2>\n<p>Subtle animations on hover, scroll, and click events create delightful experiences that keep users engaged.</p>\n<h2>3. Minimalist Typography</h2>\n<p>Bold, clean typography takes center stage. Variable fonts and generous spacing create hierarchy without clutter.</p>\n<h2>4. Performance-First Design</h2>\n<p>With Core Web Vitals being critical for SEO, designers are prioritizing lightweight assets, lazy loading, and optimized images.</p>	\N	6	t	f	2026-09-12 13:49:49.921	2026-09-12 13:49:49.921	cmtyfzb720000aw1lmnx7x50t	cmtyfzbbd0002aw1lukp71ke4	\N	\N
cmtyfzbjc0009aw1lrgvg49mr	SEO Strategy for 2026: What's Changed	seo-strategy-2026	Google's latest updates and how to adapt your SEO strategy for better rankings.	<p>Google's ranking algorithms continue to evolve, placing greater emphasis on user experience, content quality, and technical excellence.</p>\n<h2>AI Overviews & Search Generative Experience</h2>\n<p>Google's AI-powered search results mean your content needs to be structured, authoritative, and directly answer user questions.</p>\n<h2>Core Web Vitals Are Non-Negotiable</h2>\n<p>LCP under 2.5s, FID under 100ms, and CLS under 0.1 are baseline requirements for ranking well.</p>\n<h2>E-E-A-T Matters More</h2>\n<p>Experience, Expertise, Authoritativeness, and Trustworthiness — Google evaluates these factors rigorously, especially for YMYL topics.</p>\n<h2>Content Strategy Shift</h2>\n<p>Quality over quantity. A single comprehensive, well-researched article outperforms dozens of thin posts.</p>	\N	7	t	f	2026-09-12 13:49:49.992	2026-09-12 13:49:49.992	cmtyfzb720000aw1lmnx7x50t	cmtyfzbd90003aw1l0ws1hxzv	\N	\N
\.


--
-- Data for Name: Client; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."Client" ("id", "email", "passwordHash", "name", "company", "phone", "status", "source", "resetToken", "resetTokenExpiry", "createdAt", "updatedAt") FROM stdin;
cmtyg7ypz0000uk1otjhghw4s	sundersingh200612@gmail.com	$2a$10$AWpeDxxepavzdVkgmtaF3e8OWUBVwu5s5lmYgS3gpEDfXsaWV/KnC	sunder	The Property Expert 	\N	active	signup	\N	\N	2026-09-12 13:56:33.283	2026-09-12 13:56:33.283
cmub5xsiy000014diryhmgsti	niranjanepili@hotmail.com	$2a$10$D4kYZqu.TzzXoMxVX4tI7e1u9Ueh2.Wou2yvlHD8OxPuRPXNrI9U.	niranjan epili	\N	\N	active	signup	\N	\N	2026-09-21 11:29:42.826	2026-09-21 11:29:42.826
cmuhyft2h00008fvu0ftxw4vx	sundersingh200613@gmail.com	$2a$10$ypVJMmWrx4/uVZuuzgp.kukrd4Tzz6GcsIIR2jbYedI5WmsxuWNsi	sunder singh	\N	\N	active	signup	\N	\N	2026-09-26 05:34:09.641	2026-09-26 05:34:09.641
\.


--
-- Data for Name: FAQ; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."FAQ" ("id", "question", "answer", "category", "order", "published", "createdAt") FROM stdin;
cmtyfzdhg0017aw1l5u188r31	How long does a typical project take?	Timelines vary based on scope. A typical website takes 4-6 weeks, while larger projects like AI automation systems can take 8-12 weeks. We provide clear timelines during our discovery call.	\N	1	t	2026-09-12 13:49:52.517
cmtyfzdjq0018aw1lpjx93b1l	Do you work with startups or only established businesses?	We work with businesses of all sizes — from early-stage startups to established enterprises. Our solutions are scalable and adapt to your budget and growth stage.	\N	2	t	2026-09-12 13:49:52.598
cmtyfzdn80019aw1l0ntan5pz	What is your pricing model?	We offer project-based pricing with transparent quotes. After understanding your requirements, we provide a detailed proposal with fixed costs and clear deliverables.	\N	3	t	2026-09-12 13:49:52.724
cmtyfzdpq001aaw1lcu1wmuvs	Do you provide post-launch support?	Yes, we offer ongoing maintenance, support, and growth services. Our 24/7 support ensures your digital assets remain secure, updated, and performing optimally.	\N	4	t	2026-09-12 13:49:52.815
cmtyfzdf00016aw1llo6jd1ns	What services does NexScope offer?	We offer AI & Automation, Web & App Development, Branding & Design, and Marketing & Growth services. Each solution is tailored to your business needs.	\N	0	t	2026-09-12 13:49:52.424
\.


--
-- Data for Name: Project; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."Project" ("id", "clientId", "name", "description", "status", "startDate", "dueDate", "createdAt", "updatedAt") FROM stdin;
cmtygbdhi0002uk1oxat1fx4n	cmtyg7ypz0000uk1otjhghw4s	The Property Expert 	Compherensive Real Estate Website Designed to showcase rental rooms or to sell room 	onboarding	2026-09-12 00:00:00	2026-12-12 00:00:00	2026-09-12 13:59:12.371	2026-09-12 13:59:12.371
\.


--
-- Data for Name: Invoice; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."Invoice" ("id", "projectId", "clientId", "invoiceNumber", "amount", "currency", "status", "description", "dueDate", "razorpayOrderId", "razorpayPaymentId", "paidAt", "createdAt") FROM stdin;
\.


--
-- Data for Name: Lead; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."Lead" ("id", "name", "email", "phone", "company", "service", "budget", "message", "source", "status", "score", "temperature", "createdAt") FROM stdin;
cmuhgrtr50000x7iv19x3upaq	sunder singh	sundersingh200612@gmail.com	91367055597	demo company 	Web & App Development	₹1,00,000 – ₹5,00,000	want to build an site for my business \n	quote_form	new	58	warm	2026-09-25 21:19:37.314
cmuhgtw8f0001x7ivytmigo0v	sunder	ss7077264@gmail.com	91367055597	demo company 	Web & App Development	₹1,00,000 – ₹5,00,000	want to build site for my business\n	quote_form	new	58	warm	2026-09-25 21:21:13.607
cmuhx950j0000r7stlro7xsiy	sunder	ss7077264@gmail.com	91367055597	demo  company	Web & App Development	₹1,00,000 – ₹5,00,000	i want to build a site for my business	quote_form	new	58	warm	2026-09-26 05:00:57.73
\.


--
-- Data for Name: Package; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."Package" ("id", "slug", "title", "icon", "color", "signal", "purpose", "forWhom", "outcome", "items", "order", "published", "createdAt", "updatedAt") FROM stdin;
cmtyfzc1p000iaw1l8i86s9wh	starter	Starter Digital Launch Pack	Zap	from-blue-500 to-cyan-500	Starting out? This is enough.	Build your entire digital foundation from zero.	New founders, service providers, small teams.	A stable, clean, trustworthy online presence.	["Website (5–7 pages)","Brand identity mini-kit","One high-converting landing page","Hosting + deployment","Speed + security setup","Basic CRM setup","1 lead-capture → email automation","Mobile responsiveness","Basic analytics setup"]	0	t	2026-09-12 13:49:50.653	2026-09-12 13:49:50.653
cmtyfzc3u000jaw1lxcgpaaja	growth	Growth Engine Pack	TrendingUp	from-green-500 to-emerald-500	You have presence. Now you need traffic + leads.	Build a predictable, measurable growth system.	Growing brands, coaches, agencies, D2C, consultants.	Consistent lead flow and organized growth.	["Everything in Starter","SEO setup + monthly strategy","Social media management (8–12 posts/month)","Paid ads (Meta + Google)","Lead-gen funnel","Email drip journeys","Content calendar","Analytics dashboard","Monthly optimization cycle"]	1	t	2026-09-12 13:49:50.73	2026-09-12 13:49:50.73
cmtyfzc5t000kaw1l7bunsoki	scale-automation	Scale Automation Pack	Cpu	from-orange-500 to-amber-500	Your growth is fine, but operations are choking.	Remove all manual work and fix broken processes.	Teams that want speed, not chaos.	Business runs faster. Team works less. Errors tank.	["Everything in Growth","CRM full build + optimization","Workflow automation (ops + sales + support)","Email automation systems","Internal tool automation (no-code)","API integrations (CRM/CMS/payments)","Automated reporting system","AI assistants (support + lead qualification)"]	2	t	2026-09-12 13:49:50.801	2026-09-12 13:49:50.801
cmtyfzc7t000law1lqvzyci4d	brand-os	Brand Operating System Pack	Palette	from-purple-500 to-pink-500	You want a premium, consistent, personality-rich brand.	Give your brand a visual + verbal identity that behaves like a system.	Premium brands, D2C, creators, agencies.	Your brand finally looks intentional everywhere.	["Complete visual identity","Brand guidelines","Messaging playbook","UX/UI design system","Positioning document","Content template kit","Tone + behavior rulebook","Creative direction (3 months)"]	3	t	2026-09-12 13:49:50.873	2026-09-12 13:49:50.873
cmtyfzc9u000maw1l3gasw7az	influencer	Influencer Growth Machine Pack	Users	from-pink-500 to-rose-500	You're a creator. You need systems, not vibes.	Turn creators into structured, scalable brands.	Influencers, creators, coaches, educators.	Predictable content. Predictable revenue.	["Brand kit for creators","Content style system","Monthly content calendar","Short-form scripting framework","Creator website + media kit","Influencer analytics dashboard","Collaboration outreach engine","Funnels (course/DM/booking)","Posting automation","AI idea + reply assistant"]	4	t	2026-09-12 13:49:50.947	2026-09-12 13:49:50.947
cmtyfzccy000naw1lkxlwh4yn	custom-build	Custom Build Lab Pack	Box	from-red-500 to-rose-500	Your idea doesn't fit anyone's template.	Engineer custom digital products and internal tools.	Tech founders, enterprise teams, B2B companies.	A working, launch-ready product — not a dream.	["SaaS MVP development","Custom dashboards","Internal business tools","Advanced API integrations","Product strategy + UX architecture","Prototype → production development","Ops + support systems"]	5	t	2026-09-12 13:49:51.058	2026-09-12 13:49:51.058
cmtyfzcew000oaw1lt2zm34ie	enterprise	Enterprise Digital OS Pack	LayoutGrid	from-indigo-500 to-violet-500	You want EVERYTHING in one unified system.	Build the company's entire digital operating system.	Scaling brands, SMEs, high-growth companies.	The whole business runs like one coordinated machine.	["Everything from Starter + Growth + Scale + Brand OS","Predictive analytics","AI employee suite (content + support + sales)","Ops-in-a-Box (SOPs, hiring templates)","Dedicated ops manager","Crisis-response architecture","Founder cockpit dashboard (KPIs, bottlenecks, recommendations)","Quarterly scale blueprint","Data normalization layer"]	6	t	2026-09-12 13:49:51.128	2026-09-12 13:49:51.128
cmtyfzcgy000paw1lh2m2fmlg	build-your-own	Build-Your-Own System Pack	Sliders	from-teal-500 to-cyan-500	You want total freedom.	Mix & match modules, we assemble the system.	Anyone who wants a custom-engineered build without confusion.	Your own custom system tailored exactly to your needs.	["Choose modules from any service pillar","Choose Depth: Light / Standard / Advanced","Set your timeline & budget band","Select automation count & design complexity","Pick funnel count & platform choices","System auto-creates price range & scope","Detailed timeline estimate","Proposal PDF delivered"]	7	t	2026-09-12 13:49:51.202	2026-09-12 13:49:51.202
\.


--
-- Data for Name: Portfolio; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."Portfolio" ("id", "title", "slug", "category", "description", "images", "videoUrl", "client", "url", "testimonial", "challenge", "solution", "results", "process", "isSample", "published", "featured", "seoTitle", "seoDesc", "createdAt", "updatedAt") FROM stdin;
cmtyfzd38000yaw1li5iuzaeu	Aurelia Skin Studio	aurelia-skin-studio	Website & Local Growth	Premium skin studio website with appointment enquiries, service catalogue, WhatsApp integration, local SEO setup, and social creative support.	\N	\N	Ananya Mehta	https://aureliaskinstudio.in	NexScope gave our brand a much more premium online presence. The website is clean, easy to navigate, and the appointment flow has made it much easier for customers to enquire and book.	\N	\N	\N	\N	t	t	f	\N	\N	2026-09-12 13:49:52.004	2026-09-14 18:17:17.749
cmtyfzd4u000zaw1lr53sszdz	NorthPeak Fitness	northpeak-fitness	Fitness Management System	Fitness business platform combining membership management, lead capture, payments, WhatsApp automation, and a performance dashboard.	\N	\N	Arjun Malhotra	https://northpeakfitness.in	Managing leads, memberships and follow-ups is much easier now, and we have reduced a lot of repetitive administrative work.	\N	\N	\N	\N	t	t	f	\N	\N	2026-09-12 13:49:52.062	2026-09-14 18:17:17.794
cmtyfzd640010aw1lhzl4gtv8	UrbanNest Interiors	urbannest-interiors	Portfolio Website	Corporate interiors website with premium project showcase, lead generation, SEO optimization, and content management.	\N	\N	Priya Shah	https://urbannestinteriors.com	The portfolio structure looks premium and the enquiry experience is much smoother.	\N	\N	\N	\N	t	t	f	\N	\N	2026-09-12 13:49:52.109	2026-09-14 18:17:17.835
cmtyfzd7b0011aw1lgh57qwm1	Velora Fashion	velora-fashion	E-Commerce	Fashion storefront with product catalogue, payment gateway, order management, WhatsApp order updates, and social integration.	\N	\N	Kavya Nair	https://velorafashion.in	Customers can browse easily, place orders and receive updates. The overall buying journey feels much more organized and professional.	\N	\N	\N	\N	t	t	f	\N	\N	2026-09-12 13:49:52.151	2026-09-14 18:17:17.88
cmtyfzd8f0012aw1lsrz9ri0t	Brew & Bean Roasters	brew-and-bean-roasters	Cafe & Ordering	Cafe digital presence with online ordering, menu management, QR menu, customer feedback, and Google Business optimization.	\N	\N	Aditya Rao	https://brewandbean.in	The online menu and ordering flow are simple, and the feedback setup gives us a better understanding of customer experience.	\N	\N	\N	\N	t	t	f	\N	\N	2026-09-12 13:49:52.192	2026-09-14 18:17:17.922
cmtyfzd9l0013aw1lampaxavd	PrimeLedger Consultants	primeledger-consultants	Lead Generation & CRM	Consulting growth system with business website, lead-generation funnel, CRM, email automation, appointment booking, and analytics dashboard.	\N	\N	Rahul Kapoor	https://primeledgerconsultants.com	Our website stopped being just an information page and became part of our lead-generation process.	\N	\N	\N	\N	t	t	f	\N	\N	2026-09-12 13:49:52.234	2026-09-14 18:17:17.964
cmtyfzdav0014aw1l5gm62eoj	Medora Wellness	medora-wellness	Wellness Website	Wellness website with service booking, content management, WhatsApp enquiry automation, SEO setup, and brand content.	\N	\N	Dr. Isha Verma	https://medorawellness.in	The new website is much easier for our visitors to understand and navigate, and the WhatsApp enquiry flow has made it simpler for people to connect with us.	\N	\N	\N	\N	t	t	f	\N	\N	2026-09-12 13:49:52.279	2026-09-14 18:17:18.002
cmtyfzdc30015aw1lo6yvr6ly	Shweroh Cafe	shweroh-cafe	Cafe Operations System	Cafe growth and operations project covering website development, custom POS, complete management system, professional shoot, video editing, and social media management.	https://shweroh.com/assets/hero-burger-DfpYmyNE.jpg	\N	Rohan Prabhulkar	https://shweroh.com	\N	\N	\N	\N	\N	f	t	t	\N	\N	2026-09-12 13:49:52.323	2026-09-20 14:12:18.949
\.


--
-- Data for Name: ProjectFile; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."ProjectFile" ("id", "projectId", "name", "url", "size", "uploadedBy", "createdAt") FROM stdin;
\.


--
-- Data for Name: ProjectUpdate; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."ProjectUpdate" ("id", "projectId", "title", "description", "videoUrl", "marketContext", "nextAction", "clientPrompt", "clientResponse", "respondedAt", "createdAt") FROM stdin;
cmtygdttx0004uk1oyec297ny	cmtygbdhi0002uk1oxat1fx4n	Design Selection is completed	\N	\N	Ui/Ux Design Selection is Completed	Next will start working on user interaction improvement 	\N	\N	\N	2026-09-12 14:01:06.884
cmuhyjjbm00028fvuvtm42g5d	cmtygbdhi0002uk1oxat1fx4n	,jwhvduv	kjyfiuygbiuuee	\N	fefefb	\N	emjevhflv	\N	\N	2026-09-26 05:37:03.427
\.


--
-- Data for Name: Service; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."Service" ("id", "title", "slug", "shortDesc", "description", "icon", "coverImage", "benefits", "process", "pricing", "faq", "order", "published", "seoTitle", "seoDesc", "createdAt", "updatedAt") FROM stdin;
cmtyfzblc000aaw1l1w0l8b2z	Digital Foundations	digital-foundations	Everything a brand needs to exist and function online.	We engineer the full digital foundation — from fast, secure websites to cloud deployment and performance optimization. This is where your brand gets a reliable, scalable home on the internet.	\N	\N	["Website Engineering","Web App Development","Lightning-Fast Landing Pages","Secure Hosting & Cloud Deployment","Website Maintenance & Upgrades","Performance & Speed Optimization","Security Hardening & Compliance Setup","Conversion-Optimized UI Systems","Multi-platform Responsiveness"]	[{"title":"Audit","desc":"Analyze current infrastructure, performance, and security posture."},{"title":"Architect","desc":"Design scalable, secure, and fast digital architecture."},{"title":"Build","desc":"Develop using modern frameworks with CI/CD pipelines."},{"title":"Launch","desc":"Deploy with monitoring, security, and performance guarantees."}]	\N	\N	0	t	\N	\N	2026-09-12 13:49:50.064	2026-09-12 13:49:50.064
cmtyfzbnd000baw1lz1vq592y	Brand & Experience Design	brand-experience	Make the brand look intentional, premium, and consistent.	We craft complete brand identities that communicate your values, differentiate you in the market, and resonate across every touchpoint. Premium design systems that scale.	\N	\N	["Logo & Visual Identity Systems","Brand Strategy & Positioning","UX Architecture & Wireframing","High-Fidelity UI Design","Complete Brand Guidelines","Creative Content Design Kits","Rebranding & Modernization","Design Systems for Scale (Reusable UI libraries)"]	[{"title":"Research","desc":"Understand your market, audience, and competitive landscape."},{"title":"Ideation","desc":"Explore concepts through moodboards, sketches, and creative direction."},{"title":"Design","desc":"Refine chosen direction into a comprehensive visual system."},{"title":"Deliver","desc":"Provide complete brand assets, guidelines, and production files."}]	\N	\N	1	t	\N	\N	2026-09-12 13:49:50.137	2026-09-12 13:49:50.137
cmtyfzbpe000caw1lv5r2ouvf	Growth & Marketing Engine	growth-marketing	Not 'marketing services.' A predictable, measurable growth system.	We build full-funnel growth engines — from technical SEO to paid media, content ecosystems to conversion optimization. Every channel measured, every dollar accounted for.	\N	\N	["Advanced SEO (Technical + Content + Authority)","Performance Marketing (Meta, Google, LinkedIn)","Social Media Strategy & Management","Content Ecosystem Buildout","Lead-Gen Funnels & CRO","Email Marketing & Drip Journeys","Influencer & Creator Campaign Architecture","Analytics Dashboards & Insights","A/B Testing & Optimization Loops"]	[{"title":"Audit","desc":"Analyze current performance, channels, and competition."},{"title":"Strategy","desc":"Develop a data-backed growth plan with clear KPIs."},{"title":"Execute","desc":"Implement campaigns, content, and optimization levers."},{"title":"Optimize","desc":"Continuously test, measure, and refine for better results."}]	\N	\N	2	t	\N	\N	2026-09-12 13:49:50.211	2026-09-12 13:49:50.211
cmtyfzbra000daw1lqv1gsnh4	Automation & Business Systems	automation-systems	Replace manual effort with clean, efficient systems that run 24/7.	We design and deploy automation systems that handle the heavy lifting — from CRM optimization to workflow automation, email sequences to custom integrations. Your business runs while you sleep.	\N	\N	["CRM Setup & Optimization (HubSpot, Zoho, Salesforce)","Sales & Lead Automation Systems","Workflow Automation (Internal + Client-facing)","Email Automation Flows","Custom Integrations (CRM / CMS / Payments / APIs)","Internal Tool Automation (Ops + Support + Sales)","No-Code Systems Engineering (n8n, Zapier, Make)","End-to-End Funnel Automation"]	[{"title":"Map","desc":"Identify bottlenecks, manual tasks, and automation opportunities."},{"title":"Design","desc":"Architect automated workflows with the right tool stack."},{"title":"Build","desc":"Implement integrations, triggers, and fail-safes."},{"title":"Monitor","desc":"Optimize flows, track performance, and scale."}]	\N	\N	3	t	\N	\N	2026-09-12 13:49:50.278	2026-09-12 13:49:50.278
cmtyfzbt9000eaw1lf48u5vgi	Operations & Digital Consulting	ops-consulting	Fix the internal mess clients pretend they don't have.	We audit, diagnose, and fix broken systems. From business process optimization to digital transformation roadmaps, we help you build operations that scale without chaos.	\N	\N	["Business Process Optimization","Digital Transformation Roadmaps","System Audits (Tech + Ops + Marketing)","Brand Positioning & Communication Strategy","Scaling Blueprints & Hiring Structure","Automation Feasibility Planning","Full Funnel Audits & Performance Breakdown","SOP Development & Documentation"]	[{"title":"Audit","desc":"Deep dive into current operations, systems, and pain points."},{"title":"Diagnose","desc":"Identify root causes and prioritize quick wins vs long-term fixes."},{"title":"Plan","desc":"Deliver a clear roadmap with timelines and resource requirements."},{"title":"Execute","desc":"Implement changes with ongoing support and iteration."}]	\N	\N	4	t	\N	\N	2026-09-12 13:49:50.349	2026-09-12 13:49:50.349
cmtyfzbvb000faw1lfsrftkra	Custom Product Builds	custom-product-builds	For when the client needs something beyond usual agency scope.	We engineer custom digital products — from SaaS MVPs to internal dashboards, data-driven applications to advanced API integrations. Strategy, architecture, and production in one package.	\N	\N	["SaaS MVP Development","Internal Dashboards & Admin Tools","Custom Web Platforms","Data-Driven Applications","Advanced API Integrations","Product Strategy + UX Architecture","Prototype → Production Development","Long-Term Tech Partnership & Support"]	[{"title":"Strategy","desc":"Define product vision, user stories, and technical requirements."},{"title":"Design","desc":"Create wireframes, prototypes, and system architecture."},{"title":"Build","desc":"Develop iteratively with agile sprints and continuous delivery."},{"title":"Ship","desc":"Deploy, monitor, and iterate based on real usage data."}]	\N	\N	5	t	\N	\N	2026-09-12 13:49:50.423	2026-09-12 13:49:50.423
cmtyfzbxb000gaw1lbomjmw2m	Specialized 'Next-Gen' Services	next-gen-services	Extraordinary category. This is where you stand out.	We build AI-powered systems that give your business a genuine competitive advantage — chatbots, automation workflows, predictive analytics, and intelligent tools that transform how you operate.	\N	\N	["AI-Powered Chatbots & Assistants","AI Automation Workflows (Internal + Customer-side)","AI-Based Lead Qualification & Support Systems","Data Visualization Dashboards","Predictive Analytics Systems","Automated Reporting Systems","Custom AI Tools for Workflow Efficiency","Intelligent Content & Campaign Generators"]	[{"title":"Discover","desc":"Identify high-impact areas for AI integration in your workflows."},{"title":"Design","desc":"Architect AI solutions tailored to your data and infrastructure."},{"title":"Build","desc":"Develop, train, and integrate AI models into existing systems."},{"title":"Deploy","desc":"Roll out with monitoring, retraining pipelines, and optimization."}]	\N	\N	6	t	\N	\N	2026-09-12 13:49:50.495	2026-09-12 13:49:50.495
cmtyfzbzg000haw1lkfya2r36	The 'Done-For-You' Scale Suite	done-for-you	For brands that want end-to-end growth without micromanaging anything.	Full digital ecosystem setup — brand, website, CRM, and campaigns in one unified system. Automated lead engines, monthly growth management, and dedicated ops support. You focus on the vision, we run the machine.	\N	\N	["Full Digital Ecosystem Setup","Brand + Website + CRM + Campaigns in One System","Automated Lead Engine Deployment","Monthly Growth Management","Always-On Optimization Loops","Quarterly Scale Strategy","Dedicated Ops Support"]	[{"title":"Onboard","desc":"Full discovery of your business, goals, and existing systems."},{"title":"Build","desc":"Set up the complete digital ecosystem in one seamless build."},{"title":"Launch","desc":"Go live with campaigns, automation, and monitoring active."},{"title":"Scale","desc":"Monthly optimization, quarterly strategy, always-on support."}]	\N	\N	7	t	\N	\N	2026-09-12 13:49:50.572	2026-09-12 13:49:50.572
\.


--
-- Data for Name: SupportTicket; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."SupportTicket" ("id", "clientId", "subject", "message", "status", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Tag; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."Tag" ("id", "name", "slug") FROM stdin;
\.


--
-- Data for Name: TagOnBlog; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."TagOnBlog" ("blogId", "tagId") FROM stdin;
\.


--
-- Data for Name: TeamMember; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."TeamMember" ("id", "name", "role", "bio", "image", "order", "published", "createdAt") FROM stdin;
\.


--
-- Data for Name: Testimonial; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."Testimonial" ("id", "name", "company", "role", "content", "rating", "avatar", "videoUrl", "isSample", "featured", "createdAt") FROM stdin;
cmtyfzctx000uaw1letot67dk	Aditya Rao	Brew & Bean Roasters	Co-Founder	NexScope helped us build a digital presence that is actually useful for our customers. The online menu and ordering flow are simple, and the feedback setup gives us a better understanding of customer experience.	5	\N	\N	f	t	2026-09-12 13:49:51.67
cmtyfzcwa000vaw1l96npa4oh	Rahul Kapoor	PrimeLedger Consultants	Managing Partner	The biggest improvement was that our website stopped being just an information page and became part of our lead-generation process. The CRM and automation setup gives our team much better visibility over prospects and follow-ups.	5	\N	\N	f	t	2026-09-12 13:49:51.754
cmtyfzcyl000waw1lxxipy9h4	Dr. Isha Verma	Medora Wellness	Founder	The new website is much easier for our visitors to understand and navigate. We can also update content more easily, and the WhatsApp enquiry flow has made it simpler for people to connect with us directly.	5	\N	\N	f	t	2026-09-12 13:49:51.838
cmtyfzd0s000xaw1lelrfhg94	Rohan Prabhulkar	Shweroh Cafe	Owner	Working with NexScope has been an awesome experience. The team delivered quality work on time and was very supportive throughout the project. The website, custom POS system, and management tools helped streamline our operations. Their support also helped during the launch of our new franchise, making daily operations easier and saving significant time.	5	\N	\N	f	t	2026-09-12 13:49:51.916
cmtyfzcl3000qaw1lc8p7alow	Ananya Mehta	Aurelia Skin Studio	Founder & Director	NexScope gave our brand a much more premium online presence. The website is clean, easy to navigate, and the appointment flow has made it much easier for customers to enquire and book. The WhatsApp integration was especially useful for quick communication.	5	\N	\N	f	t	2026-09-12 13:49:51.352
cmtyfzcn7000raw1ldwv4t7b2	Arjun Malhotra	NorthPeak Fitness	Founder	The team understood our requirements and built a system that actually fits our day-to-day operations. Managing leads, memberships and follow-ups is much easier now, and we have reduced a lot of repetitive administrative work.	5	\N	\N	f	t	2026-09-12 13:49:51.428
cmtyfzcph000saw1lecuf9m7g	Priya Shah	UrbanNest Interiors	Creative Director	NexScope helped us present our interior projects in a much more professional way. The portfolio structure looks premium and the enquiry experience is much smoother. We now have a website that feels aligned with the quality of our work.	5	\N	\N	f	t	2026-09-12 13:49:51.51
cmtyfzcrn000taw1lsafdhv6k	Kavya Nair	Velora Fashion	Founder	The website gave us a proper online shopping experience instead of just displaying products. Customers can browse easily, place orders and receive updates. The overall buying journey feels much more organized and professional.	5	\N	\N	f	t	2026-09-12 13:49:51.587
\.


--
-- Data for Name: ThemePreset; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."ThemePreset" ("id", "slug", "name", "colors", "fontPair", "isDefault", "order", "published", "createdAt", "updatedAt", "design", "mood") FROM stdin;
cmtytf3ds0000l7xe1q4fir3q	violet pop	violet pop	{"cream":"#FBF7EE","paper":"#F3EDE2","ink":"#141414","ink-soft":"#2A2622","orange":"#FF4D00","yellow":"#FFC72E","gray":"#6B6B62"}	fraunces-inter	f	0	t	2026-09-12 20:06:00.892	2026-09-13 21:03:59.82	signature	none
cmtytqesj000zaucw1vcvicbs	violet-pop	Violet Pop (Sharp + Vivid)	{"cream":"#F7F5FB","paper":"#EDE9F5","ink":"#191420","ink-soft":"#2B2438","orange":"#7C3AED","yellow":"#C4B5FD","gray":"#6E6580"}	syne-manrope	f	1	t	2026-09-12 20:14:48.931	2026-09-14 18:17:18.588	sharp	vivid
cmtytqeto0010aucw0agu69wp	teal-tide	Teal Tide (Soft)	{"cream":"#F2FAF7","paper":"#E4F3EC","ink":"#0F211C","ink-soft":"#1D3830","orange":"#0EA37A","yellow":"#7EE8C6","gray":"#5E7A70"}	fraunces-inter	f	2	t	2026-09-12 20:14:48.972	2026-09-14 18:17:18.622	soft	none
cmtytj43e0001l7xe2yrgkg3i	acid-noir	Acid Noir	{"cream":"#F1F1EC","paper":"#FAFAF5","ink":"#111111","ink-soft":"#3F3F3A","orange":"#B8FF00","yellow":"#77776F","gray":"#6B6B62"}	grotesk-archivo	f	1	t	2026-09-12 20:09:08.474	2026-09-13 20:59:46.691	signature	none
cmtytqer1000yaucwsq0qjkw8	signature	Signature	{"cream":"#FBF7EE","paper":"#F3EDE2","ink":"#141414","ink-soft":"#2A2622","orange":"#FF4D00","yellow":"#FFC72E","gray":"#6B6B62"}	grotesk-archivo	t	0	t	2026-09-12 20:14:48.878	2026-09-14 18:17:18.531	signature	none
cmtytqeux0011aucwy9m5h0x9	sunset-blush	Sunset Blush (Sharp + Noir)	{"cream":"#FEF6F3","paper":"#FBE7E0","ink":"#2A1512","ink-soft":"#432420","orange":"#E8467A","yellow":"#FFB37B","gray":"#8A6A63"}	fraunces-inter	f	3	t	2026-09-12 20:14:49.017	2026-09-14 18:17:18.693	sharp	noir
cmu0aqwln0012456od5be29pq	midnight-pill	Midnight Pill (Soft + Vivid)	{"cream":"#F4F6FB","paper":"#E6EAF5","ink":"#0B1220","ink-soft":"#1B2436","orange":"#4E8CF5","yellow":"#7EE8C6","gray":"#5F6B85"}	syne-manrope	f	4	t	2026-09-13 20:58:51.659	2026-09-14 18:17:18.729	soft	vivid
cmu0bcmfi00137mcjnrxzdc1f	shadow-mode	Shadow Mode (Noir)	{"cream":"#EDEDED","paper":"#DCDCDC","ink":"#0A0A0A","ink-soft":"#2A2A2A","orange":"#8A8A8A","yellow":"#C9C9C9","gray":"#5A5A5A"}	grotesk-archivo	f	5	t	2026-09-13 21:15:44.91	2026-09-14 18:17:18.764	sharp	noir
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "logs", "rolled_back_at", "started_at", "applied_steps_count") FROM stdin;
f8046149-7fe9-4516-81d9-3c49b45f22a9	073247fd00554e2c925d137778377c462facc5f10254771894d1ff4f73e42d16	2026-09-12 13:49:46.243975+00	20260912134946_init_upgrades	\N	\N	2026-09-12 13:49:46.147644+00	1
\.


--
-- PostgreSQL database dump complete
--

-- \unrestrict ukamLPOdEZuobL7kqNz8lgCSG2aIi2EUnpQEx7CNl0dQAbLy5sh8fXYCgMwhfOg

RESET ALL;

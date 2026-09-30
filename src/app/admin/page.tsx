"use client";
import Image from "next/image";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import {
  LayoutDashboard, Briefcase, FileText, Star, LogOut, Trash2, Users,
  Plus, X, Save, Loader2, Layers, HelpCircle, Package as PackageIcon, UserCog, Contact, Palette
} from "lucide-react";
import { FileUpload } from "@/components/admin/file-upload";

type Tab = "dashboard" | "testimonials" | "portfolio" | "blogs" | "services" | "packages" | "faq" | "team" | "leads" | "theme";

interface ThemePresetItem {
  id: string;
  slug: string;
  name: string;
  colors: Record<string, string>;
  fontPair: string;
  design: string;
  mood: string;
  isDefault: boolean;
  order: number;
  published: boolean;
}

interface DashboardStats {
  testimonials: number;
  portfolio: number;
  blogs: number;
  services: number;
  packages: number;
  faq: number;
  team: number;
  leads: number;
}

interface Testimonial {
  id: string;
  name: string;
  company: string;
  role: string | null;
  content: string;
  rating: number;
  videoUrl: string | null;
  featured: boolean;
  isSample: boolean;
  createdAt: string;
}

interface PortfolioItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string | null;
  client: string | null;
  images: string | null;
  url: string | null;
  challenge: string | null;
  solution: string | null;
  results: string | null;
  process: string | null;
  published: boolean;
  featured: boolean;
  isSample: boolean;
  createdAt: string;
}

interface BlogItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  published: boolean;
  featured: boolean;
  createdAt: string;
  author: { name: string } | null;
}

interface ServiceItem {
  id: string;
  title: string;
  slug: string;
  shortDesc: string;
  description: string;
  benefits: string | null; // JSON-stringified string[]
  process: string | null; // JSON-stringified {title, desc}[]
  order: number;
  published: boolean;
}

interface PackageItem {
  id: string;
  title: string;
  slug: string;
  icon: string;
  color: string;
  signal: string;
  purpose: string;
  forWhom: string;
  outcome: string;
  items: string | null; // JSON-stringified string[]
  order: number;
  published: boolean;
}

interface TeamMemberItem {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  image: string | null;
  order: number;
  published: boolean;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  order: number;
  published: boolean;
}

interface Lead {
  id: string;
  name: string;
  email: string;
  company: string | null;
  budget: string | null;
  message: string | null;
  status: string;
  createdAt: string;
}

function getToken(): Promise<string | null> {
  return auth.currentUser?.getIdToken() || Promise.resolve(null);
}

async function apiFetch(url: string, options: RequestInit = {}) {
  const token = await getToken();
  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
}

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [stats, setStats] = useState<DashboardStats>({ testimonials: 0, portfolio: 0, blogs: 0, services: 0, packages: 0, faq: 0, team: 0, leads: 0 });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/admin/login");
        return;
      }
      setUser(currentUser);
      setLoading(false);
      fetchStats();
    });
    return () => unsubscribe();
  }, [router]);

  const fetchStats = async () => {
    try {
      const res = await apiFetch("/api/admin/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-white/10 border-t-white rounded-full" />
      </div>
    );
  }

  if (!user) return null;

  const tabs: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "testimonials", label: "Testimonials", icon: Star },
    { id: "portfolio", label: "Portfolio", icon: Briefcase },
    { id: "blogs", label: "Blogs", icon: FileText },
    { id: "services", label: "Services", icon: Layers },
    { id: "packages", label: "Packages", icon: PackageIcon },
    { id: "faq", label: "FAQ", icon: HelpCircle },
    { id: "team", label: "Team", icon: Contact },
    { id: "theme", label: "Theme", icon: Palette },
    { id: "leads", label: "Leads", icon: Users },
  ];

  return (
    <div className="admin-shell min-h-screen flex">
      {/* Sidebar */}
      <aside className="admin-sidebar w-64 p-6 hidden lg:flex flex-col">
        <div className="flex items-center gap-3 mb-8">
          <div className="admin-logo w-9 h-9 rounded-lg flex items-center justify-center overflow-hidden">
            <Image src="/logo/nexscope-mark.png" alt="NexScope" width={28} height={28} className="h-7 w-7 object-contain" />
          </div>
          <div>
            <p className="text-sm font-semibold">NexScope</p>
            <p className="text-[0.55rem] font-light tracking-[0.2em] text-zinc-500 uppercase">Admin</p>
          </div>
        </div>

        <nav className="admin-nav flex-1 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                activeTab === tab.id
                  ? "admin-nav-active"
                  : "admin-nav-idle"
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}

          {/* Separate page, not a tab — client portal management has its
              own nested UI (clients → projects → updates), so it lives at
              its own route rather than another tab here. */}
          <a
            href="/admin/clients"
            className="admin-nav-idle w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all duration-200"
          >
            <UserCog size={16} />
            Client Portal
          </a>
        </nav>

        <div className="admin-account pt-4 mt-4">
          <p className="text-xs mb-2 truncate">{user.email}</p>
          <button
            onClick={handleLogout}
            className="admin-logout flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all duration-200 w-full"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <header className="admin-header sticky top-0 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <p className="admin-kicker">NEXSCOPE / CONTROL ROOM</p>
            <h2 className="font-display text-xl font-black uppercase tracking-tight">{activeTab}</h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="admin-header-email text-xs hidden sm:block">{user.email}</span>
            <button
              onClick={handleLogout}
              className="admin-logout lg:hidden flex items-center gap-2 text-sm transition-colors"
            >
              <LogOut size={16} />
            </button>
          </div>
        </header>

        <nav className="admin-mobile-nav lg:hidden flex gap-2 overflow-x-auto px-4 py-3 no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold ${activeTab === tab.id ? "admin-accent border-[var(--color-orange)]" : "admin-mobile-idle"}`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="admin-content p-6">
          {activeTab === "dashboard" && <DashboardView stats={stats} />}
          {activeTab === "testimonials" && <TestimonialsManager />}
          {activeTab === "portfolio" && <PortfolioManager />}
          {activeTab === "blogs" && <BlogsManager />}
          {activeTab === "services" && <ServicesManager />}
          {activeTab === "packages" && <PackagesManager />}
          {activeTab === "faq" && <FAQManager />}
          {activeTab === "team" && <TeamManager />}
          {activeTab === "theme" && <ThemeManager />}
          {activeTab === "leads" && <LeadsView />}
        </div>
      </main>
    </div>
  );
}

function DashboardView({ stats }: { stats: DashboardStats }) {
  const cards = [
    { label: "Testimonials", value: stats.testimonials, icon: Star, color: "from-purple-500 to-pink-500" },
    { label: "Portfolio Projects", value: stats.portfolio, icon: Briefcase, color: "from-blue-500 to-cyan-500" },
    { label: "Blog Posts", value: stats.blogs, icon: FileText, color: "from-green-500 to-emerald-500" },
    { label: "Services", value: stats.services, icon: Layers, color: "from-indigo-500 to-blue-500" },
    { label: "Packages", value: stats.packages, icon: PackageIcon, color: "from-cyan-500 to-blue-500" },
    { label: "FAQs", value: stats.faq, icon: HelpCircle, color: "from-pink-500 to-rose-500" },
    { label: "Team Members", value: stats.team, icon: Contact, color: "from-teal-500 to-emerald-500" },
    { label: "Leads", value: stats.leads, icon: Users, color: "from-orange-500 to-amber-500" },
  ];

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard-intro mb-8">
        <div>
          <p className="admin-kicker">AT A GLANCE</p>
          <h3 className="font-display text-3xl sm:text-4xl font-black uppercase tracking-tight">Overview</h3>
        </div>
        <span className="admin-live-mark"><span /> Live workspace</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {cards.map((card) => (
          <div key={card.label} className="admin-stat-card">
            <div className={`admin-stat-icon ${card.color} mb-8`}>
              <card.icon size={18} />
              </div>
            <p className="font-display text-4xl font-black">{card.value}</p>
            <p className="admin-stat-label mt-1">{card.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// === TESTIMONIALS MANAGER ===
function TestimonialsManager() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState({ name: "", company: "", role: "", content: "", videoUrl: "", rating: 5, featured: false });
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const res = await apiFetch("/api/admin/testimonials");
      const data = await res.json();
      setTestimonials(data.testimonials || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const openNew = () => {
    setEditing(null);
    setForm({ name: "", company: "", role: "", content: "", videoUrl: "", rating: 5, featured: false });
    setShowForm(true);
  };

  const openEdit = (t: Testimonial) => {
    setEditing(t);
    setForm({ name: t.name, company: t.company, role: t.role || "", content: t.content, videoUrl: t.videoUrl || "", rating: t.rating, featured: t.featured });
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const method = editing ? "PUT" : "POST";
      const body = editing ? { ...form, id: editing.id } : form;
      const res = await apiFetch("/api/admin/testimonials", {
        method,
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setShowForm(false);
        setEditing(null);
        loadData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    try {
      const res = await apiFetch(`/api/admin/testimonials?id=${id}`, { method: "DELETE" });
      if (res.ok) setTestimonials(testimonials.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-zinc-500">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-semibold">Testimonials</h3>
        <button onClick={openNew} className="flex items-center gap-2 bg-white text-black rounded-full px-4 py-2 text-sm font-medium hover:opacity-90 transition-all">
          <Plus size={14} /> Add Testimonial
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#0D0D0D] border border-white/[0.06] rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-semibold">{editing ? "Edit" : "New"} Testimonial</h4>
              <button onClick={() => setShowForm(false)} className="text-zinc-500 hover:text-white"><X size={18} /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Name *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50" />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Company *</label>
                <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} required className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50" />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Role</label>
                <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50" />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Content *</label>
                <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required rows={4} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50 resize-none" />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Video testimonial URL</label>
                <input type="url" value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} placeholder="https://.../testimonial.mp4" className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50" />
                <p className="mt-1 text-[0.7rem] text-zinc-600">Use a direct MP4/WebM URL. The public video showcase will use it when available.</p>
              </div>
              <div className="flex gap-4">
                <div>
                  <label className="block text-xs text-zinc-500 mb-1">Rating</label>
                  <select value={form.rating} onChange={(e) => setForm({ ...form, rating: parseInt(e.target.value) })} className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none">
                    {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} ★</option>)}
                  </select>
                </div>
                <div className="flex items-end pb-2.5">
                  <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer">
                    <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="rounded" />
                    Featured
                  </label>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="flex items-center gap-2 bg-white text-black rounded-full px-6 py-2.5 text-sm font-medium hover:opacity-90 transition-all disabled:opacity-50">
                  {saving && <Loader2 size={14} className="animate-spin" />}
                  <Save size={14} /> {editing ? "Update" : "Create"}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="text-sm text-zinc-500 hover:text-white px-4">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {testimonials.length === 0 && <p className="text-zinc-500">No testimonials yet.</p>}
        {testimonials.map((t) => (
          <div key={t.id} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 flex items-start justify-between group">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
                  {t.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-zinc-500">{t.company}{t.role ? ` · ${t.role}` : ""}</p>
                </div>
                {t.featured && <span className="text-[0.55rem] font-medium uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">Featured</span>}
                {t.isSample && <span className="text-[0.55rem] font-medium uppercase tracking-wider text-[var(--color-orange)] bg-[var(--color-orange)]/10 px-2 py-0.5 rounded-full">Sample content</span>}
              </div>
              <p className="text-sm text-zinc-400 mt-2 line-clamp-2">{t.content}</p>
              {t.videoUrl && <p className="mt-2 truncate text-xs text-emerald-400">Video testimonial attached</p>}
              <div className="flex items-center gap-1 mt-1">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <span key={i} className="text-yellow-500 text-xs">★</span>
                ))}
              </div>
            </div>
            <div className="flex gap-1 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => openEdit(t)} className="p-2 text-zinc-500 hover:text-blue-400 transition-colors"><FileText size={14} /></button>
              <button onClick={() => handleDelete(t.id)} className="p-2 text-zinc-500 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// === PORTFOLIO MANAGER ===
function PortfolioManager() {
  const [projects, setProjects] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<PortfolioItem | null>(null);
  const [form, setForm] = useState({ title: "", slug: "", description: "", category: "", client: "", url: "", images: "", videoUrl: "", testimonial: "", challenge: "", solution: "", results: "", process: "", published: true, featured: false });
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const res = await apiFetch("/api/admin/portfolio");
      const data = await res.json();
      setProjects(data.projects || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const openNew = () => {
    setEditing(null);
    setForm({ title: "", slug: "", description: "", category: "", client: "", url: "", images: "", videoUrl: "", testimonial: "", challenge: "", solution: "", results: "", process: "", published: true, featured: false });
    setShowForm(true);
  };

  const openEdit = (p: PortfolioItem) => {
    setEditing(p);
    setForm({ title: p.title, slug: p.slug, description: p.description, category: p.category || "", client: p.client || "", url: p.url || "", images: p.images || "", videoUrl: "", testimonial: "", challenge: p.challenge || "", solution: p.solution || "", results: p.results || "", process: p.process || "", published: p.published, featured: p.featured });
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const method = editing ? "PUT" : "POST";
      const body = editing ? { ...form, id: editing.id } : { ...form, slug: form.slug || form.title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "") };
      const res = await apiFetch("/api/admin/portfolio", { method, body: JSON.stringify(body) });
      if (res.ok) { setShowForm(false); setEditing(null); loadData(); }
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    try {
      const res = await apiFetch(`/api/admin/portfolio?id=${id}`, { method: "DELETE" });
      if (res.ok) setProjects(projects.filter((p) => p.id !== id));
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="text-zinc-500">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-semibold">Portfolio Projects</h3>
        <button onClick={openNew} className="flex items-center gap-2 bg-white text-black rounded-full px-4 py-2 text-sm font-medium hover:opacity-90">
          <Plus size={14} /> Add Project
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
              <div className="border-t border-white/[0.08] pt-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">Case study story</p>
                <div className="space-y-3">
                  <textarea value={form.challenge} onChange={(e) => setForm({ ...form, challenge: e.target.value })} placeholder="The challenge: what needed to change?" rows={2} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none resize-none" />
                  <textarea value={form.solution} onChange={(e) => setForm({ ...form, solution: e.target.value })} placeholder="The approach: what did NexScope build or change?" rows={2} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none resize-none" />
                  <textarea value={form.results} onChange={(e) => setForm({ ...form, results: e.target.value })} placeholder="The result: use verified outcomes only" rows={2} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none resize-none" />
                  <textarea value={form.process} onChange={(e) => setForm({ ...form, process: e.target.value })} placeholder="Process steps, one per line" rows={3} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none resize-none" />
                </div>
              </div>
          <div className="bg-[#0D0D0D] border border-white/[0.06] rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-semibold">{editing ? "Edit" : "New"} Project</h4>
              <button onClick={() => setShowForm(false)} className="text-zinc-500 hover:text-white"><X size={18} /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Title *</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50" />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Slug</label>
                <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated from title" className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50" />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Description *</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={3} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-zinc-500 mb-1">Category</label>
                  <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 mb-1">Client</label>
                  <input value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Project URL</label>
                <input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Project image URL</label>
                <input value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} placeholder="https://..." className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Client result / testimonial</label>
                <textarea value={form.testimonial} onChange={(e) => setForm({ ...form, testimonial: e.target.value })} rows={2} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none resize-none" />
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer">
                  <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Published
                </label>
                <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer">
                  <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="flex items-center gap-2 bg-white text-black rounded-full px-6 py-2.5 text-sm font-medium hover:opacity-90 disabled:opacity-50">
                  {saving && <Loader2 size={14} className="animate-spin" />}
                  <Save size={14} /> {editing ? "Update" : "Create"}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="text-sm text-zinc-500 hover:text-white">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {projects.length === 0 && <p className="text-zinc-500">No projects yet.</p>}
        {projects.map((p) => (
          <div key={p.id} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 flex items-start justify-between group">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-medium">{p.title}</p>
                {p.featured && <span className="text-[0.55rem] font-medium uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">Featured</span>}
                {p.isSample && <span className="text-[0.55rem] font-medium uppercase tracking-wider text-[var(--color-orange)] bg-[var(--color-orange)]/10 px-2 py-0.5 rounded-full">Sample content</span>}
                {!p.published && <span className="text-[0.55rem] font-medium uppercase tracking-wider text-zinc-500 bg-zinc-500/10 px-2 py-0.5 rounded-full">Draft</span>}
              </div>
              {p.client && <p className="text-xs text-zinc-500">Client: {p.client}</p>}
              <p className="text-sm text-zinc-400 mt-1 line-clamp-2">{p.description}</p>
              {p.category && <p className="text-[0.6rem] text-zinc-600 mt-1">{p.category}</p>}
            </div>
            <div className="flex gap-1 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => openEdit(p)} className="p-2 text-zinc-500 hover:text-blue-400"><FileText size={14} /></button>
              <button onClick={() => handleDelete(p.id)} className="p-2 text-zinc-500 hover:text-red-400"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// === SERVICES MANAGER ===

function ServicesManager() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ServiceItem | null>(null);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    shortDesc: "",
    description: "",
    benefitsText: "", // one benefit per line in the form; converted to an array on save
    processText: "", // one "Title: Description" pair per line in the form
    order: 0,
    published: false,
  });
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const res = await apiFetch("/api/admin/services");
      const data = await res.json();
      setServices(data.services || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const openNew = () => {
    setEditing(null);
    setForm({ title: "", slug: "", shortDesc: "", description: "", benefitsText: "", processText: "", order: services.length, published: false });
    setShowForm(true);
  };

  const openEdit = (s: ServiceItem) => {
    setEditing(s);
    let benefitsText = "";
    try {
      const parsed = s.benefits ? JSON.parse(s.benefits) : [];
      benefitsText = Array.isArray(parsed) ? parsed.join("\n") : "";
    } catch { /* leave blank if malformed */ }

    let processText = "";
    try {
      const parsed = s.process ? JSON.parse(s.process) : [];
      processText = Array.isArray(parsed)
        ? parsed.map((p: { title: string; desc: string }) => `${p.title}: ${p.desc}`).join("\n")
        : "";
    } catch { /* leave blank if malformed */ }

    setForm({
      title: s.title,
      slug: s.slug,
      shortDesc: s.shortDesc,
      description: s.description,
      benefitsText,
      processText,
      order: s.order,
      published: s.published,
    });
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const benefits = form.benefitsText.split("\n").map((line) => line.trim()).filter(Boolean);
      const process = form.processText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const [title, ...rest] = line.split(":");
          return { title: (title || "").trim(), desc: rest.join(":").trim() };
        });

      const method = editing ? "PUT" : "POST";
      const body = {
        title: form.title,
        slug: form.slug || form.title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, ""),
        shortDesc: form.shortDesc,
        description: form.description,
        benefits,
        process,
        order: form.order,
        published: form.published,
        ...(editing ? { id: editing.id } : {}),
      };
      const res = await apiFetch("/api/admin/services", { method, body: JSON.stringify(body) });
      if (res.ok) { setShowForm(false); setEditing(null); loadData(); }
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this service?")) return;
    try {
      const res = await apiFetch(`/api/admin/services?id=${id}`, { method: "DELETE" });
      if (res.ok) setServices(services.filter((s) => s.id !== id));
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="text-zinc-500">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-semibold">Services</h3>
        <button onClick={openNew} className="flex items-center gap-2 bg-white text-black rounded-full px-4 py-2 text-sm font-medium hover:opacity-90">
          <Plus size={14} /> Add Service
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#0D0D0D] border border-white/[0.06] rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-semibold">{editing ? "Edit" : "New"} Service</h4>
              <button onClick={() => setShowForm(false)} className="text-zinc-500 hover:text-white"><X size={18} /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Title *</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50" />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Slug</label>
                <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated from title" className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50" />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Short Description / Tagline *</label>
                <input value={form.shortDesc} onChange={(e) => setForm({ ...form, shortDesc: e.target.value })} required placeholder="One line shown on the services list page" className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50" />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Full Description *</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={3} placeholder="Shown on the service's own detail page" className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50 resize-none" />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">What's Inside (one item per line)</label>
                <textarea value={form.benefitsText} onChange={(e) => setForm({ ...form, benefitsText: e.target.value })} rows={4} placeholder={"Website Engineering\nSecure Hosting & Cloud Deployment\n..."} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50 resize-none" />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Process Steps (one per line, "Title: Description")</label>
                <textarea value={form.processText} onChange={(e) => setForm({ ...form, processText: e.target.value })} rows={4} placeholder={"Audit: Analyze current setup\nBuild: Develop the solution\n..."} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50 resize-none" />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Display Order</label>
                <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value, 10) || 0 })} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none" />
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer">
                  <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Published
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="flex items-center gap-2 bg-white text-black rounded-full px-6 py-2.5 text-sm font-medium hover:opacity-90 disabled:opacity-50">
                  {saving && <Loader2 size={14} className="animate-spin" />}
                  <Save size={14} /> {editing ? "Update" : "Create"}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="text-sm text-zinc-500 hover:text-white">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {services.length === 0 && <p className="text-zinc-500">No services yet — the public pages show the original launch content until you add some here.</p>}
        {services
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((s) => (
            <div key={s.id} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 flex items-start justify-between group">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[0.6rem] text-zinc-600">#{s.order}</span>
                  <p className="text-sm font-medium">{s.title}</p>
                  {!s.published && <span className="text-[0.55rem] font-medium uppercase tracking-wider text-zinc-500 bg-zinc-500/10 px-2 py-0.5 rounded-full">Draft</span>}
                </div>
                <p className="text-sm text-zinc-400 mt-1 line-clamp-2">{s.shortDesc}</p>
              </div>
              <div className="flex gap-1 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(s)} className="p-2 text-zinc-500 hover:text-blue-400"><FileText size={14} /></button>
                <button onClick={() => handleDelete(s.id)} className="p-2 text-zinc-500 hover:text-red-400"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

// === PACKAGES MANAGER ===

const PACKAGE_ICON_OPTIONS = ["Zap", "TrendingUp", "Cpu", "Palette", "Users", "Box", "LayoutGrid", "Sliders"];

function PackagesManager() {
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<PackageItem | null>(null);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    icon: "Zap",
    color: "from-blue-500 to-cyan-500",
    signal: "",
    purpose: "",
    forWhom: "",
    outcome: "",
    itemsText: "", // one item per line in the form; converted to an array on save
    order: 0,
    published: false,
  });
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const res = await apiFetch("/api/admin/packages");
      const data = await res.json();
      setPackages(data.packages || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const openNew = () => {
    setEditing(null);
    setForm({ title: "", slug: "", icon: "Zap", color: "from-blue-500 to-cyan-500", signal: "", purpose: "", forWhom: "", outcome: "", itemsText: "", order: packages.length, published: false });
    setShowForm(true);
  };

  const openEdit = (p: PackageItem) => {
    setEditing(p);
    let itemsText = "";
    try {
      const parsed = p.items ? JSON.parse(p.items) : [];
      itemsText = Array.isArray(parsed) ? parsed.join("\n") : "";
    } catch { /* leave blank if malformed */ }

    setForm({
      title: p.title,
      slug: p.slug,
      icon: p.icon,
      color: p.color,
      signal: p.signal,
      purpose: p.purpose,
      forWhom: p.forWhom,
      outcome: p.outcome,
      itemsText,
      order: p.order,
      published: p.published,
    });
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const items = form.itemsText.split("\n").map((line) => line.trim()).filter(Boolean);
      const method = editing ? "PUT" : "POST";
      const body = {
        title: form.title,
        slug: form.slug || form.title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, ""),
        icon: form.icon,
        color: form.color,
        signal: form.signal,
        purpose: form.purpose,
        forWhom: form.forWhom,
        outcome: form.outcome,
        items,
        order: form.order,
        published: form.published,
        ...(editing ? { id: editing.id } : {}),
      };
      const res = await apiFetch("/api/admin/packages", { method, body: JSON.stringify(body) });
      if (res.ok) { setShowForm(false); setEditing(null); loadData(); }
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this package?")) return;
    try {
      const res = await apiFetch(`/api/admin/packages?id=${id}`, { method: "DELETE" });
      if (res.ok) setPackages(packages.filter((p) => p.id !== id));
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="text-zinc-500">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-semibold">Packages</h3>
        <button onClick={openNew} className="flex items-center gap-2 bg-white text-black rounded-full px-4 py-2 text-sm font-medium hover:opacity-90">
          <Plus size={14} /> Add Package
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#0D0D0D] border border-white/[0.06] rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-semibold">{editing ? "Edit" : "New"} Package</h4>
              <button onClick={() => setShowForm(false)} className="text-zinc-500 hover:text-white"><X size={18} /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Title *</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50" />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Slug</label>
                <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated from title" className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-zinc-500 mb-1">Icon</label>
                  <select value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none">
                    {PACKAGE_ICON_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 mb-1">Gradient (Tailwind classes)</label>
                  <input value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} placeholder="from-blue-500 to-cyan-500" className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Signal Line (short hook)</label>
                <input value={form.signal} onChange={(e) => setForm({ ...form, signal: e.target.value })} placeholder='e.g. "Starting out? This is enough."' className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50" />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Purpose *</label>
                <textarea value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} required rows={2} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50 resize-none" />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Who It's For</label>
                <input value={form.forWhom} onChange={(e) => setForm({ ...form, forWhom: e.target.value })} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50" />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Outcome</label>
                <input value={form.outcome} onChange={(e) => setForm({ ...form, outcome: e.target.value })} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50" />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">What's Included (one item per line)</label>
                <textarea value={form.itemsText} onChange={(e) => setForm({ ...form, itemsText: e.target.value })} rows={5} placeholder={"Website (5–7 pages)\nBrand identity mini-kit\n..."} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50 resize-none" />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Display Order</label>
                <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value, 10) || 0 })} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none" />
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer">
                  <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Published
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="flex items-center gap-2 bg-white text-black rounded-full px-6 py-2.5 text-sm font-medium hover:opacity-90 disabled:opacity-50">
                  {saving && <Loader2 size={14} className="animate-spin" />}
                  <Save size={14} /> {editing ? "Update" : "Create"}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="text-sm text-zinc-500 hover:text-white">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {packages.length === 0 && <p className="text-zinc-500">No packages yet — the public /packages page shows the original launch packages until you add some here.</p>}
        {packages
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((p) => (
            <div key={p.id} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 flex items-start justify-between group">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[0.6rem] text-zinc-600">#{p.order}</span>
                  <p className="text-sm font-medium">{p.title}</p>
                  {!p.published && <span className="text-[0.55rem] font-medium uppercase tracking-wider text-zinc-500 bg-zinc-500/10 px-2 py-0.5 rounded-full">Draft</span>}
                </div>
                <p className="text-sm text-zinc-400 mt-1 line-clamp-2">{p.purpose}</p>
              </div>
              <div className="flex gap-1 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(p)} className="p-2 text-zinc-500 hover:text-blue-400"><FileText size={14} /></button>
                <button onClick={() => handleDelete(p.id)} className="p-2 text-zinc-500 hover:text-red-400"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

// === FAQ MANAGER ===

function FAQManager() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<FAQItem | null>(null);
  const [form, setForm] = useState({
    question: "",
    answer: "",
    category: "",
    order: 0,
    published: true,
  });
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const res = await apiFetch("/api/admin/faq");
      const data = await res.json();
      setFaqs(data.faqs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const openNew = () => {
    setEditing(null);
    setForm({ question: "", answer: "", category: "", order: faqs.length, published: true });
    setShowForm(true);
  };

  const openEdit = (f: FAQItem) => {
    setEditing(f);
    setForm({
      question: f.question,
      answer: f.answer,
      category: f.category || "",
      order: f.order,
      published: f.published,
    });
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const method = editing ? "PUT" : "POST";
      const body = {
        question: form.question,
        answer: form.answer,
        category: form.category || null,
        order: form.order,
        published: form.published,
        ...(editing ? { id: editing.id } : {}),
      };
      const res = await apiFetch("/api/admin/faq", { method, body: JSON.stringify(body) });
      if (res.ok) { setShowForm(false); setEditing(null); loadData(); }
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this FAQ?")) return;
    try {
      const res = await apiFetch(`/api/admin/faq?id=${id}`, { method: "DELETE" });
      if (res.ok) setFaqs(faqs.filter((f) => f.id !== id));
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="text-zinc-500">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-semibold">FAQ</h3>
        <button onClick={openNew} className="flex items-center gap-2 bg-white text-black rounded-full px-4 py-2 text-sm font-medium hover:opacity-90">
          <Plus size={14} /> Add FAQ
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#0D0D0D] border border-white/[0.06] rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-semibold">{editing ? "Edit" : "New"} FAQ</h4>
              <button onClick={() => setShowForm(false)} className="text-zinc-500 hover:text-white"><X size={18} /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Question *</label>
                <input value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} required className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50" />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Answer *</label>
                <textarea value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} required rows={4} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50 resize-none" />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Category (optional)</label>
                <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. Pricing, Process, General" className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50" />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Display Order</label>
                <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value, 10) || 0 })} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none" />
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer">
                  <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Published
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="flex items-center gap-2 bg-white text-black rounded-full px-6 py-2.5 text-sm font-medium hover:opacity-90 disabled:opacity-50">
                  {saving && <Loader2 size={14} className="animate-spin" />}
                  <Save size={14} /> {editing ? "Update" : "Create"}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="text-sm text-zinc-500 hover:text-white">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {faqs.length === 0 && <p className="text-zinc-500">No FAQs yet — the public pages show the original launch FAQs until you add some here.</p>}
        {faqs
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((f) => (
            <div key={f.id} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 flex items-start justify-between group">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[0.6rem] text-zinc-600">#{f.order}</span>
                  <p className="text-sm font-medium">{f.question}</p>
                  {!f.published && <span className="text-[0.55rem] font-medium uppercase tracking-wider text-zinc-500 bg-zinc-500/10 px-2 py-0.5 rounded-full">Hidden</span>}
                </div>
                <p className="text-sm text-zinc-400 mt-1 line-clamp-2">{f.answer}</p>
              </div>
              <div className="flex gap-1 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(f)} className="p-2 text-zinc-500 hover:text-blue-400"><FileText size={14} /></button>
                <button onClick={() => handleDelete(f.id)} className="p-2 text-zinc-500 hover:text-red-400"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

// === THEME MANAGER ===
// Lets an admin curate the small set of color + font presets a visitor can
// pick between via the floating palette toggle on the public site. Only 7
// public-site color variables and a fixed font-pairing list are editable
// here — layout and spacing are never part of a preset, by design, so a
// visitor swap can never make the site look broken, just differently
// colored/voiced.

const THEME_COLOR_FIELDS: { key: string; label: string }[] = [
  { key: "cream", label: "Background (cream)" },
  { key: "paper", label: "Panel background (paper)" },
  { key: "ink", label: "Text (ink)" },
  { key: "ink-soft", label: "Secondary text (ink-soft)" },
  { key: "orange", label: "Primary accent (orange)" },
  { key: "yellow", label: "Secondary accent (yellow)" },
  { key: "gray", label: "Muted text (gray)" },
];

const DEFAULT_THEME_COLORS: Record<string, string> = {
  cream: "#FBF7EE", paper: "#F3EDE2", ink: "#141414", "ink-soft": "#2A2622",
  orange: "#FF4D00", yellow: "#FFC72E", gray: "#6B6B62",
};

// Must match ALLOWED_FONT_PAIRS in /api/admin/theme/route.ts and FONT_PAIRS
// in theme-switcher.tsx — these are the only three font pairings preloaded
// on the site, so this list can't drift from what's actually available.
const FONT_PAIR_OPTIONS = [
  { slug: "grotesk-archivo", label: "Space Grotesk + Archivo (default — sharp, geometric)" },
  { slug: "fraunces-inter", label: "Fraunces + Inter (warm, editorial)" },
  { slug: "syne-manrope", label: "Syne + Manrope (bold, high-contrast)" },
];

// Must match ALLOWED_DESIGNS in /api/admin/theme/route.ts and the
// html[data-design=...] CSS rules in globals.css.
const DESIGN_OPTIONS = [
  { slug: "signature", label: "Signature (current rounded corners)" },
  { slug: "sharp", label: "Sharp / Brutalist (square corners, no rounding)" },
  { slug: "soft", label: "Soft / Pill (extra-rounded corners)" },
];

// Must match ALLOWED_MOODS in /api/admin/theme/route.ts and the
// html[data-mood=...] CSS rules in globals.css. This is the dramatic
// lever — a full-page filter, applied on top of color/font/shape.
const MOOD_OPTIONS = [
  { slug: "none", label: "None (normal)" },
  { slug: "noir", label: "Noir (grayscale, high contrast)" },
  { slug: "vivid", label: "Vivid (saturated + drifting glow background)" },
];

function ThemeManager() {
  const [presets, setPresets] = useState<ThemePresetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ThemePresetItem | null>(null);
  const [form, setForm] = useState({
    slug: "", name: "", colors: { ...DEFAULT_THEME_COLORS }, fontPair: "grotesk-archivo", design: "signature", mood: "none", isDefault: false, order: 0, published: true,
  });
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const res = await apiFetch("/api/admin/theme");
      const data = await res.json();
      setPresets(data.presets || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const openNew = () => {
    setEditing(null);
    setForm({ slug: "", name: "", colors: { ...DEFAULT_THEME_COLORS }, fontPair: "grotesk-archivo", design: "signature", mood: "none", isDefault: false, order: presets.length, published: true });
    setShowForm(true);
  };

  const openEdit = (p: ThemePresetItem) => {
    setEditing(p);
    setForm({
      slug: p.slug,
      name: p.name,
      colors: { ...DEFAULT_THEME_COLORS, ...p.colors },
      fontPair: p.fontPair || "grotesk-archivo",
      design: p.design || "signature",
      mood: p.mood || "none",
      isDefault: p.isDefault,
      order: p.order,
      published: p.published,
    });
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const method = editing ? "PUT" : "POST";
      const body = {
        slug: form.slug,
        name: form.name,
        colors: form.colors,
        fontPair: form.fontPair,
        design: form.design,
        mood: form.mood,
        isDefault: form.isDefault,
        order: form.order,
        published: form.published,
        ...(editing ? { id: editing.id } : {}),
      };
      const res = await apiFetch("/api/admin/theme", { method, body: JSON.stringify(body) });
      if (res.ok) { setShowForm(false); setEditing(null); loadData(); }
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this theme preset? Any visitor who currently has it saved will fall back to the default on their next visit.")) return;
    try {
      const res = await apiFetch(`/api/admin/theme?id=${id}`, { method: "DELETE" });
      if (res.ok) setPresets(presets.filter((p) => p.id !== id));
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="text-zinc-500">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-2xl font-semibold">Theme Presets</h3>
        <button onClick={openNew} className="flex items-center gap-2 bg-white text-black rounded-full px-4 py-2 text-sm font-medium hover:opacity-90">
          <Plus size={14} /> Add Preset
        </button>
      </div>
      <p className="text-sm text-zinc-500 mb-6">
        These are the color + font options visitors can toggle between on the live site (bottom-left palette button).
        Keep to color and font swaps only — this is meant to be a small, fun touch, not a way to change the site&apos;s layout or branding.
      </p>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#0D0D0D] border border-white/[0.06] rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-semibold">{editing ? "Edit" : "New"} Theme Preset</h4>
              <button onClick={() => setShowForm(false)} className="text-zinc-500 hover:text-white"><X size={18} /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Name *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="e.g. Violet Pop" className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50" />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Slug *</label>
                <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required placeholder="e.g. violet-pop" className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50" />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Font Pairing</label>
                <select
                  value={form.fontPair}
                  onChange={(e) => setForm({ ...form, fontPair: e.target.value })}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50"
                >
                  {FONT_PAIR_OPTIONS.map((f) => (
                    <option key={f.slug} value={f.slug} className="bg-[#0D0D0D]">{f.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Design Language (corner shape)</label>
                <select
                  value={form.design}
                  onChange={(e) => setForm({ ...form, design: e.target.value })}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50"
                >
                  {DESIGN_OPTIONS.map((d) => (
                    <option key={d.slug} value={d.slug} className="bg-[#0D0D0D]">{d.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Mood (full-page filter)</label>
                <select
                  value={form.mood}
                  onChange={(e) => setForm({ ...form, mood: e.target.value })}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50"
                >
                  {MOOD_OPTIONS.map((m) => (
                    <option key={m.slug} value={m.slug} className="bg-[#0D0D0D]">{m.label}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {THEME_COLOR_FIELDS.map((field) => (
                  <div key={field.key}>
                    <label className="block text-xs text-zinc-500 mb-1">{field.label}</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={form.colors[field.key] || "#000000"}
                        onChange={(e) => setForm({ ...form, colors: { ...form.colors, [field.key]: e.target.value } })}
                        className="h-9 w-9 shrink-0 cursor-pointer rounded-lg border border-white/[0.08] bg-transparent p-0.5"
                      />
                      <input
                        value={form.colors[field.key] || ""}
                        onChange={(e) => setForm({ ...form, colors: { ...form.colors, [field.key]: e.target.value } })}
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer">
                  <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Published
                </label>
                <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer">
                  <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} /> Default (what new visitors see)
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="flex items-center gap-2 bg-white text-black rounded-full px-6 py-2.5 text-sm font-medium hover:opacity-90 disabled:opacity-50">
                  {saving && <Loader2 size={14} className="animate-spin" />}
                  <Save size={14} /> {editing ? "Update" : "Create"}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="text-sm text-zinc-500 hover:text-white">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {presets.length === 0 && <p className="text-zinc-500">No presets yet — the palette toggle stays hidden on the live site until at least two exist.</p>}
        {presets
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((p) => (
            <div key={p.id} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 flex items-center justify-between group">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div
                  className={`h-10 w-10 shrink-0 border border-white/10 ${p.design === "sharp" ? "rounded-none" : p.design === "soft" ? "rounded-2xl" : "rounded-full"}`}
                  style={{ background: `linear-gradient(135deg, ${p.colors.orange || "#333"}, ${p.colors.yellow || "#666"})` }}
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium">{p.name}</p>
                    {p.isDefault && <span className="text-[0.55rem] font-medium uppercase tracking-wider text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">Default</span>}
                    {!p.published && <span className="text-[0.55rem] font-medium uppercase tracking-wider text-zinc-500 bg-zinc-500/10 px-2 py-0.5 rounded-full">Hidden</span>}
                  </div>
                  <p className="text-xs text-zinc-500">{p.slug} · {FONT_PAIR_OPTIONS.find((f) => f.slug === p.fontPair)?.label.split(" (")[0] || "Space Grotesk + Archivo"} · {DESIGN_OPTIONS.find((d) => d.slug === p.design)?.label.split(" (")[0] || "Signature"} · {MOOD_OPTIONS.find((m) => m.slug === p.mood)?.label.split(" (")[0] || "None"}</p>
                </div>
              </div>
              <div className="flex gap-1 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(p)} className="p-2 text-zinc-500 hover:text-blue-400"><FileText size={14} /></button>
                <button onClick={() => handleDelete(p.id)} className="p-2 text-zinc-500 hover:text-red-400"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

// === TEAM MANAGER ===

function TeamManager() {
  const [members, setMembers] = useState<TeamMemberItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<TeamMemberItem | null>(null);
  const [form, setForm] = useState({ name: "", role: "", bio: "", image: "", order: 0, published: false });
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const res = await apiFetch("/api/admin/team");
      const data = await res.json();
      setMembers(data.members || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const openNew = () => {
    setEditing(null);
    setForm({ name: "", role: "", bio: "", image: "", order: members.length, published: false });
    setShowForm(true);
  };

  const openEdit = (m: TeamMemberItem) => {
    setEditing(m);
    setForm({ name: m.name, role: m.role, bio: m.bio || "", image: m.image || "", order: m.order, published: m.published });
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const method = editing ? "PUT" : "POST";
      const body = { ...form, ...(editing ? { id: editing.id } : {}) };
      const res = await apiFetch("/api/admin/team", { method, body: JSON.stringify(body) });
      if (res.ok) { setShowForm(false); setEditing(null); loadData(); }
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this team member?")) return;
    try {
      const res = await apiFetch(`/api/admin/team?id=${id}`, { method: "DELETE" });
      if (res.ok) setMembers(members.filter((m) => m.id !== id));
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="text-zinc-500">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-semibold">Team</h3>
        <button onClick={openNew} className="flex items-center gap-2 bg-white text-black rounded-full px-4 py-2 text-sm font-medium hover:opacity-90">
          <Plus size={14} /> Add Team Member
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#0D0D0D] border border-white/[0.06] rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-semibold">{editing ? "Edit" : "New"} Team Member</h4>
              <button onClick={() => setShowForm(false)} className="text-zinc-500 hover:text-white"><X size={18} /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Photo</label>
                <FileUpload
                  value={form.image}
                  onChange={(url) => setForm({ ...form, image: url })}
                  folder="team"
                  kind="image"
                  accept="image/*"
                  label="Upload a photo"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Name *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50" />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Role / Title *</label>
                <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} required placeholder="e.g. Founder & CEO" className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50" />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Bio (optional)</label>
                <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50 resize-none" />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Display Order</label>
                <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value, 10) || 0 })} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none" />
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer">
                  <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Published
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="flex items-center gap-2 bg-white text-black rounded-full px-6 py-2.5 text-sm font-medium hover:opacity-90 disabled:opacity-50">
                  {saving && <Loader2 size={14} className="animate-spin" />}
                  <Save size={14} /> {editing ? "Update" : "Create"}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="text-sm text-zinc-500 hover:text-white">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.length === 0 && <p className="text-zinc-500 col-span-full">No team members yet — the About page shows placeholder team content until you add some here.</p>}
        {members
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((m) => (
            <div key={m.id} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 group">
              <div className="flex items-start gap-3 mb-3">
                {m.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <Image src={m.image} unoptimized alt={m.name} width={48} height={48} className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-white/[0.06] flex items-center justify-center text-sm font-medium text-zinc-500">
                    {m.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{m.name}</p>
                  <p className="text-xs text-zinc-500">{m.role}</p>
                  {!m.published && <span className="text-[0.55rem] font-medium uppercase tracking-wider text-zinc-500 bg-zinc-500/10 px-2 py-0.5 rounded-full mt-1 inline-block">Draft</span>}
                </div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                <button onClick={() => openEdit(m)} className="p-2 text-zinc-500 hover:text-blue-400"><FileText size={14} /></button>
                <button onClick={() => handleDelete(m.id)} className="p-2 text-zinc-500 hover:text-red-400"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

// === BLOGS MANAGER ===
function BlogsManager() {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<BlogItem | null>(null);
  const [form, setForm] = useState({ title: "", slug: "", excerpt: "", content: "", published: false, featured: false });
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const res = await apiFetch("/api/admin/blogs");
      const data = await res.json();
      setBlogs(data.blogs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const openNew = () => {
    setEditing(null);
    setForm({ title: "", slug: "", excerpt: "", content: "", published: false, featured: false });
    setShowForm(true);
  };

  const openEdit = (b: BlogItem) => {
    setEditing(b);
    setForm({ title: b.title, slug: b.slug, excerpt: b.excerpt || "", content: b.content, published: b.published, featured: b.featured });
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const method = editing ? "PUT" : "POST";
      const body = editing ? { ...form, id: editing.id } : { ...form, slug: form.slug || form.title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "") };
      const res = await apiFetch("/api/admin/blogs", { method, body: JSON.stringify(body) });
      if (res.ok) { setShowForm(false); setEditing(null); loadData(); }
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this blog post?")) return;
    try {
      const res = await apiFetch(`/api/admin/blogs?id=${id}`, { method: "DELETE" });
      if (res.ok) setBlogs(blogs.filter((b) => b.id !== id));
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="text-zinc-500">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-semibold">Blog Posts</h3>
        <button onClick={openNew} className="flex items-center gap-2 bg-white text-black rounded-full px-4 py-2 text-sm font-medium hover:opacity-90">
          <Plus size={14} /> Add Blog
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#0D0D0D] border border-white/[0.06] rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-semibold">{editing ? "Edit" : "New"} Blog Post</h4>
              <button onClick={() => setShowForm(false)} className="text-zinc-500 hover:text-white"><X size={18} /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Title *</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50" />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Slug</label>
                <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated" className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Excerpt</label>
                <textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={2} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none resize-none" />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Content * (HTML/Markdown)</label>
                <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required rows={6} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none font-mono text-xs" />
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer">
                  <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Published
                </label>
                <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer">
                  <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="flex items-center gap-2 bg-white text-black rounded-full px-6 py-2.5 text-sm font-medium hover:opacity-90 disabled:opacity-50">
                  {saving && <Loader2 size={14} className="animate-spin" />}
                  <Save size={14} /> {editing ? "Update" : "Create"}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="text-sm text-zinc-500 hover:text-white">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {blogs.length === 0 && <p className="text-zinc-500">No blog posts yet.</p>}
        {blogs.map((b) => (
          <div key={b.id} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 flex items-start justify-between group">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-medium">{b.title}</p>
                {b.published ? (
                  <span className="text-[0.55rem] font-medium uppercase tracking-wider text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">Published</span>
                ) : (
                  <span className="text-[0.55rem] font-medium uppercase tracking-wider text-zinc-500 bg-zinc-500/10 px-2 py-0.5 rounded-full">Draft</span>
                )}
              </div>
              <p className="text-xs text-zinc-500">{b.slug}{b.author ? ` · by ${b.author.name}` : ""}</p>
              {b.excerpt && <p className="text-sm text-zinc-400 mt-1 line-clamp-2">{b.excerpt}</p>}
            </div>
            <div className="flex gap-1 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => openEdit(b)} className="p-2 text-zinc-500 hover:text-blue-400"><FileText size={14} /></button>
              <button onClick={() => handleDelete(b.id)} className="p-2 text-zinc-500 hover:text-red-400"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// === LEADS VIEW ===
function LeadsView() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiFetch("/api/admin/leads");
        const data = await res.json();
        setLeads(data.leads || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return <div className="text-zinc-500">Loading...</div>;

  return (
    <div>
      <h3 className="text-2xl font-semibold mb-6">Leads ({leads.length})</h3>
      <div className="space-y-3">
        {leads.length === 0 && <p className="text-zinc-500">No leads yet.</p>}
        {leads.map((l) => (
          <div key={l.id} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-sm font-medium">{l.name}</p>
                <p className="text-xs text-zinc-500">{l.email}</p>
              </div>
              <span className={`text-[0.55rem] font-medium uppercase tracking-wider px-2 py-1 rounded-full ${
                l.status === "new" ? "bg-green-500/10 text-green-400" : "bg-zinc-500/10 text-zinc-400"
              }`}>
                {l.status}
              </span>
            </div>
            {l.company && <p className="text-xs text-zinc-500">Company: {l.company}</p>}
            {l.budget && <p className="text-xs text-zinc-500">Budget: {l.budget}</p>}
            {l.message && <p className="text-sm text-zinc-400 mt-2 line-clamp-3">{l.message}</p>}
            <p className="text-[0.55rem] text-zinc-600 mt-2">{new Date(l.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  LogOut, FileText, IndianRupee, Clock,
  Loader2, FolderOpen, RefreshCw, ArrowUpRight, CalendarDays, Layers3,
  MessageCircle, Sparkles,
} from "lucide-react";

interface ProjectUpdate {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string | null;
  marketContext: string | null;
  nextAction: string | null;
  clientPrompt: string | null;
  clientResponse: string | null;
  respondedAt: string | null;
  createdAt: string;
}
interface ProjectFile {
  id: string;
  name: string;
  url: string;
  createdAt: string;
}
interface Invoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  status: string;
  dueDate: string | null;
}
interface Project {
  id: string;
  name: string;
  description: string | null;
  status: string;
  startDate: string | null;
  dueDate: string | null;
  updates: ProjectUpdate[];
  files: ProjectFile[];
  invoices: Invoice[];
}

const STATUS_LABEL: Record<string, string> = {
  onboarding: "Onboarding",
  in_progress: "In Progress",
  review: "In Review",
  completed: "Completed",
};
function formatAmount(paise: number, currency: string) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency }).format(paise / 100);
}
function formatDate(dateStr: string | null) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function formatRelativeDate(dateStr: string) {
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return formatDate(dateStr);
}

function progressFor(status: string) {
  const progress: Record<string, number> = { onboarding: 15, in_progress: 55, review: 82, completed: 100 };
  return progress[status] ?? 0;
}

export default function PortalDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [client, setClient] = useState<{ name: string; email: string; company: string | null } | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [respondingTo, setRespondingTo] = useState<string | null>(null);
  const [responseText, setResponseText] = useState("");
  const [responseSaving, setResponseSaving] = useState(false);

  async function loadDashboard(showRefresh = false) {
    if (showRefresh) setRefreshing(true);
    try {
      const res = await fetch("/api/portal/me");
      if (res.status === 401) {
        window.location.href = "/portal/login";
        return;
      }
      const data = await res.json();
      setClient(data.client);
      setProjects(data.projects || []);
      setLastSynced(new Date());
    } catch {
      setError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    const initialLoad = window.setTimeout(() => loadDashboard(), 0);
    return () => window.clearTimeout(initialLoad);
  }, []);

  /* Keep the dashboard current during a workday without requiring a full reload. */
  useEffect(() => {
    const interval = window.setInterval(() => loadDashboard(), 900000);
    return () => window.clearInterval(interval);
  }, []);

  async function handleLogout() {
    await fetch("/api/portal/logout", { method: "POST" });
    window.location.href = "/";
  }

  async function handleResponse(updateId: string) {
    if (!responseText.trim()) return;
    setResponseSaving(true);
    try {
      const res = await fetch("/api/portal/updates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updateId, response: responseText }),
      });
      if (res.ok) {
        setRespondingTo(null);
        setResponseText("");
        await loadDashboard();
      }
    } finally {
      setResponseSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 bg-[var(--color-cream)]">
        <Loader2 size={24} className="animate-spin text-[var(--color-ink)]/50" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 text-center px-4 bg-[var(--color-cream)]">
        <p className="text-[var(--color-gray)]">Couldn&apos;t load your dashboard. Please try refreshing.</p>
      </div>
    );
  }

  const activeProjects = projects.filter((project) => project.status !== "completed").length;
  const updatesCount = projects.reduce((total, project) => total + project.updates.length, 0);
  const nextDeadline = projects
    .map((project) => project.dueDate)
    .filter((date): date is string => Boolean(date))
    .sort()[0] || null;

  return (
    <div className="min-h-screen bg-[var(--color-cream)] px-4 pb-20 pt-28 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="font-display text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-orange)]">Client workspace</p>
            <h1 className="mt-2 font-display text-3xl font-black uppercase leading-none text-[var(--color-ink)] sm:text-5xl">Welcome back, {client?.name?.split(" ")[0]}</h1>
            <p className="mt-3 text-sm text-[var(--color-gray)]">Your projects, progress, and latest updates in one place.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-[var(--color-gray)] sm:inline">{lastSynced ? `Updated ${lastSynced.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })}` : ""}</span>
            <button onClick={() => loadDashboard(true)} disabled={refreshing} className="flex items-center gap-2 rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-paper)] px-4 py-2 text-xs font-bold text-[var(--color-ink)] transition-colors hover:bg-[var(--color-yellow)] disabled:opacity-50">
              <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} /> Refresh
            </button>
            <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-[var(--color-gray)] transition-colors hover:text-[var(--color-orange)]">
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </header>

        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Active projects", value: activeProjects, icon: Layers3 },
            { label: "Updates available", value: updatesCount, icon: MessageCircle },
            { label: "Next deadline", value: nextDeadline ? formatDate(nextDeadline) : "—", icon: CalendarDays },
            { label: "Account", value: client?.company || "Client", icon: Sparkles },
          ].map((stat) => (
            <div key={stat.label} className="border-2 border-[var(--color-ink)] bg-[var(--color-paper)] p-4 shadow-[4px_4px_0_0_#141414]">
              <stat.icon size={17} className="mb-5 text-[var(--color-orange)]" />
              <p className="font-display text-xl font-black text-[var(--color-ink)] sm:text-2xl">{stat.value}</p>
              <p className="mt-1 text-[0.65rem] font-bold uppercase tracking-wide text-[var(--color-gray)]">{stat.label}</p>
            </div>
          ))}
        </div>

        {projects.length === 0 ? (
          <div className="rounded-2xl border-2 border-[var(--color-ink)] bg-[var(--color-paper)] p-12 text-center shadow-neo-sm">
            <FolderOpen size={28} className="mx-auto mb-4 text-[var(--color-ink)]/30" />
            <p className="text-[var(--color-gray)]">No projects yet. Your NexScope team will add one here once your project kicks off.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {projects.map((project, i) => {
              const progress = progressFor(project.status);
              const latestUpdate = project.updates[0];
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="overflow-hidden rounded-2xl border-2 border-[var(--color-ink)] bg-[var(--color-paper)] shadow-neo-md"
                >
                  <div className="border-b-2 border-[var(--color-ink)] bg-[var(--color-ink)] p-6 text-[var(--color-cream)] sm:p-8">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="font-display text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-yellow)]">Project {String(i + 1).padStart(2, "0")}</p>
                        <h2 className="mt-2 font-display text-2xl font-black uppercase sm:text-4xl">{project.name}</h2>
                        {project.description && <p className="mt-2 max-w-2xl text-sm text-[var(--color-cream)]/65">{project.description}</p>}
                      </div>
                      <span className="rounded-full border-2 border-[var(--color-yellow)] px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-wide text-[var(--color-yellow)]">{STATUS_LABEL[project.status] || project.status}</span>
                    </div>
                    <div className="mt-8 flex items-end justify-between gap-4">
                      <div className="flex-1">
                        <div className="mb-2 flex justify-between text-xs font-bold uppercase tracking-wide text-[var(--color-cream)]/60"><span>Project progress</span><span>{progress}%</span></div>
                        <div className="h-3 overflow-hidden rounded-full border border-[var(--color-cream)]/20 bg-[var(--color-cream)]/10"><div className="h-full rounded-full bg-[var(--color-orange)] transition-all" style={{ width: `${progress}%` }} /></div>
                      </div>
                    </div>
                    <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs text-[var(--color-cream)]/55"><span>Started: {formatDate(project.startDate)}</span><span>Due: {formatDate(project.dueDate)}</span></div>
                  </div>

                  {latestUpdate && (
                    <div className="border-b-2 border-[var(--color-ink)]/10 bg-[var(--color-yellow)] p-5 sm:p-6">
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-orange)] text-[var(--color-cream)]"><Sparkles size={14} /></span>
                        <div><p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-[var(--color-ink)]/60">Latest project update · {formatRelativeDate(latestUpdate.createdAt)}</p><h3 className="mt-1 font-display text-lg font-black text-[var(--color-ink)]">{latestUpdate.title}</h3>{latestUpdate.description && <p className="mt-1 text-sm leading-relaxed text-[var(--color-ink)]/70">{latestUpdate.description}</p>}</div>
                      </div>
                      {latestUpdate.videoUrl && <video className="mt-5 aspect-video w-full rounded-xl border-2 border-[var(--color-ink)] object-cover" controls preload="metadata" src={latestUpdate.videoUrl} />}
                      <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        {latestUpdate.marketContext && <div className="border-l-4 border-[var(--color-orange)] pl-3"><p className="text-[0.6rem] font-bold uppercase tracking-wide text-[var(--color-ink)]/55">Market context</p><p className="mt-1 text-sm leading-relaxed text-[var(--color-ink)]/75">{latestUpdate.marketContext}</p></div>}
                        {latestUpdate.nextAction && <div className="border-l-4 border-[var(--color-ink)] pl-3"><p className="text-[0.6rem] font-bold uppercase tracking-wide text-[var(--color-ink)]/55">What happens next</p><p className="mt-1 text-sm leading-relaxed text-[var(--color-ink)]/75">{latestUpdate.nextAction}</p></div>}
                      </div>
                      {latestUpdate.clientPrompt && <div className="mt-5 rounded-xl border-2 border-[var(--color-ink)] bg-[var(--color-cream)] p-4"><p className="text-[0.6rem] font-bold uppercase tracking-wide text-[var(--color-orange)]">Your input needed</p><p className="mt-1 text-sm font-semibold text-[var(--color-ink)]">{latestUpdate.clientPrompt}</p>{latestUpdate.clientResponse ? <p className="mt-3 text-xs text-[var(--color-gray)]">Your response: {latestUpdate.clientResponse}</p> : respondingTo === latestUpdate.id ? <div className="mt-3 space-y-2"><textarea value={responseText} onChange={(e) => setResponseText(e.target.value)} rows={3} placeholder="Share your preference or feedback..." className="w-full rounded-lg border-2 border-[var(--color-ink)]/15 bg-white px-3 py-2 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-orange)]" /><button type="button" onClick={() => handleResponse(latestUpdate.id)} disabled={responseSaving || !responseText.trim()} className="rounded-full bg-[var(--color-ink)] px-4 py-2 text-xs font-bold text-[var(--color-cream)] disabled:opacity-50">{responseSaving ? "Sending..." : "Send response"}</button></div> : <button type="button" onClick={() => setRespondingTo(latestUpdate.id)} className="mt-3 rounded-full border-2 border-[var(--color-ink)] px-4 py-2 text-xs font-bold text-[var(--color-ink)] hover:bg-[var(--color-yellow)]">Share your input</button>}</div>}
                    </div>
                  )}

                  <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="border-b-2 border-[var(--color-ink)]/10 p-6 lg:border-b-0 lg:border-r-2 sm:p-8">
                      <h3 className="mb-5 flex items-center gap-2 font-display text-xs font-bold uppercase tracking-wide text-[var(--color-ink)]/60"><Clock size={13} /> Update timeline</h3>
                      {project.updates.length === 0 ? <p className="text-sm text-[var(--color-ink)]/40">Your daily updates will appear here.</p> : <div className="space-y-5">{project.updates.map((u) => <div key={u.id} className="relative flex gap-3 pl-1"><div className="mt-1.5 size-2 shrink-0 rounded-full bg-[var(--color-orange)]" /><div><p className="text-sm font-semibold text-[var(--color-ink)]">{u.title}</p>{u.description && <p className="mt-1 text-xs leading-relaxed text-[var(--color-gray)]">{u.description}</p>}<p className="mt-1 text-[0.65rem] text-[var(--color-ink)]/40">{formatDate(u.createdAt)}</p></div></div>)}</div>}
                    </div>

                    <div className="space-y-8 p-6 sm:p-8">
                      <div>
                        <h3 className="mb-4 flex items-center gap-2 font-display text-xs font-bold uppercase tracking-wide text-[var(--color-ink)]/60"><FileText size={13} /> Shared files</h3>
                        {project.files.length === 0 ? <p className="text-sm text-[var(--color-ink)]/40">No files shared yet.</p> : <div className="space-y-2">{project.files.slice(0, 3).map((f) => <a key={f.id} href={f.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-3 rounded-lg border-2 border-[var(--color-ink)]/10 bg-[var(--color-cream)] px-3 py-2.5 text-sm transition-colors hover:border-[var(--color-orange)]"><span className="truncate text-[var(--color-ink)]">{f.name}</span><ArrowUpRight size={14} className="shrink-0 text-[var(--color-gray)]" /></a>)}</div>}
                      </div>
                      <div>
                        <h3 className="mb-4 flex items-center gap-2 font-display text-xs font-bold uppercase tracking-wide text-[var(--color-ink)]/60"><IndianRupee size={13} /> Billing</h3>
                        {project.invoices.length === 0 ? <p className="text-sm text-[var(--color-ink)]/40">No invoices yet.</p> : <div className="space-y-2">{project.invoices.slice(0, 3).map((inv) => <div key={inv.id} className="flex items-center justify-between gap-3 rounded-lg border-2 border-[var(--color-ink)]/10 bg-[var(--color-cream)] px-3 py-2.5 text-sm"><span className="truncate text-[var(--color-ink)]">{inv.invoiceNumber}</span><span className="shrink-0 font-bold text-[var(--color-ink)]">{formatAmount(inv.amount, inv.currency)}</span></div>)}</div>}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

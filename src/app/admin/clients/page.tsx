"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import {
  Plus, X, Save, Loader2, ArrowLeft, Trash2, ChevronRight, Building2,
  Mail, Phone, FolderPlus,
} from "lucide-react";

// Same auth-guard and authenticated-fetch pattern as /admin — kept
// identical on purpose so both admin pages behave consistently.
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

interface ClientItem {
  id: string;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  status: string;
  source: string;
  createdAt: string;
  projects: { id: string; name: string; status: string }[];
}

interface ProjectItem {
  id: string;
  clientId: string;
  name: string;
  description: string | null;
  status: string;
  startDate: string | null;
  dueDate: string | null;
  updates: { id: string; title: string; description: string | null; videoUrl: string | null; marketContext: string | null; nextAction: string | null; clientPrompt: string | null; createdAt: string }[];
  files: { id: string; name: string; url: string }[];
  invoices: { id: string; invoiceNumber: string; amount: number; status: string }[];
}

const PROJECT_STATUSES = ["onboarding", "in_progress", "review", "completed"];

export default function AdminClientsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [clients, setClients] = useState<ClientItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);

  const [showClientForm, setShowClientForm] = useState(false);
  const [clientForm, setClientForm] = useState({ name: "", email: "", company: "", phone: "", password: "" });
  const [savingClient, setSavingClient] = useState(false);

  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projectForm, setProjectForm] = useState({ name: "", description: "", status: "onboarding", startDate: "", dueDate: "" });
  const [savingProject, setSavingProject] = useState(false);

  const [updateFormFor, setUpdateFormFor] = useState<string | null>(null);
  const [updateForm, setUpdateForm] = useState({ title: "", description: "", videoUrl: "", marketContext: "", nextAction: "", clientPrompt: "" });
  const [updateError, setUpdateError] = useState("");
  const [postingUpdate, setPostingUpdate] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/admin/login");
        return;
      }
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const loadClients = useCallback(async () => {
    try {
      const res = await apiFetch("/api/admin/clients");
      const data = await res.json();
      setClients(data.clients || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = user ? window.setTimeout(() => loadClients(), 0) : undefined;
    return () => { if (timer) window.clearTimeout(timer); };
  }, [user, loadClients]);

  const loadProjects = useCallback(async (clientId: string) => {
    setProjectsLoading(true);
    try {
      const res = await apiFetch(`/api/admin/projects?clientId=${clientId}`);
      const data = await res.json();
      setProjects(data.projects || []);
    } catch (err) {
      console.error(err);
    } finally {
      setProjectsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = selectedClientId ? window.setTimeout(() => loadProjects(selectedClientId), 0) : undefined;
    return () => { if (timer) window.clearTimeout(timer); };
  }, [selectedClientId, loadProjects]);

  async function handleCreateClient(e: React.FormEvent) {
    e.preventDefault();
    setSavingClient(true);
    try {
      const res = await apiFetch("/api/admin/clients", { method: "POST", body: JSON.stringify(clientForm) });
      const data = await res.json();
      if (res.ok) {
        setShowClientForm(false);
        setClientForm({ name: "", email: "", company: "", phone: "", password: "" });
        loadClients();
      } else {
        alert(data.message || "Failed to create client");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingClient(false);
    }
  }

  async function handleDeleteClient(id: string) {
    if (!confirm("Delete this client? This also deletes their projects, files, and invoices.")) return;
    try {
      const res = await apiFetch(`/api/admin/clients?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setClients(clients.filter((c) => c.id !== id));
        if (selectedClientId === id) setSelectedClientId(null);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleCreateProject(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedClientId) return;
    setSavingProject(true);
    try {
      const res = await apiFetch("/api/admin/projects", {
        method: "POST",
        body: JSON.stringify({ clientId: selectedClientId, ...projectForm }),
      });
      if (res.ok) {
        setShowProjectForm(false);
        setProjectForm({ name: "", description: "", status: "onboarding", startDate: "", dueDate: "" });
        loadProjects(selectedClientId);
        loadClients();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingProject(false);
    }
  }

  async function handleProjectStatusChange(project: ProjectItem, status: string) {
    try {
      const res = await apiFetch("/api/admin/projects", {
        method: "PUT",
        body: JSON.stringify({ id: project.id, name: project.name, description: project.description, status, startDate: project.startDate, dueDate: project.dueDate }),
      });
      if (res.ok && selectedClientId) loadProjects(selectedClientId);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDeleteProject(id: string) {
    if (!confirm("Delete this project and all its updates/files/invoices?")) return;
    try {
      const res = await apiFetch(`/api/admin/projects?id=${id}`, { method: "DELETE" });
      if (res.ok && selectedClientId) loadProjects(selectedClientId);
    } catch (err) {
      console.error(err);
    }
  }

  async function handlePostUpdate(projectId: string) {
    if (!updateForm.title.trim() || postingUpdate) return;
    setPostingUpdate(true);
    setUpdateError("");
    try {
      const res = await apiFetch("/api/admin/project-updates", {
        method: "POST",
        body: JSON.stringify({ projectId, ...updateForm }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setUpdateForm({ title: "", description: "", videoUrl: "", marketContext: "", nextAction: "", clientPrompt: "" });
        setUpdateFormFor(null);
        if (selectedClientId) loadProjects(selectedClientId);
      } else {
        setUpdateError(data.message || "The update could not be posted. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setUpdateError("Could not reach the server. Please check your connection and try again.");
    } finally {
      setPostingUpdate(false);
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-white/10 border-t-white rounded-full" />
      </div>
    );
  }

  const selectedClient = clients.find((c) => c.id === selectedClientId);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pt-8 pb-20 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <a href="/admin" className="text-zinc-500 hover:text-white transition-colors">
          <ArrowLeft size={18} />
        </a>
        <h1 className="text-2xl font-semibold">Client Portal — Clients</h1>
      </div>

      {!selectedClientId ? (
        <>
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-zinc-500">{clients.length} client{clients.length !== 1 ? "s" : ""}</p>
            <button
              onClick={() => setShowClientForm(true)}
              className="flex items-center gap-2 bg-white text-black rounded-full px-4 py-2 text-sm font-medium hover:opacity-90"
            >
              <Plus size={14} /> Add Client
            </button>
          </div>

          {loading ? (
            <div className="text-zinc-500">Loading...</div>
          ) : clients.length === 0 ? (
            <p className="text-zinc-500">No clients yet. Add one to give them portal access.</p>
          ) : (
            <div className="space-y-3">
              {clients.map((c) => (
                <div
                  key={c.id}
                  className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 flex items-center justify-between group cursor-pointer hover:border-white/[0.12] transition-colors"
                  onClick={() => setSelectedClientId(c.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium">{c.name}</p>
                      {c.source === "signup" && (
                        <span className="text-[0.55rem] font-medium uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">
                          Self-signup
                        </span>
                      )}
                      {c.status !== "active" && (
                        <span className="text-[0.55rem] font-medium uppercase tracking-wider text-zinc-500 bg-zinc-500/10 px-2 py-0.5 rounded-full">
                          Inactive
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-500 flex items-center gap-3 flex-wrap">
                      <span className="flex items-center gap-1"><Mail size={11} /> {c.email}</span>
                      {c.company && <span className="flex items-center gap-1"><Building2 size={11} /> {c.company}</span>}
                      <span>{c.projects.length} project{c.projects.length !== 1 ? "s" : ""}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteClient(c.id); }}
                      className="p-2 text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={14} />
                    </button>
                    <ChevronRight size={16} className="text-zinc-600" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <div>
              <button
                onClick={() => setSelectedClientId(null)}
                className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white transition-colors mb-2"
              >
                <ArrowLeft size={12} /> All clients
              </button>
              <h2 className="text-xl font-semibold">{selectedClient?.name}</h2>
              <p className="text-xs text-zinc-500 flex items-center gap-3 mt-1">
                <span className="flex items-center gap-1"><Mail size={11} /> {selectedClient?.email}</span>
                {selectedClient?.phone && <span className="flex items-center gap-1"><Phone size={11} /> {selectedClient.phone}</span>}
              </p>
            </div>
            <button
              onClick={() => setShowProjectForm(true)}
              className="flex items-center gap-2 bg-white text-black rounded-full px-4 py-2 text-sm font-medium hover:opacity-90"
            >
              <FolderPlus size={14} /> Add Project
            </button>
          </div>

          {projectsLoading ? (
            <div className="text-zinc-500">Loading projects...</div>
          ) : projects.length === 0 ? (
            <p className="text-zinc-500">No projects yet for this client.</p>
          ) : (
            <div className="space-y-4">
              {projects.map((p) => (
                <div key={p.id} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-medium">{p.name}</p>
                      {p.description && <p className="text-xs text-zinc-500 mt-1">{p.description}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={p.status}
                        onChange={(e) => handleProjectStatusChange(p, e.target.value)}
                        className="bg-white/[0.04] border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                      >
                        {PROJECT_STATUSES.map((s) => (
                          <option key={s} value={s}>{s.replace("_", " ")}</option>
                        ))}
                      </select>
                      <button onClick={() => handleDeleteProject(p.id)} className="p-1.5 text-zinc-600 hover:text-red-400">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <div className="text-xs text-zinc-500 mb-3">
                    {p.updates.length} update{p.updates.length !== 1 ? "s" : ""} · {p.files.length} file{p.files.length !== 1 ? "s" : ""} · {p.invoices.length} invoice{p.invoices.length !== 1 ? "s" : ""}
                  </div>

                  {updateFormFor === p.id ? (
                    <div className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-3 space-y-2">
                      {updateError && <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">{updateError}</p>}
                      <input
                        value={updateForm.title}
                        onChange={(e) => setUpdateForm({ ...updateForm, title: e.target.value })}
                        placeholder="Update title (e.g. 'Design phase complete')"
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                      />
                      <textarea
                        value={updateForm.description}
                        onChange={(e) => setUpdateForm({ ...updateForm, description: e.target.value })}
                        placeholder="Optional details"
                        rows={2}
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white focus:outline-none resize-none"
                      />
                      <input
                        type="url"
                        value={updateForm.videoUrl}
                        onChange={(e) => setUpdateForm({ ...updateForm, videoUrl: e.target.value })}
                        placeholder="Working video URL (optional .mp4/.webm)"
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                      />
                      <textarea
                        value={updateForm.marketContext}
                        onChange={(e) => setUpdateForm({ ...updateForm, marketContext: e.target.value })}
                        placeholder="Market context: what changed or what we learned"
                        rows={2}
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white focus:outline-none resize-none"
                      />
                      <textarea
                        value={updateForm.nextAction}
                        onChange={(e) => setUpdateForm({ ...updateForm, nextAction: e.target.value })}
                        placeholder="Next action: what the team will do next"
                        rows={2}
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white focus:outline-none resize-none"
                      />
                      <textarea
                        value={updateForm.clientPrompt}
                        onChange={(e) => setUpdateForm({ ...updateForm, clientPrompt: e.target.value })}
                        placeholder="Ask the client for a decision (e.g. choose a palette direction)"
                        rows={2}
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white focus:outline-none resize-none"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handlePostUpdate(p.id)}
                          disabled={postingUpdate || !updateForm.title.trim()}
                          className="text-xs bg-white text-black rounded-full px-3 py-1.5 font-medium disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {postingUpdate ? "Posting..." : "Post"}
                        </button>
                        <button
                          onClick={() => { setUpdateFormFor(null); setUpdateForm({ title: "", description: "", videoUrl: "", marketContext: "", nextAction: "", clientPrompt: "" }); }}
                          className="text-xs text-zinc-500 hover:text-white"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setUpdateFormFor(p.id)}
                      className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      + Post an update
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* New client modal */}
      {showClientForm && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#0D0D0D] border border-white/[0.06] rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-semibold">New Client</h4>
              <button onClick={() => setShowClientForm(false)} className="text-zinc-500 hover:text-white"><X size={18} /></button>
            </div>
            <form onSubmit={handleCreateClient} className="space-y-4">
              <input
                value={clientForm.name}
                onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })}
                placeholder="Full name"
                required
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50"
              />
              <input
                type="email"
                value={clientForm.email}
                onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                placeholder="Email"
                required
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50"
              />
              <input
                value={clientForm.company}
                onChange={(e) => setClientForm({ ...clientForm, company: e.target.value })}
                placeholder="Company (optional)"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50"
              />
              <input
                value={clientForm.phone}
                onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })}
                placeholder="Phone (optional)"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50"
              />
              <div>
                <input
                  type="text"
                  value={clientForm.password}
                  onChange={(e) => setClientForm({ ...clientForm, password: e.target.value })}
                  placeholder="Temporary password (min. 8 characters)"
                  required
                  minLength={8}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50"
                />
                <p className="text-[0.65rem] text-zinc-600 mt-1.5">
                  Share this with the client directly — they can change it after logging in via &quot;Forgot password.&quot;
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={savingClient}
                  className="flex items-center gap-2 bg-white text-black rounded-full px-6 py-2.5 text-sm font-medium hover:opacity-90 disabled:opacity-50"
                >
                  {savingClient && <Loader2 size={14} className="animate-spin" />}
                  <Save size={14} /> Create Client
                </button>
                <button type="button" onClick={() => setShowClientForm(false)} className="text-sm text-zinc-500 hover:text-white">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New project modal */}
      {showProjectForm && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#0D0D0D] border border-white/[0.06] rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-semibold">New Project for {selectedClient?.name}</h4>
              <button onClick={() => setShowProjectForm(false)} className="text-zinc-500 hover:text-white"><X size={18} /></button>
            </div>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <input
                value={projectForm.name}
                onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                placeholder="Project name"
                required
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50"
              />
              <textarea
                value={projectForm.description}
                onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                placeholder="Short description (optional)"
                rows={2}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50 resize-none"
              />
              <select
                value={projectForm.status}
                onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
              >
                {PROJECT_STATUSES.map((s) => (
                  <option key={s} value={s}>{s.replace("_", " ")}</option>
                ))}
              </select>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[0.65rem] text-zinc-500 mb-1">Start date</label>
                  <input
                    type="date"
                    value={projectForm.startDate}
                    onChange={(e) => setProjectForm({ ...projectForm, startDate: e.target.value })}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[0.65rem] text-zinc-500 mb-1">Due date</label>
                  <input
                    type="date"
                    value={projectForm.dueDate}
                    onChange={(e) => setProjectForm({ ...projectForm, dueDate: e.target.value })}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={savingProject}
                  className="flex items-center gap-2 bg-white text-black rounded-full px-6 py-2.5 text-sm font-medium hover:opacity-90 disabled:opacity-50"
                >
                  {savingProject && <Loader2 size={14} className="animate-spin" />}
                  <Save size={14} /> Create Project
                </button>
                <button type="button" onClick={() => setShowProjectForm(false)} className="text-sm text-zinc-500 hover:text-white">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

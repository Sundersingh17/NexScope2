"use client";

import { useRef, useState } from "react";
import { auth } from "@/lib/firebase";
import { Loader2, Upload, X, ImageIcon, Video } from "lucide-react";

interface FileUploadProps {
  value: string; // current URL, empty string if none
  onChange: (url: string) => void;
  folder: string; // "team" | "portfolio" | "blog" | "testimonials" — organizes the Blob store
  accept?: string; // defaults to images + video
  label?: string;
  kind?: "image" | "video";
}

/**
 * Drop-in upload control for any admin form. Handles the request to
 * /api/admin/upload itself (auth token, FormData, error states) so
 * individual admin tabs just need <FileUpload value={} onChange={} folder="" />.
 */
export function FileUpload({
  value,
  onChange,
  folder,
  accept = "image/*,video/mp4,video/webm,video/quicktime",
  label = "Upload file",
  kind = "image",
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setUploading(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Upload failed");
        return;
      }
      onChange(data.url);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-white/[0.08] bg-white/[0.02]">
          {kind === "video" ? (
            <video src={value} controls className="w-full max-h-48 object-contain bg-black" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="Uploaded" className="w-full max-h-48 object-cover" />
          )}
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 bg-black/70 hover:bg-black/90 text-white rounded-full p-1.5 transition-colors"
            aria-label="Remove"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full flex flex-col items-center justify-center gap-2 border border-dashed border-white/[0.12] rounded-xl py-8 text-zinc-500 hover:border-white/25 hover:text-zinc-300 transition-colors disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : kind === "video" ? (
            <Video size={20} />
          ) : (
            <ImageIcon size={20} />
          )}
          <span className="text-xs">{uploading ? "Uploading..." : label}</span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />
      {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
    </div>
  );
}

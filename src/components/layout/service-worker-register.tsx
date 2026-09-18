"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV !== "production") return; // avoid caching interfering with dev hot-reload
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);

  return null;
}

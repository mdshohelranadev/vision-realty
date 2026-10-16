"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";

/** Rehydrates the persisted store from localStorage after mount (avoids SSR mismatch). */
export function Hydrator() {
  useEffect(() => {
    useStore.persist.rehydrate();
    // If nothing was stored yet, onRehydrateStorage still fires; this is a safety net.
    const t = window.setTimeout(() => useStore.getState().setHydrated(true), 0);
    return () => window.clearTimeout(t);
  }, []);
  return null;
}

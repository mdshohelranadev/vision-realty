"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Search, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { StatusBadge } from "@/components/ui/badge";

export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const projects = useStore((s) => s.projects);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    const t = window.setTimeout(() => inputRef.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return projects.slice(0, 5);
    return projects
      .filter((p) => `${p.name} ${p.location} ${p.area} ${p.city}`.toLowerCase().includes(q))
      .slice(0, 8);
  }, [projects, query]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-start justify-center bg-slate-950/60 px-4 pt-[12vh] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Search projects"
        >
          <motion.div
            className="w-full max-w-xl overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-lift dark:border-slate-800 dark:bg-slate-900"
            initial={{ y: -16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -16, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-slate-100 px-4 dark:border-slate-800">
              <Search className="h-5 w-5 text-slate-400" aria-hidden />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by project name or location"
                aria-label="Search projects"
                className="h-14 flex-1 bg-transparent text-base outline-none placeholder:text-slate-400 focus-visible:ring-0"
              />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close search"
                className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <ul className="max-h-[50vh] overflow-y-auto p-2">
              {results.length === 0 && (
                <li className="px-4 py-10 text-center text-sm text-slate-500">
                  No projects match your search.
                </li>
              )}
              {results.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/projects/${p.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-3 rounded-lg p-2 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <span className="relative h-14 w-20 shrink-0 overflow-hidden rounded-md bg-slate-100">
                      <Image src={p.image} alt="" fill sizes="80px" className="object-cover" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-serif text-base font-semibold">
                        {p.name}
                      </span>
                      <span className="flex items-center gap-1 truncate text-xs text-slate-500">
                        <MapPin className="h-3 w-3 shrink-0" aria-hidden />
                        {p.area}, {p.city}
                      </span>
                    </span>
                    <StatusBadge category={p.category} />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

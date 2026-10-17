"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Building2, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { EmptyState } from "@/components/EmptyState";
import { StatusBadge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";

export default function AdminProjectsPage() {
  const projects = useStore((s) => s.projects);
  const hydrated = useStore((s) => s.hydrated);
  const deleteProject = useStore((s) => s.deleteProject);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [toDelete, setToDelete] = useState<Project | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (!q) return true;
      return `${p.name} ${p.location} ${p.status}`.toLowerCase().includes(q);
    });
  }, [projects, query, category]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          <div className="relative sm:max-w-xs sm:flex-1">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden
            />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects"
              aria-label="Search projects"
              className="pl-10"
            />
          </div>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Filter by category"
            className="sm:w-44"
          >
            <option value="all">All categories</option>
            <option value="complete">Complete</option>
            <option value="ongoing">Ongoing</option>
            <option value="upcoming">Upcoming</option>
          </Select>
        </div>
        <Link href="/admin/projects/new" className={cn(buttonVariants({ variant: "primary" }))}>
          <Plus className="h-4 w-4" aria-hidden />
          New Project
        </Link>
      </div>

      <div className="card-base shadow-soft">
        {!hydrated ? (
          <div className="space-y-3 p-5" role="status" aria-label="Loading projects">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton h-14 w-full" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-5">
            <EmptyState
              icon={Building2}
              title="No projects found"
              description="Adjust your search or filter, or add a new project."
            />
          </div>
        ) : (
          <>
          <ul className="divide-y divide-slate-100 dark:divide-slate-800 md:hidden">
            {filtered.map((p) => (
              <li key={p.id} className="p-4">
                <div className="flex gap-3">
                  <span className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
                    <Image src={p.image} alt="" fill sizes="96px" className="object-cover" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-serif text-base font-semibold">{p.name}</p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
                      {p.location}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <StatusBadge category={p.category} />
                      <span className="text-xs text-slate-500 dark:text-slate-400">{p.status}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <Link
                    href={`/admin/projects/edit/${p.id}`}
                    className={cn(buttonVariants({ variant: "outline", size: "md" }), "w-full")}
                  >
                    <Pencil className="h-4 w-4" aria-hidden />
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => setToDelete(p)}
                    className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-red-200 text-sm font-semibold text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-900/30"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden />
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-900">
                <tr>
                  <th className="px-5 py-3 font-semibold">Project</th>
                  <th className="px-5 py-3 font-semibold">Category</th>
                  <th className="px-5 py-3 font-semibold">Location</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-900/60">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <span className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md bg-slate-100 dark:bg-slate-800">
                          <Image src={p.image} alt="" fill sizes="64px" className="object-cover" />
                        </span>
                        <span className="font-serif text-base font-semibold">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge category={p.category} />
                    </td>
                    <td className="max-w-[260px] px-5 py-3 text-slate-600 dark:text-slate-400">
                      <span className="line-clamp-2">{p.location}</span>
                    </td>
                    <td className="px-5 py-3 text-slate-600 dark:text-slate-400">{p.status}</td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-1">
                        <Link
                          href={`/admin/projects/edit/${p.id}`}
                          aria-label={`Edit ${p.name}`}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-primary-50 hover:text-primary dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                          <Pencil className="h-4 w-4" aria-hidden />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setToDelete(p)}
                          aria-label={`Delete ${p.name}`}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-red-50 hover:text-red-600 dark:text-slate-300 dark:hover:bg-red-900/30"
                        >
                          <Trash2 className="h-4 w-4" aria-hidden />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </>
        )}
      </div>

      <ConfirmDialog
        open={!!toDelete}
        title="Delete this project?"
        description={`${toDelete?.name ?? "This project"} will be permanently removed from the website. This cannot be undone.`}
        onCancel={() => setToDelete(null)}
        onConfirm={() => {
          if (toDelete) deleteProject(toDelete.id);
          setToDelete(null);
        }}
      />
    </div>
  );
}

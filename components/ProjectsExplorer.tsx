"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Building2 } from "lucide-react";
import { ProjectCard, ProjectCardSkeleton } from "@/components/ProjectCard";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/input";
import { useStore } from "@/lib/store";
import { LOCATIONS } from "@/lib/site";
import { cn } from "@/lib/utils";

const tabs = [
  { key: "all", label: "All" },
  { key: "complete", label: "Complete" },
  { key: "ongoing", label: "Ongoing" },
  { key: "upcoming", label: "Upcoming" },
] as const;

type TabKey = (typeof tabs)[number]["key"];

function isTab(v: string | null): v is TabKey {
  return v === "all" || v === "complete" || v === "ongoing" || v === "upcoming";
}

export function ProjectsExplorer() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const projects = useStore((s) => s.projects);
  const hydrated = useStore((s) => s.hydrated);

  const tabParam = params.get("tab");
  const tab: TabKey = isTab(tabParam) ? tabParam : "all";
  const location = params.get("location") ?? "all";
  const sort = params.get("sort") === "name" ? "name" : "newest";

  const update = useCallback(
    (patch: Record<string, string>) => {
      const next = new URLSearchParams(params.toString());
      Object.entries(patch).forEach(([k, v]) => {
        if (v === "all" || (k === "sort" && v === "newest")) next.delete(k);
        else next.set(k, v);
      });
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [params, pathname, router]
  );

  const counts = useMemo(
    () => ({
      all: projects.length,
      complete: projects.filter((p) => p.category === "complete").length,
      ongoing: projects.filter((p) => p.category === "ongoing").length,
      upcoming: projects.filter((p) => p.category === "upcoming").length,
    }),
    [projects]
  );

  const filtered = useMemo(() => {
    let list = projects.filter((p) => tab === "all" || p.category === tab);
    if (location !== "all") {
      const q = location.toLowerCase();
      list = list.filter((p) => `${p.location} ${p.area} ${p.city}`.toLowerCase().includes(q));
    }
    return [...list].sort((a, b) =>
      sort === "name" ? a.name.localeCompare(b.name) : b.createdAt.localeCompare(a.createdAt)
    );
  }, [projects, tab, location, sort]);

  return (
    <section className="section pt-10 sm:pt-12">
      <div className="container">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div
            role="tablist"
            aria-label="Filter by status"
            className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1"
          >
            {tabs.map((t) => (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={tab === t.key}
                onClick={() => update({ tab: t.key })}
                className={cn(
                  "inline-flex shrink-0 items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors",
                  tab === t.key
                    ? "border-primary bg-primary text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:border-primary hover:text-primary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-accent dark:hover:text-accent"
                )}
              >
                {t.label}
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs",
                    tab === t.key ? "bg-white/20" : "bg-slate-100 dark:bg-slate-800"
                  )}
                >
                  {counts[t.key]}
                </span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 sm:flex">
            <div className="sm:w-52">
              <label htmlFor="filter-location" className="sr-only">
                Location
              </label>
              <Select
                id="filter-location"
                value={location}
                onChange={(e) => update({ location: e.target.value })}
              >
                <option value="all">All locations</option>
                {LOCATIONS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </Select>
            </div>
            <div className="sm:w-44">
              <label htmlFor="filter-sort" className="sr-only">
                Sort by
              </label>
              <Select id="filter-sort" value={sort} onChange={(e) => update({ sort: e.target.value })}>
                <option value="newest">Newest first</option>
                <option value="name">Name (A-Z)</option>
              </Select>
            </div>
          </div>
        </div>

        <p className="mt-6 text-sm text-slate-500 dark:text-slate-400" aria-live="polite">
          {hydrated ? `Showing ${filtered.length} ${filtered.length === 1 ? "project" : "projects"}` : "Loading projects"}
        </p>

        <div className="mt-6">
          {!hydrated ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" role="status" aria-label="Loading projects">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProjectCardSkeleton key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={Building2}
              title="No projects found"
              description="No projects match the selected filters. Try a different location or status."
              action={
                <Button variant="outline" onClick={() => update({ tab: "all", location: "all" })}>
                  Clear filters
                </Button>
              }
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p, i) => (
                <ProjectCard key={p.id} project={p} priority={i < 3} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

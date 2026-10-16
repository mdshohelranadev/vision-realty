"use client";

import { useMemo, useState } from "react";
import { CheckCheck, ChevronDown, Inbox, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { EmptyState } from "@/components/EmptyState";
import { Pill } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { cn, formatDate } from "@/lib/utils";
import type { Inquiry } from "@/types";

const filters = [
  { key: "all", label: "All" },
  { key: "new", label: "New" },
  { key: "read", label: "Read" },
] as const;

export default function AdminInquiriesPage() {
  const inquiries = useStore((s) => s.inquiries);
  const hydrated = useStore((s) => s.hydrated);
  const markInquiryRead = useStore((s) => s.markInquiryRead);
  const deleteInquiry = useStore((s) => s.deleteInquiry);
  const [filter, setFilter] = useState<(typeof filters)[number]["key"]>("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<Inquiry | null>(null);

  const list = useMemo(
    () => inquiries.filter((i) => filter === "all" || i.status === filter),
    [inquiries, filter]
  );
  const newCount = inquiries.filter((i) => i.status === "new").length;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="tablist" aria-label="Filter inquiries" className="flex gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              type="button"
              role="tab"
              aria-selected={filter === f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                filter === f.key
                  ? "border-primary bg-primary text-white"
                  : "border-slate-200 bg-white hover:border-primary dark:border-slate-700 dark:bg-slate-900"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {inquiries.length} total, {newCount} unread
        </p>
      </div>

      <div className="card-base shadow-soft">
        {!hydrated ? (
          <div className="space-y-3 p-5" role="status" aria-label="Loading inquiries">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton h-14 w-full" />
            ))}
          </div>
        ) : list.length === 0 ? (
          <div className="p-5">
            <EmptyState
              icon={Inbox}
              title="No inquiries"
              description="Inquiries submitted through the website will appear here."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-900">
                <tr>
                  <th className="px-5 py-3 font-semibold">Name</th>
                  <th className="px-5 py-3 font-semibold">Contact</th>
                  <th className="px-5 py-3 font-semibold">Message</th>
                  <th className="px-5 py-3 font-semibold">Date</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {list.map((i) => {
                  const open = expanded === i.id;
                  return (
                    <tr key={i.id} className={cn("align-top", i.status === "new" && "bg-accent-50/40 dark:bg-accent/5")}>
                      <td className="px-5 py-4">
                        <p className="font-semibold">{i.name}</p>
                        {i.projectName && (
                          <p className="mt-0.5 text-xs text-slate-500">{i.projectName}</p>
                        )}
                      </td>
                      <td className="px-5 py-4 text-slate-600 dark:text-slate-400">
                        <a href={`tel:${i.phone.replace(/[^+\d]/g, "")}`} className="block hover:text-primary">
                          {i.phone}
                        </a>
                        <a href={`mailto:${i.email}`} className="block hover:text-primary">
                          {i.email}
                        </a>
                      </td>
                      <td className="max-w-xs px-5 py-4">
                        <p className={cn("text-slate-700 dark:text-slate-300", !open && "line-clamp-2")}>
                          {i.message}
                        </p>
                        {i.message.length > 90 && (
                          <button
                            type="button"
                            onClick={() => setExpanded(open ? null : i.id)}
                            aria-expanded={open}
                            className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-primary dark:text-accent"
                          >
                            {open ? "Show less" : "Read more"}
                            <ChevronDown className={cn("h-3 w-3 transition-transform", open && "rotate-180")} aria-hidden />
                          </button>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-slate-600 dark:text-slate-400">
                        {formatDate(i.createdAt)}
                      </td>
                      <td className="px-5 py-4">
                        <Pill tone={i.status === "new" ? "gold" : "slate"}>
                          {i.status === "new" ? "New" : "Read"}
                        </Pill>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-1">
                          {i.status === "new" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markInquiryRead(i.id)}
                              aria-label={`Mark inquiry from ${i.name} as read`}
                            >
                              <CheckCheck className="h-4 w-4" aria-hidden />
                              <span className="hidden xl:inline">Mark read</span>
                            </Button>
                          )}
                          <button
                            type="button"
                            onClick={() => setToDelete(i)}
                            aria-label={`Delete inquiry from ${i.name}`}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-red-50 hover:text-red-600 dark:text-slate-300 dark:hover:bg-red-900/30"
                          >
                            <Trash2 className="h-4 w-4" aria-hidden />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!toDelete}
        title="Delete this inquiry?"
        description={`The inquiry from ${toDelete?.name ?? "this person"} will be permanently removed.`}
        onCancel={() => setToDelete(null)}
        onConfirm={() => {
          if (toDelete) deleteInquiry(toDelete.id);
          setToDelete(null);
        }}
      />
    </div>
  );
}

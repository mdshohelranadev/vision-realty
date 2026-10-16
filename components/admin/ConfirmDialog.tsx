"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/60 p-4"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      aria-describedby="confirm-desc"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lift dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-900/30">
          <AlertTriangle className="h-6 w-6" aria-hidden />
        </span>
        <h2 id="confirm-title" className="font-serif text-xl font-semibold">
          {title}
        </h2>
        <p id="confirm-desc" className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          {description}
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel} autoFocus>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

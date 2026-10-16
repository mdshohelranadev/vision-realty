"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <span className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-900/30">
        <AlertTriangle className="h-8 w-8" aria-hidden />
      </span>
      <h1 className="font-serif text-3xl font-semibold">Something went wrong</h1>
      <p className="mt-3 max-w-md text-slate-600 dark:text-slate-400">
        An unexpected error occurred. Please try again.
      </p>
      <Button className="mt-8" size="lg" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}

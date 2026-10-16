import Link from "next/link";
import { Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className, light }: { className?: string; light?: boolean }) {
  return (
    <Link
      href="/"
      aria-label="Vision Developments home"
      className={cn("inline-flex items-center gap-2.5", className)}
    >
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white">
        <Building2 className="h-5 w-5" aria-hidden />
      </span>
      <span
        className={cn(
          "font-serif text-2xl font-semibold tracking-tight",
          light ? "text-white" : "text-slate-900 dark:text-white"
        )}
      >
        Vision
        <span className="text-accent">.</span>
      </span>
    </Link>
  );
}

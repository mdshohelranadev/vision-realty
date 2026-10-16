import { cn } from "@/lib/utils";
import type { ProjectCategory } from "@/types";

const styles: Record<ProjectCategory, string> = {
  complete: "bg-primary text-white",
  ongoing: "bg-accent text-accent-foreground",
  upcoming: "bg-slate-900 text-white dark:bg-white dark:text-slate-900",
};

const labels: Record<ProjectCategory, string> = {
  complete: "Complete",
  ongoing: "Ongoing",
  upcoming: "Upcoming",
};

export function StatusBadge({
  category,
  className,
}: {
  category: ProjectCategory;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold shadow-sm",
        styles[category],
        className
      )}
    >
      {labels[category]}
    </span>
  );
}

export function Pill({
  children,
  tone = "slate",
  className,
}: {
  children: React.ReactNode;
  tone?: "slate" | "green" | "gold" | "red";
  className?: string;
}) {
  const tones = {
    slate: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    green: "bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-200",
    gold: "bg-accent-50 text-accent-500 dark:bg-accent/15 dark:text-accent-300",
    red: "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

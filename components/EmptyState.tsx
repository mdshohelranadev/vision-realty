import type { LucideIcon } from "lucide-react";
import { SearchX } from "lucide-react";
import type { ReactNode } from "react";

export function EmptyState({
  icon: Icon = SearchX,
  title,
  description,
  action,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 px-6 py-16 text-center dark:border-slate-700">
      <span className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary-50 text-primary dark:bg-primary-900/40 dark:text-primary-200">
        <Icon className="h-7 w-7" aria-hidden />
      </span>
      <h3 className="font-serif text-xl font-semibold">{title}</h3>
      {description && (
        <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

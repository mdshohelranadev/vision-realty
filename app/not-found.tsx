import Link from "next/link";
import { Compass } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <span className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary-50 text-primary dark:bg-primary-900/40 dark:text-accent">
        <Compass className="h-8 w-8" aria-hidden />
      </span>
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent-500">Error 404</p>
      <h1 className="mt-2 font-serif text-4xl font-semibold">Page not found</h1>
      <p className="mt-3 max-w-md text-slate-600 dark:text-slate-400">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link href="/" className={buttonVariants({ variant: "primary", size: "lg" }) + " mt-8"}>
        Back to home
      </Link>
    </div>
  );
}

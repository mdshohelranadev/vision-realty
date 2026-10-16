"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Building2,
  ExternalLink,
  Inbox,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  Settings,
  X,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { ADMIN_COOKIE, ADMIN_FLAG_KEY } from "@/lib/site";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/admin", label: "Dashboard", Icon: LayoutDashboard, exact: true },
  { href: "/admin/projects", label: "Projects", Icon: Building2, exact: false },
  { href: "/admin/inquiries", label: "Inquiries", Icon: Inbox, exact: false },
  { href: "/admin/settings", label: "Settings", Icon: Settings, exact: false },
];

function titleFor(pathname: string): string {
  if (pathname === "/admin") return "Dashboard";
  if (pathname.startsWith("/admin/projects/new")) return "New Project";
  if (pathname.startsWith("/admin/projects/edit")) return "Edit Project";
  if (pathname.startsWith("/admin/projects")) return "Projects";
  if (pathname.startsWith("/admin/inquiries")) return "Inquiries";
  if (pathname.startsWith("/admin/settings")) return "Settings";
  return "Admin";
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState(false);
  const unread = useStore((s) => s.inquiries.filter((i) => i.status === "new").length);

  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    if (isLogin) {
      setChecked(true);
      return;
    }
    let ok = false;
    try {
      ok = localStorage.getItem(ADMIN_FLAG_KEY) === "1";
    } catch {
      ok = false;
    }
    if (!ok) {
      router.replace(`/admin/login?next=${encodeURIComponent(pathname)}`);
    } else {
      setChecked(true);
    }
  }, [isLogin, pathname, router]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  function logout() {
    try {
      localStorage.removeItem(ADMIN_FLAG_KEY);
    } catch {
      /* storage unavailable */
    }
    document.cookie = `${ADMIN_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
    router.replace("/admin/login");
  }

  if (isLogin) return <>{children}</>;

  if (!checked) {
    return (
      <div className="flex min-h-screen items-center justify-center" role="status" aria-label="Checking access">
        <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden />
      </div>
    );
  }

  const sidebar = (
    <div className="flex h-full flex-col bg-primary-900 text-primary-100">
      <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
        <Logo light />
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close sidebar"
          className="rounded-md p-1.5 hover:bg-white/10 lg:hidden"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>
      </div>
      <nav aria-label="Admin navigation" className="flex-1 space-y-1 p-4">
        {nav.map(({ href, label, Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-white/15 text-white" : "hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon className="h-5 w-5" aria-hidden />
              {label}
              {label === "Inquiries" && unread > 0 && (
                <span className="ml-auto rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-accent-foreground">
                  {unread}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/10 p-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-white/10 hover:text-white"
        >
          <ExternalLink className="h-5 w-5" aria-hidden />
          View website
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:block">{sidebar}</aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Sidebar">
          <div className="absolute inset-0 bg-slate-950/60" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[85%]">{sidebar}</aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-100 bg-white/90 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open sidebar"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
            >
              <Menu className="h-6 w-6" aria-hidden />
            </button>
            <h1 className="font-serif text-xl font-semibold">{titleFor(pathname)}</h1>
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Button variant="outline" size="sm" onClick={logout} className="ml-2">
              <LogOut className="h-4 w-4" aria-hidden />
              <span className="hidden sm:inline">Log out</span>
              <span className="sr-only sm:hidden">Log out</span>
            </Button>
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

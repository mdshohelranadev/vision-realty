"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, Phone, Search, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SearchDialog } from "@/components/SearchDialog";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const projectLinks = [
  { href: "/projects?tab=complete", label: "Complete Projects" },
  { href: "/projects?tab=ongoing", label: "Ongoing Projects" },
  { href: "/projects?tab=upcoming", label: "Upcoming Projects" },
];

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdown(false);
  }, [pathname]);

  // Lock page scroll while the full-screen menu is open, and always release it on cleanup.
  useEffect(() => {
    if (!mobileOpen) return;
    const html = document.documentElement;
    const prevHtml = html.style.overflow;
    const prevBody = document.body.style.overflow;
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    // If the device is rotated or resized to desktop width, close the menu so the page never stays locked.
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setMobileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    mq.addEventListener("change", onChange);
    closeBtnRef.current?.focus();

    return () => {
      html.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onChange);
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!dropdown) return;
    const onClick = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropdown(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDropdown(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [dropdown]);

  const linkClass = (active: boolean) =>
    cn(
      "rounded-md px-3 py-2 text-sm font-medium transition-colors",
      active
        ? "text-primary dark:text-accent"
        : "text-slate-700 hover:text-primary dark:text-slate-300 dark:hover:text-accent"
    );

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 border-b transition-all duration-300",
          scrolled
            ? "border-slate-100 bg-white/80 shadow-soft backdrop-blur-lg dark:border-slate-800 dark:bg-slate-950/80"
            : "border-transparent bg-white/95 dark:bg-slate-950/95"
        )}
      >
        <nav
          aria-label="Main navigation"
          className="container flex h-16 items-center justify-between lg:h-[72px]"
        >
          <Logo />

          <div className="hidden items-center gap-1 lg:flex">
            <Link href="/" className={linkClass(pathname === "/")}>
              Home
            </Link>

            <div
              ref={dropRef}
              className="relative"
              onMouseEnter={() => setDropdown(true)}
              onMouseLeave={() => setDropdown(false)}
            >
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={dropdown}
                onClick={() => setDropdown((v) => !v)}
                className={cn(
                  linkClass(pathname.startsWith("/projects")),
                  "inline-flex items-center gap-1"
                )}
              >
                Projects
                <ChevronDown
                  className={cn("h-4 w-4 transition-transform", dropdown && "rotate-180")}
                  aria-hidden
                />
              </button>
              <AnimatePresence>
                {dropdown && (
                  <motion.div
                    role="menu"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full w-56 pt-2"
                  >
                    <div className="overflow-hidden rounded-xl border border-slate-100 bg-white p-1.5 shadow-lift dark:border-slate-800 dark:bg-slate-900">
                      {projectLinks.map((l) => (
                        <Link
                          key={l.href}
                          href={l.href}
                          role="menuitem"
                          onClick={() => setDropdown(false)}
                          className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-primary-50 hover:text-primary dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-accent"
                        >
                          {l.label}
                        </Link>
                      ))}
                      <Link
                        href="/projects"
                        role="menuitem"
                        onClick={() => setDropdown(false)}
                        className="mt-1 block border-t border-slate-100 px-3 py-2.5 text-sm font-semibold text-primary dark:border-slate-800 dark:text-accent"
                      >
                        View all projects
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/about" className={linkClass(pathname === "/about")}>
              About
            </Link>
            <Link href="/contact" className={linkClass(pathname === "/contact")}>
              Contact
            </Link>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search projects"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Search className="h-5 w-5" aria-hidden />
            </button>
            <ThemeToggle />
            <Link
              href="/contact"
              className={cn(buttonVariants({ variant: "primary", size: "md" }), "ml-2 hidden lg:inline-flex")}
            >
              Contact Us
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
            >
              <Menu className="h-6 w-6" aria-hidden />
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-x-0 top-0 z-[60] flex h-dvh flex-col overflow-y-auto overscroll-contain bg-white dark:bg-slate-950 lg:hidden"
          >
            <div className="container flex h-16 shrink-0 items-center justify-between">
              <Logo />
              <button
                ref={closeBtnRef}
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-6 w-6" aria-hidden />
              </button>
            </div>

            <div
              className="container flex flex-1 flex-col py-6 pb-10"
              onClick={(e) => {
                // Close on any link tap, including links that only change the query string.
                if ((e.target as HTMLElement).closest("a")) setMobileOpen(false);
              }}
            >
              <ul className="space-y-1">
                {links.slice(0, 1).map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="block rounded-lg px-2 py-2.5 font-serif text-2xl font-semibold sm:text-3xl"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/projects"
                    className="block rounded-lg px-2 py-2.5 font-serif text-2xl font-semibold sm:text-3xl"
                  >
                    Projects
                  </Link>
                  <ul className="ml-3 mb-2 space-y-1 border-l-2 border-accent/60 pl-4">
                    {projectLinks.map((l) => (
                      <li key={l.href}>
                        <Link
                          href={l.href}
                          className="block py-2 text-base text-slate-600 dark:text-slate-300"
                        >
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
                {links.slice(1).map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="block rounded-lg px-2 py-2.5 font-serif text-2xl font-semibold sm:text-3xl"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-auto space-y-3 pt-8">
                <Link
                  href="/contact"
                  className={cn(buttonVariants({ variant: "primary", size: "lg" }), "w-full")}
                >
                  Contact Us
                </Link>
                <Link
                  href="/contact"
                  className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full")}
                >
                  <Phone className="h-4 w-4" aria-hidden />
                  Request a call back
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchDialog open={searchOpen} onClose={closeSearch} />
    </>
  );
}

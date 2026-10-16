"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Eye, EyeOff, Lock } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { ADMIN_COOKIE, ADMIN_FLAG_KEY } from "@/lib/site";

const ADMIN_PASSWORD = "admin123";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== ADMIN_PASSWORD) {
      setError("Incorrect password. Please try again.");
      return;
    }
    try {
      localStorage.setItem(ADMIN_FLAG_KEY, "1");
    } catch {
      /* storage unavailable */
    }
    document.cookie = `${ADMIN_COOKIE}=1; path=/; max-age=28800; SameSite=Lax`;

    const next = new URLSearchParams(window.location.search).get("next");
    router.replace(next && next.startsWith("/admin") && !next.startsWith("/admin/login") ? next : "/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lift dark:bg-slate-900 sm:p-10">
        <div className="mb-8 flex flex-col items-center text-center">
          <Logo />
          <h1 className="mt-6 font-serif text-2xl font-semibold">Admin sign in</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Enter the admin password to manage projects and inquiries.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5" noValidate>
          {error && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              {error}
            </div>
          )}
          <div>
            <Label htmlFor="admin-password">Password</Label>
            <div className="relative">
              <Lock
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                aria-hidden
              />
              <Input
                id="admin-password"
                type={show ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                className="pl-10 pr-11"
                placeholder="Enter password"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                aria-label={show ? "Hide password" : "Show password"}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                {show ? <EyeOff className="h-4 w-4" aria-hidden /> : <Eye className="h-4 w-4" aria-hidden />}
              </button>
            </div>
          </div>
          <Button type="submit" size="lg" className="w-full">
            Sign in
          </Button>
        </form>
      </div>
    </div>
  );
}

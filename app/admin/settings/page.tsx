"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label, Textarea } from "@/components/ui/input";
import { useStore } from "@/lib/store";
import type { CompanySettings } from "@/types";

const fields: { key: keyof CompanySettings; label: string; type?: string; area?: boolean }[] = [
  { key: "companyName", label: "Company name" },
  { key: "tagline", label: "Tagline" },
  { key: "email", label: "Email", type: "email" },
  { key: "phone", label: "Phone", type: "tel" },
  { key: "whatsapp", label: "WhatsApp number", type: "tel" },
  { key: "address", label: "Office address", area: true },
  { key: "facebook", label: "Facebook URL", type: "url" },
  { key: "linkedin", label: "LinkedIn URL", type: "url" },
  { key: "instagram", label: "Instagram URL", type: "url" },
  { key: "youtube", label: "YouTube URL", type: "url" },
];

export default function AdminSettingsPage() {
  const settings = useStore((s) => s.settings);
  const hydrated = useStore((s) => s.hydrated);
  const updateSettings = useStore((s) => s.updateSettings);
  const [form, setForm] = useState<CompanySettings>(settings);
  const [errors, setErrors] = useState<Partial<Record<keyof CompanySettings, string>>>({});
  const [saved, setSaved] = useState(false);

  // Sync the form once persisted settings have loaded from localStorage.
  useEffect(() => {
    if (hydrated) setForm(settings);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const found: typeof errors = {};
    if (form.companyName.trim().length < 2) found.companyName = "Company name is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) found.email = "Enter a valid email address.";
    if (form.phone.trim().length < 6) found.phone = "Enter a valid phone number.";
    if (form.address.trim().length < 5) found.address = "Address is required.";
    (["facebook", "linkedin", "instagram", "youtube"] as const).forEach((k) => {
      if (form[k].trim() && !/^https?:\/\//.test(form[k].trim())) found[k] = "Enter a full URL starting with https://";
    });
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    updateSettings(form);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 3500);
  }

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-3xl space-y-4" role="status" aria-label="Loading settings">
        <div className="skeleton h-96 w-full" />
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="mx-auto max-w-3xl space-y-6" aria-label="Company settings">
      {saved && (
        <div
          role="status"
          className="flex items-center gap-2 rounded-lg bg-primary-50 p-4 text-sm font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-200"
        >
          <CheckCircle2 className="h-4 w-4" aria-hidden />
          Settings saved. The website now shows the updated details.
        </div>
      )}
      <section className="card-base p-5 shadow-soft sm:p-6">
        <h2 className="font-serif text-lg font-semibold">Company information</h2>
        <p className="mb-5 mt-1 text-sm text-slate-500 dark:text-slate-400">
          These details appear in the website footer, contact page and project enquiry buttons.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map((f) => (
            <div key={f.key} className={f.area || f.key === "tagline" ? "sm:col-span-2" : undefined}>
              <Label htmlFor={`s-${f.key}`}>{f.label}</Label>
              {f.area ? (
                <Textarea
                  id={`s-${f.key}`}
                  value={form[f.key]}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  className="min-h-[80px]"
                />
              ) : (
                <Input
                  id={`s-${f.key}`}
                  type={f.type === "url" ? "text" : f.type}
                  value={form[f.key]}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  aria-invalid={!!errors[f.key]}
                />
              )}
              <FieldError message={errors[f.key]} />
            </div>
          ))}
        </div>
      </section>
      <div className="flex justify-end">
        <Button type="submit" size="lg">
          <Save className="h-4 w-4" aria-hidden />
          Save settings
        </Button>
      </div>
    </form>
  );
}

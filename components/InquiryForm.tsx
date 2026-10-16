"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label, Textarea } from "@/components/ui/input";
import { useStore } from "@/lib/store";

interface Props {
  projectName?: string;
  messagePlaceholder?: string;
  submitLabel?: string;
}

type Errors = Partial<Record<"name" | "phone" | "email" | "message", string>>;

export function InquiryForm({
  projectName,
  messagePlaceholder = "Tell us what you are looking for",
  submitLabel = "Send Inquiry",
}: Props) {
  const addInquiry = useStore((s) => s.addInquiry);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  function validate(data: FormData): Errors {
    const e: Errors = {};
    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    if (name.length < 2) e.name = "Please enter your full name.";
    if (!/^[+\d][\d\s\-()]{6,}$/.test(phone)) e.phone = "Please enter a valid phone number.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Please enter a valid email address.";
    if (message.length < 10) e.message = "Please write at least 10 characters.";
    return e;
  }

  async function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const form = ev.currentTarget;
    const data = new FormData(form);
    const found = validate(data);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setStatus("sending");
    try {
      await new Promise((r) => setTimeout(r, 500));
      addInquiry({
        name: String(data.get("name")).trim(),
        phone: String(data.get("phone")).trim(),
        email: String(data.get("email")).trim(),
        message: String(data.get("message")).trim(),
        projectName,
      });
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="rounded-xl bg-primary-50 p-6 text-center dark:bg-primary-900/30">
        <CheckCircle2 className="mx-auto h-10 w-10 text-primary dark:text-accent" aria-hidden />
        <h3 className="mt-3 font-serif text-xl font-semibold">Thank you</h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Your inquiry has been received. A member of our sales team will contact you shortly.
        </p>
        <Button variant="outline" size="sm" className="mt-5" onClick={() => setStatus("idle")}>
          Send another inquiry
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4" aria-label="Inquiry form">
      {status === "error" && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          Something went wrong while sending your inquiry. Please try again.
        </div>
      )}
      <div>
        <Label htmlFor="inq-name">Full name</Label>
        <Input
          id="inq-name"
          name="name"
          autoComplete="name"
          placeholder="Your full name"
          aria-invalid={!!errors.name}
        />
        <FieldError message={errors.name} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        <div>
          <Label htmlFor="inq-phone">Phone</Label>
          <Input
            id="inq-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+880 1XXX-XXXXXX"
            aria-invalid={!!errors.phone}
          />
          <FieldError message={errors.phone} />
        </div>
        <div>
          <Label htmlFor="inq-email">Email</Label>
          <Input
            id="inq-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@email.com"
            aria-invalid={!!errors.email}
          />
          <FieldError message={errors.email} />
        </div>
      </div>
      <div>
        <Label htmlFor="inq-message">Message</Label>
        <Textarea
          id="inq-message"
          name="message"
          placeholder={messagePlaceholder}
          aria-invalid={!!errors.message}
        />
        <FieldError message={errors.message} />
      </div>
      <Button type="submit" size="lg" className="w-full" disabled={status === "sending"}>
        {status === "sending" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Sending
          </>
        ) : (
          <>
            <Send className="h-4 w-4" aria-hidden /> {submitLabel}
          </>
        )}
      </Button>
    </form>
  );
}

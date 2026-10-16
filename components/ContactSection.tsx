"use client";

import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { InquiryForm } from "@/components/InquiryForm";
import { useStore } from "@/lib/store";
import { phoneHref } from "@/lib/utils";

export function ContactSection() {
  const settings = useStore((s) => s.settings);

  const items = [
    { Icon: MapPin, label: "Head Office", value: settings.address, href: undefined as string | undefined },
    { Icon: Phone, label: "Phone", value: settings.phone, href: phoneHref(settings.phone) },
    { Icon: Mail, label: "Email", value: settings.email, href: `mailto:${settings.email}` },
    { Icon: Clock, label: "Office Hours", value: "Saturday to Thursday, 9:00 AM to 6:00 PM", href: undefined },
  ];

  const mapQuery = encodeURIComponent("Sector 4, Uttara, Dhaka, Bangladesh");

  return (
    <section className="section">
      <div className="container grid gap-10 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <span className="eyebrow">Get in touch</span>
          <h2 className="heading-serif text-3xl sm:text-4xl">Let us help you find the right address</h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300">
            Visit our office, call our sales team or send a message. We respond to every inquiry within
            one working day.
          </p>
          <ul className="mt-8 space-y-5">
            {items.map(({ Icon, label, value, href }) => (
              <li key={label} className="flex gap-4">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary dark:bg-primary-900/40 dark:text-accent">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
                  {href ? (
                    <a href={href} className="mt-0.5 block font-medium hover:text-primary dark:hover:text-accent">
                      {value}
                    </a>
                  ) : (
                    <p className="mt-0.5 font-medium">{value}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <div className="card-base p-6 shadow-soft sm:p-8">
            <h3 className="font-serif text-2xl font-semibold">Send us a message</h3>
            <p className="mb-6 mt-1 text-sm text-slate-500 dark:text-slate-400">
              Tell us about the project or apartment size you are interested in.
            </p>
            <InquiryForm submitLabel="Send Message" messagePlaceholder="How can we help you?" />
          </div>
        </div>
      </div>

      <div className="container mt-14">
        <div className="overflow-hidden rounded-2xl border border-slate-100 shadow-soft dark:border-slate-800">
          <iframe
            title="Vision Developments office location map"
            src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-[360px] w-full border-0 sm:h-[440px]"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}

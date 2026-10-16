"use client";

import Link from "next/link";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Youtube } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useStore } from "@/lib/store";
import { phoneHref } from "@/lib/utils";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "All Projects" },
  { href: "/projects?tab=ongoing", label: "Ongoing Projects" },
  { href: "/projects?tab=upcoming", label: "Upcoming Projects" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  const settings = useStore((s) => s.settings);

  const socials = [
    { href: settings.facebook, label: "Facebook", Icon: Facebook },
    { href: settings.linkedin, label: "LinkedIn", Icon: Linkedin },
    { href: settings.instagram, label: "Instagram", Icon: Instagram },
    { href: settings.youtube, label: "YouTube", Icon: Youtube },
  ].filter((s) => s.href);

  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="container grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo light />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-slate-400">
            {settings.tagline} Thoughtfully designed apartments and commercial spaces across
            Dhaka, Chittagong and Sylhet.
          </p>
        </div>

        <div>
          <h3 className="mb-5 font-serif text-lg font-semibold text-white">Quick Links</h3>
          <ul className="space-y-3 text-sm">
            {quickLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition-colors hover:text-accent">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-5 font-serif text-lg font-semibold text-white">Contact</h3>
          <ul className="space-y-4 text-sm">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
              <span>{settings.address}</span>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
              <a href={phoneHref(settings.phone)} className="hover:text-accent">
                {settings.phone}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
              <a href={`mailto:${settings.email}`} className="break-all hover:text-accent">
                {settings.email}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-5 font-serif text-lg font-semibold text-white">Follow Us</h3>
          <p className="mb-5 text-sm text-slate-400">
            Construction updates, handover news and new launches.
          </p>
          <ul className="flex gap-3">
            {socials.map(({ href, label, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 transition-colors hover:border-accent hover:bg-accent hover:text-slate-950"
                >
                  <Icon className="h-4 w-4" aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="container flex flex-col items-center justify-between gap-2 py-6 text-xs text-slate-500 sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {settings.companyName}. All rights reserved.
          </p>
          <Link href="/admin/login" className="hover:text-accent">
            Staff login
          </Link>
        </div>
      </div>
    </footer>
  );
}

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/'/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function categoryLabel(category: string): string {
  switch (category) {
    case "complete":
      return "Complete";
    case "ongoing":
      return "Ongoing";
    case "upcoming":
      return "Upcoming";
    default:
      return category;
  }
}

/** Splits "Vision Organza" into ["Vision", "Organza"] so the accent word can be coloured. */
export function splitName(name: string): [string, string] {
  const idx = name.indexOf(" ");
  if (idx === -1) return ["", name];
  return [name.slice(0, idx), name.slice(idx + 1)];
}

export function phoneHref(phone: string): string {
  return `tel:${phone.replace(/[^+\d]/g, "")}`;
}

export function whatsappHref(number: string, text?: string): string {
  const digits = number.replace(/[^\d]/g, "");
  const q = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${digits}${q}`;
}

"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface HeroSlide {
  src: string;
  name: string;
  location: string;
  href: string;
}

export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback(
    (dir: number) => setIndex((i) => (i + dir + slides.length) % slides.length),
    [slides.length]
  );

  useEffect(() => {
    if (paused || slides.length < 2) return;
    const t = window.setInterval(() => go(1), 6500);
    return () => window.clearInterval(t);
  }, [paused, go, slides.length]);

  const active = slides[index];

  return (
    <section
      className="relative isolate h-[88vh] min-h-[560px] w-full overflow-hidden bg-slate-900 lg:h-[92vh]"
      aria-roledescription="carousel"
      aria-label="Featured projects"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((s, i) => (
        <div
          key={s.src}
          aria-hidden={i !== index}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000",
            i === index ? "opacity-100" : "opacity-0"
          )}
        >
          <Image
            src={s.src}
            alt={`${s.name} building view`}
            fill
            sizes="100vw"
            priority={i === 0}
            className="object-cover"
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/50 to-slate-950/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

      <div className="container relative flex h-full flex-col justify-center pb-24 pt-12">
        <span className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-accent-200 backdrop-blur">
          Premium Developers since 2008
        </span>
        <h1 className="max-w-3xl font-serif text-4xl font-semibold leading-[1.1] text-white sm:text-5xl lg:text-7xl">
          Spaces designed for the way you <span className="text-accent">live</span>
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-200 sm:text-lg">
          Vision creates residential and commercial landmarks across Dhaka, Chittagong and Sylhet,
          built on honest construction, refined design and on-time handover.
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Link href="/projects" className={cn(buttonVariants({ variant: "accent", size: "lg" }))}>
            View Projects
          </Link>
          <Link href="/contact" className={cn(buttonVariants({ variant: "glass", size: "lg" }))}>
            Contact Us
          </Link>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0">
        <div className="container flex items-center justify-between gap-4 pb-6">
          <Link
            href={active.href}
            className="group hidden min-w-0 items-center gap-3 text-white sm:flex"
            aria-label={`Open ${active.name}`}
          >
            <span className="h-10 w-px bg-accent" />
            <span className="min-w-0">
              <span className="block truncate font-serif text-lg font-semibold group-hover:underline">
                {active.name}
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-300">
                <MapPin className="h-3 w-3" aria-hidden />
                {active.location}
              </span>
            </span>
          </Link>

          <div className="ml-auto flex items-center gap-4">
            <div className="flex gap-2" role="tablist" aria-label="Choose slide">
              {slides.map((s, i) => (
                <button
                  key={s.src}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Show slide ${i + 1}: ${s.name}`}
                  onClick={() => setIndex(i)}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    i === index ? "w-8 bg-accent" : "w-4 bg-white/50 hover:bg-white/80"
                  )}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous slide"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white backdrop-blur hover:bg-white/15"
              >
                <ChevronLeft className="h-5 w-5" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next slide"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white backdrop-blur hover:bg-white/15"
              >
                <ChevronRight className="h-5 w-5" aria-hidden />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

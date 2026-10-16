"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  Clock,
  Handshake,
  Phone,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { ProjectCard, ProjectCardSkeleton } from "@/components/ProjectCard";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { EmptyState } from "@/components/EmptyState";
import { buttonVariants } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

function ProjectGridSkeleton({ count }: { count: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" role="status" aria-label="Loading projects">
      {Array.from({ length: count }).map((_, i) => (
        <ProjectCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function FeaturedProjects() {
  const projects = useStore((s) => s.projects);
  const hydrated = useStore((s) => s.hydrated);
  const featured = useMemo(() => projects.filter((p) => p.featured).slice(0, 6), [projects]);

  return (
    <section className="section" aria-labelledby="featured-heading">
      <div className="container">
        <SectionHeading
          eyebrow="Featured Projects"
          title="Addresses worth coming home to"
          description="A selection of our most sought-after residences, from handed-over landmarks to buildings now rising."
        />
        {!hydrated ? (
          <ProjectGridSkeleton count={6} />
        ) : featured.length === 0 ? (
          <EmptyState
            title="No featured projects yet"
            description="Featured projects will appear here once they are selected."
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p, i) => (
              <Reveal key={p.id} delay={(i % 3) * 0.08} className="h-full">
                <ProjectCard project={p} />
              </Reveal>
            ))}
          </div>
        )}
        <div className="mt-12 text-center">
          <Link href="/projects" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
            Explore all projects
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}

const reasons: { Icon: LucideIcon; title: string; text: string }[] = [
  {
    Icon: ShieldCheck,
    title: "Uncompromising Quality",
    text: "Certified materials, supervised construction and rigorous inspections at every stage of the build.",
  },
  {
    Icon: Clock,
    title: "On-Time Handover",
    text: "Realistic schedules and transparent progress updates so you can plan your move with confidence.",
  },
  {
    Icon: Handshake,
    title: "Transparent Dealings",
    text: "Clear pricing, clear paperwork and clear communication from booking through registration.",
  },
  {
    Icon: Award,
    title: "Prime Locations",
    text: "Carefully chosen plots in Uttara, Bashundhara, Gulshan and beyond, close to schools, hospitals and transport.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="section bg-slate-50 dark:bg-slate-900/40" aria-labelledby="why-heading">
      <div className="container">
        <SectionHeading
          eyebrow="Why Choose Us"
          title="Built on trust, finished with care"
          description="For more than fifteen years, families and investors have chosen Vision for the same reasons."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map(({ Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 0.08} className="h-full">
              <div className="card-base card-hover h-full p-7 shadow-soft">
                <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white">
                  <Icon className="h-6 w-6" aria-hidden />
                </span>
                <h3 className="font-serif text-xl font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setValue(to);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const dur = 1400;
          const tick = (now: number) => {
            const t = Math.min((now - start) / dur, 1);
            setValue(Math.round(to * (1 - Math.pow(1 - t, 3))));
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to]);

  // Keep the final value in sync if the underlying count changes after the animation.
  useEffect(() => {
    if (started.current) setValue(to);
  }, [to]);

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  );
}

export function StatsBar() {
  const projects = useStore((s) => s.projects);
  const stats = useMemo(
    () => [
      { label: "Total Projects", value: projects.length, suffix: "" },
      { label: "Completed", value: projects.filter((p) => p.category === "complete").length, suffix: "" },
      { label: "Ongoing", value: projects.filter((p) => p.category === "ongoing").length, suffix: "" },
      { label: "Happy Clients", value: 850, suffix: "+" },
    ],
    [projects]
  );

  return (
    <section className="bg-primary text-white" aria-label="Company statistics">
      <div className="container grid grid-cols-2 gap-y-10 py-12 lg:grid-cols-4 lg:py-14">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={cn(
              "text-center",
              i > 0 && "lg:border-l lg:border-white/15",
              i === 2 && "max-lg:border-0"
            )}
          >
            <p className="font-serif text-4xl font-semibold text-accent sm:text-5xl">
              <CountUp to={s.value} suffix={s.suffix} />
            </p>
            <p className="mt-2 text-sm font-medium uppercase tracking-widest text-primary-100">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function RecentCompleted() {
  const projects = useStore((s) => s.projects);
  const hydrated = useStore((s) => s.hydrated);
  const recent = useMemo(
    () =>
      projects
        .filter((p) => p.category === "complete")
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .slice(0, 6),
    [projects]
  );

  return (
    <section className="section" aria-labelledby="recent-heading">
      <div className="container">
        <SectionHeading
          eyebrow="Recently Completed"
          title="Delivered and lived in"
          description="Handed-over buildings that show how we build: well planned, well finished and built to last."
        />
        {!hydrated ? (
          <ProjectGridSkeleton count={3} />
        ) : recent.length === 0 ? (
          <EmptyState
            title="No completed projects yet"
            description="Completed projects will be listed here after handover."
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((p, i) => (
              <Reveal key={p.id} delay={(i % 3) * 0.08} className="h-full">
                <ProjectCard project={p} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function CtaSection() {
  return (
    <section className="section pt-0">
      <div className="container">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-800 via-primary to-primary-600 px-6 py-14 text-center text-white shadow-lift sm:px-12 sm:py-20">
          <div
            aria-hidden
            className="absolute -right-24 -top-24 h-72 w-72 rounded-full border border-accent/30"
          />
          <div
            aria-hidden
            className="absolute -bottom-32 -left-16 h-80 w-80 rounded-full border border-accent/20"
          />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="font-serif text-3xl font-semibold sm:text-4xl lg:text-5xl">
              Ready to find your <span className="text-accent">Vision</span> home?
            </h2>
            <p className="mt-5 text-base text-primary-100 sm:text-lg">
              Speak with our sales team, arrange a site visit or request a detailed brochure for any
              project.
            </p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/contact" className={cn(buttonVariants({ variant: "accent", size: "lg" }))}>
                <Phone className="h-4 w-4" aria-hidden />
                Contact Us
              </Link>
              <Link href="/projects" className={cn(buttonVariants({ variant: "glass", size: "lg" }))}>
                Browse Projects
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

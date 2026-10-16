import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Eye, Gem, HeartHandshake, Target, UserRound, type LucideIcon } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Vision Developments: our story, mission, vision, milestones and the leadership team behind every project.",
  alternates: { canonical: "/about" },
};

const timeline = [
  { year: "2008", title: "Founded in Uttara", text: "Vision begins with a single residential building and a promise to build honestly." },
  { year: "2012", title: "First landmark delivered", text: "Our first multi-storey project is handed over ahead of schedule to its original owners." },
  { year: "2016", title: "Expansion across Dhaka", text: "New projects launch in Bashundhara R/A and Dhaka Cantonment." },
  { year: "2020", title: "Premium portfolio", text: "Vision enters Niketon and Gulshan with larger, design-led residences." },
  { year: "2024", title: "Beyond the capital", text: "Planning begins for projects in Chittagong and a commercial centre in Sylhet." },
  { year: "2026", title: "Next chapter", text: "Several buildings under construction while new launches open for booking." },
];

const values: { Icon: LucideIcon; title: string; text: string }[] = [
  { Icon: Gem, title: "Craft", text: "We sweat the details residents notice every day: light, layout, finishes and fittings." },
  { Icon: HeartHandshake, title: "Integrity", text: "Fair pricing, honest timelines and documentation you can rely on." },
  { Icon: Target, title: "Delivery", text: "Plans are only worth what is delivered. We measure ourselves on handover." },
];

const team = [
  { name: "Md. Abdur Rahman", role: "Chairman", bio: "Founder with over three decades in construction and land development." },
  { name: "Farhana Karim", role: "Managing Director", bio: "Leads strategy, partnerships and long-term project planning." },
  { name: "Ar. Sajid Mahmud", role: "Head of Design", bio: "Architect responsible for the design language across Vision buildings." },
  { name: "Eng. Tahmid Chowdhury", role: "Head of Construction", bio: "Oversees site engineering, quality control and delivery schedules." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Vision"
        title="A developer defined by what it delivers"
        description="From our first building in Uttara to landmarks across the country, we build homes that families are proud to own."
        image="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1800&q=70"
      />

      <section className="section" aria-labelledby="story-heading">
        <div className="container grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-lift">
              <Image
                src="https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1400&q=80"
                alt="Vision residential building at dusk"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <span className="eyebrow">Our Story</span>
            <h2 id="story-heading" className="heading-serif text-3xl sm:text-4xl">
              Building with vision since 2008
            </h2>
            <div className="mt-5 space-y-4 leading-relaxed text-slate-600 dark:text-slate-300">
              <p>
                Vision Developments started with a simple belief: a home is the largest commitment most
                families will ever make, and the developer behind it should treat it that way.
              </p>
              <p>
                Over the years we have delivered apartments and commercial spaces in Uttara,
                Bashundhara, Dhaka Cantonment, Niketon and Gulshan, each designed around natural light,
                ventilation, privacy and long-term value.
              </p>
              <p>
                Today our engineers, architects and sales teams work as one, so that the building you
                see in the brochure is the building you receive on handover day.
              </p>
            </div>
            <Link href="/projects" className={cn(buttonVariants({ variant: "primary", size: "lg" }), "mt-8")}>
              See our projects
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="section bg-slate-50 dark:bg-slate-900/40" aria-labelledby="mv-heading">
        <div className="container">
          <SectionHeading eyebrow="Purpose" title="Mission and Vision" />
          <h2 id="mv-heading" className="sr-only">
            Mission and Vision
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Reveal>
              <div className="card-base h-full p-8 shadow-soft">
                <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white">
                  <Target className="h-6 w-6" aria-hidden />
                </span>
                <h3 className="font-serif text-2xl font-semibold">Our Mission</h3>
                <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">
                  To create safe, well-designed and enduring buildings that improve how people live and
                  work, delivered on time and with complete transparency.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="card-base h-full p-8 shadow-soft">
                <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                  <Eye className="h-6 w-6" aria-hidden />
                </span>
                <h3 className="font-serif text-2xl font-semibold">Our Vision</h3>
                <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">
                  To be the most trusted name in Bangladeshi real estate, known for buildings that
                  appreciate in value and communities that feel like home.
                </p>
              </div>
            </Reveal>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {values.map(({ Icon, title, text }, i) => (
              <Reveal key={title} delay={i * 0.08}>
                <div className="card-base h-full p-6">
                  <Icon className="h-7 w-7 text-primary dark:text-accent" aria-hidden />
                  <h3 className="mt-4 font-serif text-lg font-semibold">{title}</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="timeline-heading">
        <div className="container">
          <SectionHeading eyebrow="Milestones" title="Our journey" />
          <h2 id="timeline-heading" className="sr-only">
            Company timeline
          </h2>
          <ol className="relative mx-auto max-w-3xl border-l-2 border-accent/50 pl-8">
            {timeline.map((t, i) => (
              <Reveal key={t.year} delay={i * 0.05}>
                <li className="relative pb-10 last:pb-0">
                  <span
                    aria-hidden
                    className="absolute -left-[41px] top-1 h-4 w-4 rounded-full border-4 border-white bg-accent dark:border-slate-950"
                  />
                  <p className="font-serif text-2xl font-semibold text-primary dark:text-accent">{t.year}</p>
                  <h3 className="mt-1 text-base font-semibold">{t.title}</h3>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{t.text}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="section bg-slate-50 pt-16 dark:bg-slate-900/40" aria-labelledby="team-heading">
        <div className="container">
          <SectionHeading
            eyebrow="Leadership"
            title="The people behind Vision"
            description="Architects, engineers and managers who answer personally for every building we deliver."
          />
          <h2 id="team-heading" className="sr-only">
            Leadership team
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((m, i) => (
              <Reveal key={m.name} delay={i * 0.08}>
                <div className="card-base card-hover h-full p-6 text-center shadow-soft">
                  <span className="mx-auto mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary-50 text-primary dark:bg-primary-900/40 dark:text-accent">
                    <UserRound className="h-9 w-9" aria-hidden />
                  </span>
                  <h3 className="font-serif text-lg font-semibold">{m.name}</h3>
                  <p className="mt-1 text-sm font-semibold text-accent-500 dark:text-accent">{m.role}</p>
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">{m.bio}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

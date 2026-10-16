import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Layers, MapPin, Ruler, Home } from "lucide-react";
import { StatusBadge } from "@/components/ui/badge";
import { splitName } from "@/lib/utils";
import type { Project } from "@/types";

export function ProjectName({ name, className }: { name: string; className?: string }) {
  const [first, rest] = splitName(name);
  return (
    <span className={className}>
      {first && <span>{first} </span>}
      <span className="text-accent-500 dark:text-accent">{rest}</span>
    </span>
  );
}

export function ProjectCard({ project, priority = false }: { project: Project; priority?: boolean }) {
  const s = project.specifications;
  const size = s.totalFloorArea ?? s.apartmentSize;
  return (
    <article className="card-base card-hover group flex h-full flex-col overflow-hidden shadow-soft">
      <Link
        href={`/projects/${project.slug}`}
        className="relative block aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800"
        aria-label={`View ${project.name}`}
        tabIndex={-1}
      >
        <Image
          src={project.image}
          alt={`${project.name} exterior`}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          priority={priority}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 to-transparent" />
        <StatusBadge category={project.category} className="absolute right-3 top-3" />
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-serif text-xl font-semibold leading-snug">
          <Link href={`/projects/${project.slug}`} className="hover:underline">
            <ProjectName name={project.name} />
          </Link>
        </h3>
        <p className="mt-2 flex items-start gap-1.5 text-sm text-slate-500 dark:text-slate-400">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary dark:text-accent" aria-hidden />
          <span className="line-clamp-2">{project.location}</span>
        </p>

        <dl className="mt-5 grid grid-cols-3 divide-x divide-slate-100 rounded-lg bg-slate-50 py-3 text-center dark:divide-slate-800 dark:bg-slate-800/50">
          <div className="px-2">
            <dt className="sr-only">Floors</dt>
            <Layers className="mx-auto mb-1 h-4 w-4 text-primary dark:text-accent" aria-hidden />
            <dd className="text-xs font-medium leading-tight">{s.building}</dd>
          </div>
          <div className="px-2">
            <dt className="sr-only">Size</dt>
            <Ruler className="mx-auto mb-1 h-4 w-4 text-primary dark:text-accent" aria-hidden />
            <dd className="line-clamp-2 text-xs font-medium leading-tight">{size}</dd>
          </div>
          <div className="px-2">
            <dt className="sr-only">Units</dt>
            <Home className="mx-auto mb-1 h-4 w-4 text-primary dark:text-accent" aria-hidden />
            <dd className="text-xs font-medium leading-tight">
              {s.totalApartments.match(/^\d+$/) ? `${s.totalApartments} Units` : s.totalApartments}
            </dd>
          </div>
        </dl>

        <Link
          href={`/projects/${project.slug}`}
          className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-all hover:gap-3 dark:text-accent"
        >
          View Details
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </article>
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="card-base overflow-hidden" aria-hidden>
      <div className="skeleton aspect-[16/10] rounded-none" />
      <div className="space-y-3 p-5">
        <div className="skeleton h-6 w-2/3" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton mt-4 h-16 w-full" />
        <div className="skeleton h-4 w-24" />
      </div>
    </div>
  );
}

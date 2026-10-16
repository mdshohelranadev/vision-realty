"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, MapPin, MessageCircle, Phone, SearchX } from "lucide-react";
import { ProjectGallery } from "@/components/ProjectGallery";
import { ProjectCard, ProjectName } from "@/components/ProjectCard";
import { InquiryForm } from "@/components/InquiryForm";
import { EmptyState } from "@/components/EmptyState";
import { buttonVariants } from "@/components/ui/button";
import { amenityIcon } from "@/lib/amenities";
import { useStore } from "@/lib/store";
import { cn, phoneHref, whatsappHref } from "@/lib/utils";

export function ProjectDetail({ slug }: { slug: string }) {
  const projects = useStore((s) => s.projects);
  const settings = useStore((s) => s.settings);
  const hydrated = useStore((s) => s.hydrated);
  const project = useMemo(() => projects.find((p) => p.slug === slug), [projects, slug]);

  const related = useMemo(() => {
    if (!project) return [];
    const sameArea = projects.filter((p) => p.id !== project.id && p.area === project.area);
    const sameCat = projects.filter(
      (p) => p.id !== project.id && p.category === project.category && p.area !== project.area
    );
    return [...sameArea, ...sameCat].slice(0, 3);
  }, [projects, project]);

  if (!project) {
    if (!hydrated) {
      return (
        <div className="container py-16" role="status" aria-label="Loading project">
          <div className="skeleton h-5 w-64" />
          <div className="mt-6 grid gap-8 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <div className="skeleton aspect-[16/10] w-full" />
              <div className="skeleton h-10 w-1/2" />
              <div className="skeleton h-40 w-full" />
            </div>
            <div className="skeleton h-96 w-full" />
          </div>
        </div>
      );
    }
    return (
      <div className="container py-24">
        <EmptyState
          icon={SearchX}
          title="Project not found"
          description="This project may have been moved or is no longer listed."
          action={
            <Link href="/projects" className={buttonVariants({ variant: "primary" })}>
              Back to all projects
            </Link>
          }
        />
      </div>
    );
  }

  const s = project.specifications;
  const rows: { label: string; value: string }[] = [
    { label: "Location", value: project.location },
    { label: s.buildingType ? "Building Type" : "Building", value: s.buildingType ? `${s.buildingType}, ${s.building}` : s.building },
    ...(s.totalFloorArea
      ? [{ label: "Total Floor Area", value: s.totalFloorArea }]
      : [{ label: "Apartment Size", value: s.apartmentSize }]),
    { label: "Car Parking", value: s.carParking },
    { label: s.totalApartments.match(/^\d+$/) ? "Total Apartments" : "Configuration", value: s.totalApartments },
  ];

  const waText = `Hello, I would like to know more about ${project.name}.`;

  return (
    <div className="container py-8 sm:py-10">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-500 dark:text-slate-400">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-primary dark:hover:text-accent">
              Home
            </Link>
          </li>
          <ChevronRight className="h-4 w-4" aria-hidden />
          <li>
            <Link href="/projects" className="hover:text-primary dark:hover:text-accent">
              Projects
            </Link>
          </li>
          <ChevronRight className="h-4 w-4" aria-hidden />
          <li aria-current="page" className="font-medium text-slate-900 dark:text-white">
            {project.name}
          </li>
        </ol>
      </nav>

      <div className="grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ProjectGallery project={project} />

          <header className="mt-8">
            <h1 className="font-serif text-3xl font-semibold sm:text-4xl">
              <ProjectName name={project.name} />
            </h1>
            <p className="mt-3 flex items-start gap-2 text-slate-600 dark:text-slate-400">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-primary dark:text-accent" aria-hidden />
              {project.location}
            </p>
          </header>

          <section className="mt-10" aria-labelledby="glance-heading">
            <h2 id="glance-heading" className="heading-serif text-2xl">
              Project at a Glance
            </h2>
            <div className="mt-5 overflow-hidden rounded-xl border border-slate-100 dark:border-slate-800">
              <table className="w-full text-sm">
                <tbody>
                  {rows.map((r, i) => (
                    <tr
                      key={r.label}
                      className={cn(i % 2 === 0 ? "bg-slate-50 dark:bg-slate-900/60" : "bg-white dark:bg-slate-900")}
                    >
                      <th
                        scope="row"
                        className="w-2/5 px-4 py-3.5 text-left font-semibold text-slate-700 dark:text-slate-300 sm:px-6"
                      >
                        {r.label}
                      </th>
                      <td className="px-4 py-3.5 text-slate-900 dark:text-slate-100 sm:px-6">{r.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-10" aria-labelledby="about-heading">
            <h2 id="about-heading" className="heading-serif text-2xl">
              About this project
            </h2>
            <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-300">
              {project.description}
            </p>
          </section>

          {project.amenities.length > 0 && (
            <section className="mt-10" aria-labelledby="amenities-heading">
              <h2 id="amenities-heading" className="heading-serif text-2xl">
                Amenities
              </h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {project.amenities.map((a) => {
                  const Icon = amenityIcon(a);
                  return (
                    <li
                      key={a}
                      className="flex items-center gap-3 rounded-xl border border-slate-100 p-3.5 dark:border-slate-800"
                    >
                      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary dark:bg-primary-900/40 dark:text-accent">
                        <Icon className="h-5 w-5" aria-hidden />
                      </span>
                      <span className="text-sm font-medium">{a}</span>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {project.floorPlan && (
            <section className="mt-10" aria-labelledby="plan-heading">
              <h2 id="plan-heading" className="heading-serif text-2xl">
                Floor Plan
              </h2>
              <div className="relative mt-5 aspect-[16/10] overflow-hidden rounded-xl border border-slate-100 bg-slate-100 dark:border-slate-800 dark:bg-slate-800">
                <Image
                  src={project.floorPlan}
                  alt={`${project.name} floor plan`}
                  fill
                  sizes="(min-width: 1024px) 66vw, 100vw"
                  className="object-cover"
                />
              </div>
            </section>
          )}
        </div>

        <aside className="lg:col-span-1">
          <div className="space-y-4 lg:sticky lg:top-24">
            <div className="card-base p-6 shadow-soft">
              <h2 className="font-serif text-xl font-semibold">Enquire about {project.name}</h2>
              <p className="mb-5 mt-1 text-sm text-slate-500 dark:text-slate-400">
                Leave your details and we will get back to you within one working day.
              </p>
              <InquiryForm
                projectName={project.name}
                messagePlaceholder={`I am interested in ${project.name}`}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <a
                href={phoneHref(settings.phone)}
                className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full")}
              >
                <Phone className="h-4 w-4" aria-hidden />
                Call
              </a>
              <a
                href={whatsappHref(settings.whatsapp, waText)}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "primary", size: "lg" }), "w-full")}
              >
                <MessageCircle className="h-4 w-4" aria-hidden />
                WhatsApp
              </a>
            </div>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mt-20" aria-labelledby="related-heading">
          <h2 id="related-heading" className="heading-serif mb-8 text-3xl">
            Related projects
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import { Expand } from "lucide-react";
import { Lightbox } from "@/components/Lightbox";
import { StatusBadge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";

export function ProjectGallery({ project }: { project: Project }) {
  const images = [project.image, ...project.gallery].filter(Boolean);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open image gallery"
        className="group relative block aspect-[16/10] w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800"
      >
        <Image
          src={images[active]}
          alt={`${project.name} image ${active + 1}`}
          fill
          priority
          sizes="(min-width: 1024px) 66vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
        <StatusBadge category={project.category} className="absolute left-4 top-4" />
        <span className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-slate-950/70 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
          <Expand className="h-3.5 w-3.5" aria-hidden />
          View gallery
        </span>
      </button>

      {images.length > 1 && (
        <ul className="mt-3 grid grid-cols-4 gap-3">
          {images.map((src, i) => (
            <li key={`${src}-${i}`}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show image ${i + 1}`}
                aria-current={i === active}
                className={cn(
                  "relative block aspect-[16/10] w-full overflow-hidden rounded-lg border-2 transition-all",
                  i === active
                    ? "border-accent"
                    : "border-transparent opacity-70 hover:opacity-100"
                )}
              >
                <Image src={src} alt="" fill sizes="20vw" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {open && (
        <Lightbox
          images={images}
          index={active}
          alt={project.name}
          onClose={() => setOpen(false)}
          onChange={setActive}
        />
      )}
    </div>
  );
}

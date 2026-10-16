"use client";

import Link from "next/link";
import { SearchX } from "lucide-react";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { EmptyState } from "@/components/EmptyState";
import { buttonVariants } from "@/components/ui/button";
import { useStore } from "@/lib/store";

export function EditProject({ id }: { id: string }) {
  const project = useStore((s) => s.projects.find((p) => p.id === id));
  const hydrated = useStore((s) => s.hydrated);

  if (!project) {
    if (!hydrated) {
      return (
        <div className="mx-auto max-w-4xl space-y-4" role="status" aria-label="Loading project">
          <div className="skeleton h-40 w-full" />
          <div className="skeleton h-64 w-full" />
        </div>
      );
    }
    return (
      <EmptyState
        icon={SearchX}
        title="Project not found"
        description="This project no longer exists."
        action={
          <Link href="/admin/projects" className={buttonVariants({ variant: "primary" })}>
            Back to projects
          </Link>
        }
      />
    );
  }

  // key forces a fresh form state if the underlying project changes
  return <ProjectForm key={project.id} project={project} />;
}

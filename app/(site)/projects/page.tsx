import { Suspense } from "react";
import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { ProjectsExplorer } from "@/components/ProjectsExplorer";
import { ProjectCardSkeleton } from "@/components/ProjectCard";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Browse completed, ongoing and upcoming Vision Developments projects in Uttara, Bashundhara, Cantonment, Niketon, Gulshan, Chittagong and Sylhet.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Projects | Vision Developments",
    description: "Completed, ongoing and upcoming residential and commercial projects.",
  },
};

export default function ProjectsPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Portfolio"
        title="Projects built to be lived in"
        description="Explore every Vision address across Dhaka, Chittagong and Sylhet, from handed-over buildings to the ones launching next."
      />
      <Suspense
        fallback={
          <div className="container py-16">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProjectCardSkeleton key={i} />
              ))}
            </div>
          </div>
        }
      >
        <ProjectsExplorer />
      </Suspense>
    </>
  );
}

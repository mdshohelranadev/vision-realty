// Server-safe access to the bundled project data (used by metadata, sitemap and static params).
import seedProjects from "@/data/projects.json";
import type { Project } from "@/types";

export const seed = seedProjects as unknown as Project[];

export function seedBySlug(slug: string): Project | undefined {
  return seed.find((p) => p.slug === slug);
}

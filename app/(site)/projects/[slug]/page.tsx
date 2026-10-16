import type { Metadata } from "next";
import { ProjectDetail } from "@/components/ProjectDetail";
import { seed, seedBySlug } from "@/lib/seed";
import { SITE_NAME, SITE_URL } from "@/lib/site";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return seed.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const project = seedBySlug(params.slug);
  if (!project) {
    return { title: "Project", description: "Project details from Vision Developments." };
  }
  const description = project.description.slice(0, 160);
  return {
    title: project.name,
    description,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      type: "article",
      title: `${project.name} | ${SITE_NAME}`,
      description,
      url: `${SITE_URL}/projects/${project.slug}`,
      images: [{ url: project.image, width: 1600, height: 1000, alt: project.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: project.name,
      description,
      images: [project.image],
    },
  };
}

export default function ProjectPage({ params }: Props) {
  const project = seedBySlug(params.slug);
  const jsonLd = project
    ? {
        "@context": "https://schema.org",
        "@type": "Residence",
        name: project.name,
        description: project.description,
        image: project.image,
        address: {
          "@type": "PostalAddress",
          streetAddress: [project.plot, project.road, project.sector].filter(Boolean).join(", "),
          addressLocality: project.area,
          addressRegion: project.city,
          addressCountry: "BD",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: project.coordinates.lat,
          longitude: project.coordinates.lng,
        },
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}
      <ProjectDetail slug={params.slug} />
    </>
  );
}

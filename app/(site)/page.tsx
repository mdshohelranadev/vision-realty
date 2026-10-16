import type { Metadata } from "next";
import { HeroSlider, type HeroSlide } from "@/components/HeroSlider";
import {
  CtaSection,
  FeaturedProjects,
  RecentCompleted,
  StatsBar,
  WhyChooseUs,
} from "@/components/home/HomeSections";
import { seed } from "@/lib/seed";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: `${SITE_NAME} | Premium Apartments in Dhaka, Chittagong and Sylhet` },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
};

const heroSlugs = ["vision-organza", "vision-beacon", "vision-tierra", "vision-liris"];

export default function HomePage() {
  const slides: HeroSlide[] = heroSlugs
    .map((slug) => seed.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .map((p) => ({
      src: p.image,
      name: p.name,
      location: `${p.area}, ${p.city}`,
      href: `/projects/${p.slug}`,
    }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    areaServed: ["Dhaka", "Chittagong", "Sylhet"],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HeroSlider slides={slides} />
      <FeaturedProjects />
      <WhyChooseUs />
      <StatsBar />
      <RecentCompleted />
      <CtaSection />
    </>
  );
}

import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { ContactSection } from "@/components/ContactSection";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact Vision Developments to book a site visit, request a brochure or speak with our sales team.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Talk to the Vision team"
        description="Book a site visit, ask about availability or request a project brochure."
        image="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1800&q=70"
      />
      <ContactSection />
    </>
  );
}

import Image from "next/image";

export function PageHero({
  eyebrow,
  title,
  description,
  image = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1800&q=70",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  image?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-primary-900 py-20 text-white sm:py-24">
      <Image src={image} alt="" fill sizes="100vw" priority className="-z-20 object-cover opacity-30" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary-900/95 via-primary-900/80 to-primary-800/60" />
      <div className="container">
        <span className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          <span className="h-px w-8 bg-accent" />
          {eyebrow}
        </span>
        <h1 className="max-w-3xl font-serif text-4xl font-semibold leading-tight sm:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-2xl text-base text-primary-100 sm:text-lg">{description}</p>
        )}
      </div>
    </section>
  );
}

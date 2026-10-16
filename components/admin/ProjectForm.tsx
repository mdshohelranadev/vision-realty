"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Plus, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label, Select, Textarea } from "@/components/ui/input";
import { useStore } from "@/lib/store";
import { slugify } from "@/lib/utils";
import type { NewProject, Project, ProjectCategory } from "@/types";

const ALLOWED_HOST = "images.unsplash.com";

function validUrl(v: string): boolean {
  try {
    const u = new URL(v);
    return u.protocol === "https:" && u.hostname === ALLOWED_HOST;
  } catch {
    return false;
  }
}

interface FormState {
  name: string;
  slug: string;
  category: ProjectCategory;
  status: string;
  featured: boolean;
  location: string;
  plot: string;
  road: string;
  sector: string;
  area: string;
  city: string;
  description: string;
  building: string;
  apartmentSize: string;
  carParking: string;
  totalApartments: string;
  buildingType: string;
  totalFloorArea: string;
  image: string;
  gallery: string[];
  floorPlan: string;
  amenities: string;
  lat: string;
  lng: string;
}

const statusDefaults: Record<ProjectCategory, string> = {
  complete: "Handed Over",
  ongoing: "Under Construction",
  upcoming: "Launching Soon",
};

function fromProject(p?: Project): FormState {
  return {
    name: p?.name ?? "",
    slug: p?.slug ?? "",
    category: p?.category ?? "ongoing",
    status: p?.status ?? statusDefaults.ongoing,
    featured: p?.featured ?? false,
    location: p?.location ?? "",
    plot: p?.plot ?? "",
    road: p?.road ?? "",
    sector: p?.sector ?? "",
    area: p?.area ?? "",
    city: p?.city ?? "",
    description: p?.description ?? "",
    building: p?.specifications.building ?? "",
    apartmentSize: p?.specifications.apartmentSize ?? "",
    carParking: p?.specifications.carParking ?? "",
    totalApartments: p?.specifications.totalApartments ?? "",
    buildingType: p?.specifications.buildingType ?? "",
    totalFloorArea: p?.specifications.totalFloorArea ?? "",
    image: p?.image ?? "",
    gallery: p?.gallery?.length ? p.gallery : ["", "", ""],
    floorPlan: p?.floorPlan ?? "",
    amenities: p?.amenities.join(", ") ?? "",
    lat: p ? String(p.coordinates.lat) : "23.8103",
    lng: p ? String(p.coordinates.lng) : "90.4125",
  };
}

type Errors = Record<string, string>;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="card-base p-5 shadow-soft sm:p-6">
      <h2 className="mb-5 font-serif text-lg font-semibold">{title}</h2>
      {children}
    </section>
  );
}

export function ProjectForm({ project }: { project?: Project }) {
  const router = useRouter();
  const addProject = useStore((s) => s.addProject);
  const updateProject = useStore((s) => s.updateProject);
  const [f, setF] = useState<FormState>(() => fromProject(project));
  const [errors, setErrors] = useState<Errors>({});
  const [slugTouched, setSlugTouched] = useState(!!project);
  const [saveError, setSaveError] = useState("");

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setF((prev) => ({ ...prev, [key]: value }));

  function validate(): Errors {
    const e: Errors = {};
    if (f.name.trim().length < 2) e.name = "Project name is required.";
    if (!f.location.trim()) e.location = "Location is required.";
    if (!f.area.trim()) e.area = "Area is required.";
    if (!f.city.trim()) e.city = "City is required.";
    if (f.description.trim().length < 20) e.description = "Description must be at least 20 characters.";
    if (!validUrl(f.image.trim())) e.image = `Main image must be an https URL on ${ALLOWED_HOST}.`;
    f.gallery.forEach((g, i) => {
      if (g.trim() && !validUrl(g.trim())) e[`gallery${i}`] = `Must be an https URL on ${ALLOWED_HOST}.`;
    });
    if (f.floorPlan.trim() && !validUrl(f.floorPlan.trim())) e.floorPlan = `Must be an https URL on ${ALLOWED_HOST}.`;
    if (!f.building.trim()) e.building = "Required.";
    if (!f.apartmentSize.trim()) e.apartmentSize = "Required.";
    if (!f.carParking.trim()) e.carParking = "Required.";
    if (!f.totalApartments.trim()) e.totalApartments = "Required.";
    const lat = Number(f.lat);
    const lng = Number(f.lng);
    if (Number.isNaN(lat) || lat < -90 || lat > 90) e.lat = "Enter a valid latitude.";
    if (Number.isNaN(lng) || lng < -180 || lng > 180) e.lng = "Enter a valid longitude.";
    return e;
  }

  function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const found = validate();
    setErrors(found);
    setSaveError("");
    if (Object.keys(found).length > 0) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    try {
      const payload: NewProject = {
        name: f.name.trim(),
        slug: slugify(f.slug || f.name),
        category: f.category,
        status: f.status.trim() || statusDefaults[f.category],
        featured: f.featured,
        location: f.location.trim(),
        plot: f.plot.trim(),
        road: f.road.trim(),
        sector: f.sector.trim(),
        area: f.area.trim(),
        city: f.city.trim(),
        description: f.description.trim(),
        specifications: {
          building: f.building.trim(),
          apartmentSize: f.apartmentSize.trim(),
          carParking: f.carParking.trim(),
          totalApartments: f.totalApartments.trim(),
          ...(f.buildingType.trim() ? { buildingType: f.buildingType.trim() } : {}),
          ...(f.totalFloorArea.trim() ? { totalFloorArea: f.totalFloorArea.trim() } : {}),
        },
        image: f.image.trim(),
        gallery: f.gallery.map((g) => g.trim()).filter(Boolean),
        amenities: f.amenities.split(",").map((a) => a.trim()).filter(Boolean),
        coordinates: { lat: Number(f.lat), lng: Number(f.lng) },
        floorPlan: f.floorPlan.trim() || undefined,
      };
      if (project) updateProject(project.id, payload);
      else addProject(payload);
      router.push("/admin/projects");
    } catch {
      setSaveError("The project could not be saved. Please try again.");
    }
  }

  const errCount = Object.keys(errors).length;

  return (
    <form onSubmit={onSubmit} noValidate className="mx-auto max-w-4xl space-y-6" aria-label="Project form">
      {(errCount > 0 || saveError) && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-lg bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          {saveError || `Please fix ${errCount} ${errCount === 1 ? "field" : "fields"} highlighted below.`}
        </div>
      )}

      <Section title="Basic information">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="name">Project name</Label>
            <Input
              id="name"
              value={f.name}
              onChange={(e) => {
                set("name", e.target.value);
                if (!slugTouched) set("slug", slugify(e.target.value));
              }}
              aria-invalid={!!errors.name}
            />
            <FieldError message={errors.name} />
          </div>
          <div>
            <Label htmlFor="slug">URL slug</Label>
            <Input
              id="slug"
              value={f.slug}
              onChange={(e) => {
                setSlugTouched(true);
                set("slug", slugify(e.target.value));
              }}
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              id="category"
              value={f.category}
              onChange={(e) => {
                const category = e.target.value as ProjectCategory;
                setF((prev) => ({
                  ...prev,
                  category,
                  status: Object.values(statusDefaults).includes(prev.status)
                    ? statusDefaults[category]
                    : prev.status,
                }));
              }}
            >
              <option value="complete">Complete</option>
              <option value="ongoing">Ongoing</option>
              <option value="upcoming">Upcoming</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="status">Status label</Label>
            <Input id="status" value={f.status} onChange={(e) => set("status", e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                role="switch"
                checked={f.featured}
                onChange={(e) => set("featured", e.target.checked)}
                className="peer sr-only"
              />
              <span className="relative h-6 w-11 rounded-full bg-slate-300 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-transform peer-checked:bg-primary peer-checked:after:translate-x-5 peer-focus-visible:ring-2 peer-focus-visible:ring-accent dark:bg-slate-700" />
              <span className="text-sm font-medium">Show in Featured Projects on the home page</span>
            </label>
          </div>
        </div>
      </Section>

      <Section title="Location">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="location">Full address</Label>
            <Input
              id="location"
              value={f.location}
              onChange={(e) => set("location", e.target.value)}
              aria-invalid={!!errors.location}
            />
            <FieldError message={errors.location} />
          </div>
          <div>
            <Label htmlFor="plot">Plot</Label>
            <Input id="plot" value={f.plot} onChange={(e) => set("plot", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="road">Road</Label>
            <Input id="road" value={f.road} onChange={(e) => set("road", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="sector">Sector / Block</Label>
            <Input id="sector" value={f.sector} onChange={(e) => set("sector", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="area">Area</Label>
            <Input id="area" value={f.area} onChange={(e) => set("area", e.target.value)} aria-invalid={!!errors.area} />
            <FieldError message={errors.area} />
          </div>
          <div>
            <Label htmlFor="city">City</Label>
            <Input id="city" value={f.city} onChange={(e) => set("city", e.target.value)} aria-invalid={!!errors.city} />
            <FieldError message={errors.city} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="lat">Latitude</Label>
              <Input id="lat" value={f.lat} onChange={(e) => set("lat", e.target.value)} inputMode="decimal" aria-invalid={!!errors.lat} />
              <FieldError message={errors.lat} />
            </div>
            <div>
              <Label htmlFor="lng">Longitude</Label>
              <Input id="lng" value={f.lng} onChange={(e) => set("lng", e.target.value)} inputMode="decimal" aria-invalid={!!errors.lng} />
              <FieldError message={errors.lng} />
            </div>
          </div>
        </div>
      </Section>

      <Section title="Description and specifications">
        <div className="space-y-4">
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={f.description}
              onChange={(e) => set("description", e.target.value)}
              className="min-h-[140px]"
              aria-invalid={!!errors.description}
            />
            <FieldError message={errors.description} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="building">Building</Label>
              <Input id="building" value={f.building} onChange={(e) => set("building", e.target.value)} aria-invalid={!!errors.building} />
              <FieldError message={errors.building} />
            </div>
            <div>
              <Label htmlFor="apartmentSize">Apartment size</Label>
              <Input id="apartmentSize" value={f.apartmentSize} onChange={(e) => set("apartmentSize", e.target.value)} aria-invalid={!!errors.apartmentSize} />
              <FieldError message={errors.apartmentSize} />
            </div>
            <div>
              <Label htmlFor="carParking">Car parking</Label>
              <Input id="carParking" value={f.carParking} onChange={(e) => set("carParking", e.target.value)} aria-invalid={!!errors.carParking} />
              <FieldError message={errors.carParking} />
            </div>
            <div>
              <Label htmlFor="totalApartments">Total apartments</Label>
              <Input id="totalApartments" value={f.totalApartments} onChange={(e) => set("totalApartments", e.target.value)} aria-invalid={!!errors.totalApartments} />
              <FieldError message={errors.totalApartments} />
            </div>
            <div>
              <Label htmlFor="buildingType">Building type (commercial only)</Label>
              <Input id="buildingType" value={f.buildingType} onChange={(e) => set("buildingType", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="totalFloorArea">Total floor area (commercial only)</Label>
              <Input id="totalFloorArea" value={f.totalFloorArea} onChange={(e) => set("totalFloorArea", e.target.value)} />
            </div>
          </div>
          <div>
            <Label htmlFor="amenities">Amenities (comma separated)</Label>
            <Textarea
              id="amenities"
              value={f.amenities}
              onChange={(e) => set("amenities", e.target.value)}
              className="min-h-[80px]"
            />
          </div>
        </div>
      </Section>

      <Section title="Images">
        <div className="space-y-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Image URLs must be hosted on {ALLOWED_HOST}. Add more hosts in next.config.js if needed.
          </p>
          <div>
            <Label htmlFor="image">Main image URL</Label>
            <Input id="image" value={f.image} onChange={(e) => set("image", e.target.value)} aria-invalid={!!errors.image} />
            <FieldError message={errors.image} />
          </div>
          <div>
            <Label>Gallery image URLs</Label>
            <div className="space-y-3">
              {f.gallery.map((g, i) => (
                <div key={i}>
                  <div className="flex gap-2">
                    <Input
                      value={g}
                      aria-label={`Gallery image ${i + 1} URL`}
                      onChange={(e) => set("gallery", f.gallery.map((x, idx) => (idx === i ? e.target.value : x)))}
                      aria-invalid={!!errors[`gallery${i}`]}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Remove gallery image ${i + 1}`}
                      onClick={() => set("gallery", f.gallery.filter((_, idx) => idx !== i))}
                    >
                      <X className="h-4 w-4" aria-hidden />
                    </Button>
                  </div>
                  <FieldError message={errors[`gallery${i}`]} />
                </div>
              ))}
              {f.gallery.length < 8 && (
                <Button variant="outline" size="sm" onClick={() => set("gallery", [...f.gallery, ""])}>
                  <Plus className="h-4 w-4" aria-hidden />
                  Add image
                </Button>
              )}
            </div>
          </div>
          <div>
            <Label htmlFor="floorPlan">Floor plan image URL (optional)</Label>
            <Input id="floorPlan" value={f.floorPlan} onChange={(e) => set("floorPlan", e.target.value)} aria-invalid={!!errors.floorPlan} />
            <FieldError message={errors.floorPlan} />
          </div>
        </div>
      </Section>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button variant="outline" size="lg" onClick={() => router.push("/admin/projects")}>
          Cancel
        </Button>
        <Button type="submit" size="lg">
          <Save className="h-4 w-4" aria-hidden />
          {project ? "Save changes" : "Create project"}
        </Button>
      </div>
    </form>
  );
}

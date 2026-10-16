"use client";

/**
 * Data layer. Zustand + persist (localStorage).
 * This is the ONLY file that needs to change when moving to Supabase.
 * Components call the methods below and never touch storage directly.
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import seedProjects from "@/data/projects.json";
import { slugify } from "@/lib/utils";
import type {
  CompanySettings,
  Inquiry,
  NewInquiry,
  NewProject,
  Project,
} from "@/types";

const defaultSettings: CompanySettings = {
  companyName: "Vision Developments",
  tagline: "Building homes with vision, integrity and lasting quality.",
  email: "info@visiondevelopments.com",
  phone: "+880 1700-000000",
  whatsapp: "+880 1700-000000",
  address: "House 12, Road 7, Sector 4, Uttara, Dhaka 1230, Bangladesh",
  facebook: "https://facebook.com",
  linkedin: "https://linkedin.com",
  instagram: "https://instagram.com",
  youtube: "https://youtube.com",
};

const seedInquiries: Inquiry[] = [
  {
    id: "inq-001",
    name: "Rafiq Ahmed",
    phone: "+880 1711-223344",
    email: "rafiq.ahmed@example.com",
    message: "I would like to arrange a site visit for a 1650 sft apartment this weekend.",
    projectName: "Vision Organza",
    createdAt: "2026-10-12T09:30:00.000Z",
    status: "new",
  },
  {
    id: "inq-002",
    name: "Nusrat Jahan",
    phone: "+880 1815-667788",
    email: "nusrat.jahan@example.com",
    message: "Please share the payment schedule and handover timeline for Vision D' Wealth.",
    projectName: "Vision D' Wealth",
    createdAt: "2026-10-14T14:05:00.000Z",
    status: "new",
  },
  {
    id: "inq-003",
    name: "Tanvir Hossain",
    phone: "+880 1922-445566",
    email: "tanvir.hossain@example.com",
    message: "Interested in leasing floor space at the Sylhet commercial building.",
    projectName: "Vision Trade Centre",
    createdAt: "2026-10-15T11:20:00.000Z",
    status: "read",
  },
];

interface StoreState {
  projects: Project[];
  inquiries: Inquiry[];
  settings: CompanySettings;
  hydrated: boolean;

  // Projects
  getProjects: () => Project[];
  getProjectBySlug: (slug: string) => Project | undefined;
  getProjectById: (id: string) => Project | undefined;
  addProject: (input: NewProject) => Project;
  updateProject: (id: string, patch: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  // Inquiries
  getInquiries: () => Inquiry[];
  addInquiry: (input: NewInquiry) => Inquiry;
  markInquiryRead: (id: string) => void;
  deleteInquiry: (id: string) => void;

  // Settings
  getSettings: () => CompanySettings;
  updateSettings: (patch: Partial<CompanySettings>) => void;

  setHydrated: (value: boolean) => void;
}

function uid(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

function uniqueSlug(base: string, projects: Project[], ignoreId?: string): string {
  let slug = slugify(base) || "project";
  const taken = new Set(projects.filter((p) => p.id !== ignoreId).map((p) => p.slug));
  if (!taken.has(slug)) return slug;
  let n = 2;
  while (taken.has(`${slug}-${n}`)) n += 1;
  slug = `${slug}-${n}`;
  return slug;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      projects: seedProjects as unknown as Project[],
      inquiries: seedInquiries,
      settings: defaultSettings,
      hydrated: false,

      getProjects: () => get().projects,
      getProjectBySlug: (slug) => get().projects.find((p) => p.slug === slug),
      getProjectById: (id) => get().projects.find((p) => p.id === id),

      addProject: (input) => {
        const project: Project = {
          ...input,
          id: uid("prj"),
          slug: uniqueSlug(input.slug || input.name, get().projects),
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ projects: [project, ...s.projects] }));
        return project;
      },

      updateProject: (id, patch) =>
        set((s) => ({
          projects: s.projects.map((p) => {
            if (p.id !== id) return p;
            const next = { ...p, ...patch };
            if (patch.slug !== undefined || patch.name !== undefined) {
              next.slug = uniqueSlug(patch.slug || next.name, s.projects, id);
            }
            return next;
          }),
        })),

      deleteProject: (id) =>
        set((s) => ({ projects: s.projects.filter((p) => p.id !== id) })),

      getInquiries: () => get().inquiries,

      addInquiry: (input) => {
        const inquiry: Inquiry = {
          ...input,
          id: uid("inq"),
          createdAt: new Date().toISOString(),
          status: "new",
        };
        set((s) => ({ inquiries: [inquiry, ...s.inquiries] }));
        return inquiry;
      },

      markInquiryRead: (id) =>
        set((s) => ({
          inquiries: s.inquiries.map((i) => (i.id === id ? { ...i, status: "read" } : i)),
        })),

      deleteInquiry: (id) =>
        set((s) => ({ inquiries: s.inquiries.filter((i) => i.id !== id) })),

      getSettings: () => get().settings,
      updateSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),

      setHydrated: (value) => set({ hydrated: value }),
    }),
    {
      name: "vision-store-v1",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (s) => ({
        projects: s.projects,
        inquiries: s.inquiries,
        settings: s.settings,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);

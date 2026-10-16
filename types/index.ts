export type ProjectCategory = "complete" | "ongoing" | "upcoming";

export interface ProjectSpecifications {
  /** Storey count or building description, e.g. "07 Storied" */
  building: string;
  /** Apartment size range, e.g. "1250 SFT / 2500 SFT" */
  apartmentSize: string;
  /** Number of car parking bays, e.g. "10" */
  carParking: string;
  /** Total apartments, e.g. "12" */
  totalApartments: string;
  /** Commercial projects only */
  buildingType?: string;
  totalFloorArea?: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Project {
  id: string;
  slug: string;
  name: string;
  category: ProjectCategory;
  location: string;
  plot: string;
  road: string;
  sector: string;
  area: string;
  city: string;
  description: string;
  featured: boolean;
  status: string;
  specifications: ProjectSpecifications;
  image: string;
  gallery: string[];
  amenities: string[];
  coordinates: Coordinates;
  floorPlan?: string;
  createdAt: string;
}

export type InquiryStatus = "new" | "read";

export interface Inquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  projectName?: string;
  createdAt: string;
  status: InquiryStatus;
}

export interface CompanySettings {
  companyName: string;
  tagline: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  facebook: string;
  linkedin: string;
  instagram: string;
  youtube: string;
}

export type NewProject = Omit<Project, "id" | "createdAt">;
export type NewInquiry = Omit<Inquiry, "id" | "createdAt" | "status">;

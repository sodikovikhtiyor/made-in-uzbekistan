import type { Role, RFQStatus } from "@prisma/client";

export type { Role, RFQStatus };

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  image?: string | null;
}

export interface ProductWithCompany {
  id: string;
  name: string;
  description: string | null;
  images: string[];
  price: number | null;
  minOrder: number | null;
  unit: string | null;
  exportReady: boolean;
  company: {
    id: string;
    name: string;
    verified: boolean;
    region: string | null;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

export interface SearchParams {
  q?: string;
  category?: string;
  industry?: string;
  region?: string;
  sort?: string;
  page?: string;
}

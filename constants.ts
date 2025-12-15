import { Category } from "./types";

export const APP_NAME = "Made-In-Uzbekistan";

export const CATEGORIES: Category[] = [
  {
    id: '1',
    name: 'Textiles & Silk',
    slug: 'textiles',
    image: 'https://picsum.photos/id/400/800/600' // Placeholder for Silk/Ikat
  },
  {
    id: '2',
    name: 'Agriculture & Dried Fruits',
    slug: 'agriculture',
    image: 'https://picsum.photos/id/292/800/600' // Placeholder for produce
  },
  {
    id: '3',
    name: 'Ceramics & Handicrafts',
    slug: 'handicrafts',
    image: 'https://picsum.photos/id/160/800/600' // Placeholder for crafts
  },
  {
    id: '4',
    name: 'Construction Materials',
    slug: 'construction',
    image: 'https://picsum.photos/id/56/800/600'
  },
  {
    id: '5',
    name: 'Chemical Industry',
    slug: 'chemical',
    image: 'https://picsum.photos/id/20/800/600'
  }
];

// Mock Supabase Config for visual display if keys are missing
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://xyz.supabase.co";
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1...";

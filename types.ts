export enum UserRole {
  BUYER = 'buyer',
  SUPPLIER = 'supplier',
  ADMIN = 'admin'
}

export type RFQStatus = 'open' | 'closed' | 'awarded' | 'PENDING' | 'QUOTED';
export type QuoteStatus = 'draft' | 'sent' | 'accepted' | 'rejected';

export interface Profile {
  id: string;
  email: string;
  role: UserRole;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
}

export interface Supplier {
  id: string;
  profile_id: string;
  company_name: string;
  description: string;
  location: string;
  logo_url?: string;
  website?: string;
  established_year?: number;
  verified: boolean;
}

export interface SupplierDocument {
  id: string;
  supplier_id: string;
  document_type: string;
  file_url: string;
  status: 'pending' | 'verified' | 'rejected';
  uploaded_at: string;
}

export interface Product {
  id: string;
  supplier_id: string;
  name: string;
  description: string;
  category: string;
  price_min: number;
  price_max: number;
  moq: number;
  unit: string;
  // Join fields
  supplier?: Supplier;
  images?: ProductImage[];
  // Legacy support for mockData
  image_url?: string; 
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  is_primary: boolean;
}

export interface RFQ {
  id: string;
  buyer_id: string;
  title?: string;
  message: string;
  quantity: number;
  unit?: string;
  status: RFQStatus;
  created_at: string;
  
  // Optional links for UI
  product_id?: string; // If linked to a specific product initially
  product_name?: string; 
  product_image?: string;
}

export interface RFQResponse {
  id: string;
  rfq_id: string;
  supplier_id: string;
  price_per_unit: number;
  total_price: number;
  shipping_terms: string;
  lead_time_days: number;
  message: string;
  status: QuoteStatus;
  valid_until: string;
  created_at: string;
}

export interface Message {
  id: string;
  rfq_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
}
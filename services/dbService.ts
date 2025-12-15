import { createClient } from '@supabase/supabase-js';
import { MOCK_PRODUCTS, MOCK_RFQS, MOCK_SUPPLIERS } from './mockData';
import { Product, RFQ } from '../types';

// Initialize Supabase (Use environment variables in real app)
// If keys are missing, we gracefully fall back to mock data logic within functions
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string || '';
const isConfigured = supabaseUrl && supabaseAnonKey;

export const supabase = isConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

// Helper to simulate network delay for mock data
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const dbService = {
  async getProducts(category?: string): Promise<Product[]> {
    if (supabase) {
      let query = supabase.from('products').select('*, supplier:suppliers(*)');
      if (category) {
        query = query.eq('category', category);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data as Product[];
    }
    
    // Mock Fallback
    await delay(500);
    if (category) {
      return MOCK_PRODUCTS.filter(p => p.category.toLowerCase().includes(category.toLowerCase()));
    }
    return MOCK_PRODUCTS;
  },

  async getProductById(id: string): Promise<Product | undefined> {
    if (supabase) {
      const { data, error } = await supabase.from('products').select('*, supplier:suppliers(*)').eq('id', id).single();
      if (error) throw error;
      return data as Product;
    }

    await delay(300);
    return MOCK_PRODUCTS.find(p => p.id === id);
  },

  async createRFQ(rfqData: Omit<RFQ, 'id' | 'created_at' | 'status'>): Promise<void> {
    if (supabase) {
      const { error } = await supabase.from('rfqs').insert([{
        ...rfqData,
        status: 'PENDING'
      }]);
      if (error) throw error;
      return;
    }

    console.log("Mock RFQ Created:", rfqData);
    await delay(800);
    return;
  },

  async getBuyerRFQs(buyerId: string): Promise<RFQ[]> {
    if (supabase) {
      const { data, error } = await supabase.from('rfqs').select('*, products(name)').eq('buyer_id', buyerId);
      if (error) throw error;
      // Map product name for display simplicity
      return data.map((d: any) => ({ ...d, product_name: d.products?.name })) as RFQ[];
    }
    
    await delay(500);
    return MOCK_RFQS.filter(r => r.buyer_id === buyerId);
  }
};
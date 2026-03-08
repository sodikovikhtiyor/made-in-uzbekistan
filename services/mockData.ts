import { Product, Supplier, RFQ, UserRole, Profile } from "../types";

export const MOCK_USER: Profile = {
  id: 'user-123',
  email: 'buyer@example.com',
  role: UserRole.BUYER,
  full_name: 'John Doe Global Imports',
  created_at: new Date().toISOString()
};

export const MOCK_SUPPLIERS: Supplier[] = [
  {
    id: 'sup-1',
    profile_id: 'prof-1',
    company_name: 'Samarkand Silk Co.',
    description: 'Premier manufacturer of traditional silk and ikat fabrics located in the heart of Samarkand.',
    verified: true,
    location: 'Samarkand, Uzbekistan',
    logo_url: 'https://picsum.photos/id/1011/200/200',
    established_year: 1995
  },
  {
    id: 'sup-2',
    profile_id: 'prof-2',
    company_name: 'Tashkent Agro Export',
    description: 'Leading exporter of dried fruits, nuts, and legumes.',
    verified: true,
    location: 'Tashkent, Uzbekistan',
    logo_url: 'https://picsum.photos/id/1012/200/200',
    established_year: 2010
  }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    supplier_id: 'sup-1',
    name: 'Traditional Adras (Ikat) Fabric',
    description: 'Hand-woven silk and cotton blend adras. Perfect for fashion and interior design. 50cm width.',
    category: 'Textiles & Silk',
    price_min: 5.50,
    price_max: 8.00,
    moq: 100,
    unit: 'Meters',
    image_url: 'https://picsum.photos/id/364/600/600',
    supplier: MOCK_SUPPLIERS[0]
  },
  {
    id: 'prod-2',
    supplier_id: 'sup-2',
    name: 'Organic Dried Apricots (Subhon)',
    description: 'Sun-dried sweet apricots without sulfur. Premium quality class A.',
    category: 'Agriculture & Dried Fruits',
    price_min: 2500,
    price_max: 3200,
    moq: 500,
    unit: 'Kilograms',
    image_url: 'https://picsum.photos/id/493/600/600',
    supplier: MOCK_SUPPLIERS[1]
  },
  {
    id: 'prod-3',
    supplier_id: 'sup-1',
    name: 'Raw Silk Skeins',
    description: '100% natural raw silk, undyed. High tensile strength.',
    category: 'Textiles & Silk',
    price_min: 45,
    price_max: 60,
    moq: 20,
    unit: 'Kilograms',
    image_url: 'https://picsum.photos/id/250/600/600',
    supplier: MOCK_SUPPLIERS[0]
  },
  {
    id: 'prod-4',
    supplier_id: 'sup-2',
    name: 'Uzbek Almonds (Paper Shell)',
    description: 'Easily cracked paper shell almonds. Rich in flavor.',
    category: 'Agriculture & Dried Fruits',
    price_min: 8000,
    price_max: 9500,
    moq: 1000,
    unit: 'Kilograms',
    image_url: 'https://picsum.photos/id/308/600/600',
    supplier: MOCK_SUPPLIERS[1]
  }
];

export const MOCK_RFQS: RFQ[] = [
  {
    id: 'rfq-1',
    buyer_id: 'user-123',
    product_id: 'prod-1',
    product_name: 'Traditional Adras (Ikat) Fabric',
    message: 'We are looking for 500 meters for a summer collection. Do you have red patterns?',
    quantity: 500,
    status: 'PENDING',
    created_at: new Date().toISOString()
  },
  {
    id: 'rfq-2',
    buyer_id: 'user-123',
    product_id: 'prod-2',
    product_name: 'Organic Dried Apricots',
    message: 'Inquiry about bulk shipping to Germany. Certificates required.',
    quantity: 2000,
    status: 'QUOTED',
    created_at: new Date(Date.now() - 86400000).toISOString()
  }
];
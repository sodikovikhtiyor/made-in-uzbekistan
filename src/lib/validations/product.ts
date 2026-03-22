import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  nameRu: z.string().optional(),
  nameUz: z.string().optional(),
  description: z.string().optional(),
  descriptionRu: z.string().optional(),
  descriptionUz: z.string().optional(),
  categoryId: z.string().optional(),
  minOrder: z.coerce.number().int().positive().optional(),
  unit: z.string().optional(),
  price: z.coerce.number().positive().optional(),
  specs: z.record(z.string()).optional(),
  exportReady: z.boolean(),
  hsCode: z.string().optional(),
  images: z.array(z.string()).optional(),
});

export type ProductInput = z.infer<typeof productSchema>;

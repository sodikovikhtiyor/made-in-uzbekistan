import { z } from "zod";

export const rfqSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().optional(),
  productId: z.string().optional(),
  companyId: z.string().optional(),
  quantity: z.coerce.number().int().positive().optional(),
  unit: z.string().optional(),
  budget: z.coerce.number().positive().optional(),
  deadline: z.string().optional(),
});

export const quoteSchema = z.object({
  rfqId: z.string(),
  price: z.coerce.number().positive("Price must be positive"),
  minOrder: z.coerce.number().int().positive().optional(),
  leadTime: z.string().optional(),
  notes: z.string().optional(),
});

export type RFQInput = z.infer<typeof rfqSchema>;
export type QuoteInput = z.infer<typeof quoteSchema>;

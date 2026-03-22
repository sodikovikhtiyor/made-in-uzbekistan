import { z } from "zod";

export const companySchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters"),
  nameRu: z.string().optional(),
  nameUz: z.string().optional(),
  description: z.string().optional(),
  descriptionRu: z.string().optional(),
  descriptionUz: z.string().optional(),
  industry: z.string().optional(),
  region: z.string().optional(),
  city: z.string().optional(),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  logo: z.string().optional(),
  banner: z.string().optional(),
});

export type CompanyInput = z.infer<typeof companySchema>;

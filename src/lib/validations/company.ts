import { z } from "zod";

export const companySchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters"),
  description: z.string().optional(),
  industry: z.string().optional(),
  region: z.string().optional(),
  city: z.string().optional(),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
});

export type CompanyInput = z.infer<typeof companySchema>;

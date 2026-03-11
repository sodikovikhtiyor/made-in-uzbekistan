"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { companySchema, type CompanyInput } from "@/lib/validations/company";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const industries = [
  "Textiles & Apparel",
  "Food & Agriculture",
  "Building Materials",
  "Minerals & Metals",
  "Leather & Footwear",
  "Electronics",
  "Chemicals",
  "Furniture",
  "Other",
];

const regions = [
  "Tashkent",
  "Samarkand",
  "Bukhara",
  "Fergana",
  "Namangan",
  "Andijan",
  "Kashkadarya",
  "Surkhandarya",
  "Khorezm",
  "Navoi",
  "Jizzakh",
  "Syrdarya",
  "Karakalpakstan",
];

export default function NewCompanyPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CompanyInput>({
    resolver: zodResolver(companySchema),
  });

  async function onSubmit(data: CompanyInput) {
    setError("");
    const res = await fetch("/api/companies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const body = await res.json();
      setError(body.error || "Failed to create company");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-gray-900">Create Company Profile</h1>
      <p className="mt-1 text-sm text-gray-500">
        Set up your company to start listing products
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        {error && (
          <div className="rounded-md bg-danger-light p-3 text-sm text-danger">
            {error}
          </div>
        )}

        <Input
          id="name"
          label="Company Name"
          placeholder="Uzbek Textiles LLC"
          error={errors.name?.message}
          {...register("name")}
        />

        <Textarea
          id="description"
          label="Description"
          placeholder="Tell buyers about your company..."
          rows={4}
          error={errors.description?.message}
          {...register("description")}
        />

        <div>
          <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
            Industry
          </label>
          <select
            id="industry"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            {...register("industry")}
          >
            <option value="">Select industry</option>
            {industries.map((i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="region" className="block text-sm font-medium text-gray-700">
            Region
          </label>
          <select
            id="region"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            {...register("region")}
          >
            <option value="">Select region</option>
            {regions.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <Input
          id="city"
          label="City"
          placeholder="Tashkent"
          error={errors.city?.message}
          {...register("city")}
        />

        <Input
          id="website"
          label="Website (optional)"
          placeholder="https://example.com"
          error={errors.website?.message}
          {...register("website")}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Company Profile"}
        </Button>
      </form>
    </div>
  );
}

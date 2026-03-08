"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { rfqSchema, type RFQInput } from "@/lib/validations/rfq";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

function NewRFQForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RFQInput>({
    resolver: zodResolver(rfqSchema),
    defaultValues: {
      productId: searchParams.get("productId") || undefined,
      companyId: searchParams.get("companyId") || undefined,
    },
  });

  async function onSubmit(data: RFQInput) {
    setError("");
    const res = await fetch("/api/rfq", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const body = await res.json();
      setError(body.error || "Failed to submit RFQ");
      return;
    }

    const rfq = await res.json();
    router.push(`/rfq/${rfq.id}`);
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-gray-900">Submit Request for Quote</h1>
      <p className="mt-1 text-sm text-gray-500">
        Describe what you need and manufacturers will send you quotes
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        {error && (
          <div className="rounded-md bg-danger-light p-3 text-sm text-danger">
            {error}
          </div>
        )}

        <Input
          id="title"
          label="Title"
          placeholder="Looking for cotton fabric supplier..."
          error={errors.title?.message}
          {...register("title")}
        />

        <Textarea
          id="description"
          label="Description"
          placeholder="Describe what you need, quality requirements, certifications..."
          rows={5}
          error={errors.description?.message}
          {...register("description")}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            id="quantity"
            type="number"
            label="Quantity"
            placeholder="1000"
            error={errors.quantity?.message}
            {...register("quantity")}
          />
          <Input
            id="unit"
            label="Unit"
            placeholder="kg, meters, pieces..."
            error={errors.unit?.message}
            {...register("unit")}
          />
        </div>

        <Input
          id="budget"
          type="number"
          step="0.01"
          label="Budget (USD, optional)"
          placeholder="5000"
          error={errors.budget?.message}
          {...register("budget")}
        />

        <Input
          id="deadline"
          type="date"
          label="Deadline (optional)"
          error={errors.deadline?.message}
          {...register("deadline")}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit RFQ"}
        </Button>
      </form>
    </div>
  );
}

export default function NewRFQPage() {
  return (
    <Suspense fallback={<div className="py-16 text-center text-gray-500">Loading...</div>}>
      <NewRFQForm />
    </Suspense>
  );
}

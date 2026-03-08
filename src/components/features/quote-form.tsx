"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { quoteSchema, type QuoteInput } from "@/lib/validations/rfq";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function QuoteForm({ rfqId }: { rfqId: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<QuoteInput>({
    resolver: zodResolver(quoteSchema),
    defaultValues: { rfqId },
  });

  async function onSubmit(data: QuoteInput) {
    setError("");
    const res = await fetch("/api/rfq/quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const body = await res.json();
      setError(body.error || "Failed to submit quote");
      return;
    }

    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="rounded-md bg-danger-light p-3 text-sm text-danger">
          {error}
        </div>
      )}

      <input type="hidden" {...register("rfqId")} />

      <div className="grid grid-cols-2 gap-4">
        <Input
          id="price"
          type="number"
          step="0.01"
          label="Price (USD)"
          placeholder="0.00"
          error={errors.price?.message}
          {...register("price")}
        />
        <Input
          id="minOrder"
          type="number"
          label="Min. Order Qty"
          placeholder="100"
          error={errors.minOrder?.message}
          {...register("minOrder")}
        />
      </div>

      <Input
        id="leadTime"
        label="Lead Time"
        placeholder="2-3 weeks"
        error={errors.leadTime?.message}
        {...register("leadTime")}
      />

      <Textarea
        id="notes"
        label="Notes"
        placeholder="Additional details about your quote..."
        rows={3}
        error={errors.notes?.message}
        {...register("notes")}
      />

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Quote"}
      </Button>
    </form>
  );
}

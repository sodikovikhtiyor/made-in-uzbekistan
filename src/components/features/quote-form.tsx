"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { quoteSchema, type QuoteInput } from "@/lib/validations/rfq";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export function QuoteForm({ rfqId }: { rfqId: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const t = useTranslations("rfq");
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
      setError(body.error || t("failedToSubmit"));
      return;
    }

    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="rounded-md bg-danger-light p-3 text-sm text-danger">{error}</div>
      )}

      <input type="hidden" {...register("rfqId")} />

      <div className="grid grid-cols-2 gap-4">
        <Input
          id="price"
          type="number"
          step="0.01"
          label={t("priceLabel")}
          placeholder="0.00"
          error={errors.price?.message}
          {...register("price")}
        />
        <Input
          id="minOrder"
          type="number"
          label={t("minOrderLabel")}
          placeholder="100"
          error={errors.minOrder?.message}
          {...register("minOrder")}
        />
      </div>

      <Input
        id="leadTime"
        label={t("leadTimeLabel")}
        placeholder={t("leadTimePlaceholder")}
        error={errors.leadTime?.message}
        {...register("leadTime")}
      />

      <Textarea
        id="notes"
        label={t("notesLabel")}
        placeholder={t("notesPlaceholder")}
        rows={3}
        error={errors.notes?.message}
        {...register("notes")}
      />

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? t("submitting") : t("submitQuote")}
      </Button>
    </form>
  );
}

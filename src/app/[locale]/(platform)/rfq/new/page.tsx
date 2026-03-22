"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { rfqSchema, type RFQInput } from "@/lib/validations/rfq";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

function NewRFQForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const t = useTranslations("newRfq");

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
      setError(body.error || t("failedToSubmit"));
      return;
    }

    const rfq = await res.json();
    router.push(`/rfq/${rfq.id}`);
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
      <p className="mt-1 text-sm text-gray-500">
        {t("subtitle")}
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        {error && (
          <div className="rounded-md bg-danger-light p-3 text-sm text-danger">
            {error}
          </div>
        )}

        <Input
          id="title"
          label={t("titleLabel")}
          placeholder={t("titlePlaceholder")}
          error={errors.title?.message}
          {...register("title")}
        />

        <Textarea
          id="description"
          label={t("descriptionLabel")}
          placeholder={t("descriptionPlaceholder")}
          rows={5}
          error={errors.description?.message}
          {...register("description")}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            id="quantity"
            type="number"
            label={t("quantityLabel")}
            placeholder={t("quantityPlaceholder")}
            error={errors.quantity?.message}
            {...register("quantity")}
          />
          <Input
            id="unit"
            label={t("unitLabel")}
            placeholder={t("unitPlaceholder")}
            error={errors.unit?.message}
            {...register("unit")}
          />
        </div>

        <Input
          id="budget"
          type="number"
          step="0.01"
          label={t("budgetLabel")}
          placeholder="5000"
          error={errors.budget?.message}
          {...register("budget")}
        />

        <Input
          id="deadline"
          type="date"
          label={t("deadlineLabel")}
          error={errors.deadline?.message}
          {...register("deadline")}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? t("submitting") : t("submitButton")}
        </Button>
      </form>
    </div>
  );
}

export default function NewRFQPage() {
  const t = useTranslations("newRfq");
  return (
    <Suspense fallback={<div className="py-16 text-center text-gray-500">{t("loading")}</div>}>
      <NewRFQForm />
    </Suspense>
  );
}

"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, type ProductInput } from "@/lib/validations/product";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const t = useTranslations("newProduct");
  const [categories, setCategories] = useState<
    { id: string; name: string; slug: string }[]
  >([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: { exportReady: false },
  });

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => setCategories(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data && !data.error) {
          reset({
            name: data.name ?? "",
            nameRu: data.nameRu ?? "",
            nameUz: data.nameUz ?? "",
            description: data.description ?? "",
            descriptionRu: data.descriptionRu ?? "",
            descriptionUz: data.descriptionUz ?? "",
            categoryId: data.categoryId ?? "",
            price: data.price ?? undefined,
            unit: data.unit ?? "",
            minOrder: data.minOrder ?? undefined,
            hsCode: data.hsCode ?? "",
            exportReady: data.exportReady ?? false,
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, reset]);

  async function onSubmit(data: ProductInput) {
    setError("");
    const res = await fetch(`/api/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const body = await res.json();
      setError(body.error || t("failedToCreate"));
      return;
    }

    router.push(`/products/${id}`);
    router.refresh();
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <p className="text-sm text-gray-500">{t("loading")}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-gray-900">{t("editTitle")}</h1>
      <p className="mt-1 text-sm text-gray-500">{t("editSubtitle")}</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        {error && (
          <div className="rounded-md bg-danger-light p-3 text-sm text-danger">
            {error}
          </div>
        )}

        <Input
          id="name"
          label={t("nameLabel")}
          placeholder={t("namePlaceholder")}
          error={errors.name?.message}
          {...register("name")}
        />

        <Textarea
          id="description"
          label={t("descriptionLabel")}
          placeholder={t("descriptionPlaceholder")}
          rows={5}
          error={errors.description?.message}
          {...register("description")}
        />

        <div>
          <label
            htmlFor="categoryId"
            className="block text-sm font-medium text-gray-700"
          >
            {t("categoryLabel")}
          </label>
          <select
            id="categoryId"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            {...register("categoryId")}
          >
            <option value="">{t("selectCategory")}</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

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
            id="unit"
            label={t("unitLabel")}
            placeholder={t("unitPlaceholder")}
            error={errors.unit?.message}
            {...register("unit")}
          />
        </div>

        <Input
          id="minOrder"
          type="number"
          label={t("minOrderLabel")}
          placeholder="100"
          error={errors.minOrder?.message}
          {...register("minOrder")}
        />

        <Input
          id="hsCode"
          label={t("hsCodeLabel")}
          placeholder="5208.11"
          error={errors.hsCode?.message}
          {...register("hsCode")}
        />

        <div className="flex items-center gap-2">
          <input
            id="exportReady"
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            {...register("exportReady")}
          />
          <label htmlFor="exportReady" className="text-sm text-gray-700">
            {t("exportReadyLabel")}
          </label>
        </div>

        <div className="rounded-md border p-4 space-y-4">
          <p className="text-sm font-medium text-gray-700">{t("translationsSection")}</p>

          <Input
            id="nameRu"
            label={t("nameRu")}
            placeholder=""
            {...register("nameRu")}
          />

          <Input
            id="nameUz"
            label={t("nameUz")}
            placeholder=""
            {...register("nameUz")}
          />

          <Textarea
            id="descriptionRu"
            label={t("descriptionRu")}
            rows={3}
            {...register("descriptionRu")}
          />

          <Textarea
            id="descriptionUz"
            label={t("descriptionUz")}
            rows={3}
            {...register("descriptionUz")}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? t("saving") : t("saveButton")}
        </Button>
      </form>
    </div>
  );
}

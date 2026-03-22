"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { companySchema, type CompanyInput } from "@/lib/validations/company";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/ui/image-upload";
import { useTranslations } from "next-intl";

const industryKeys = [
  "textiles", "food", "building", "minerals", "leather",
  "electronics", "chemicals", "furniture", "other",
] as const;

const industryValues: Record<string, string> = {
  textiles: "Textiles & Apparel",
  food: "Food & Agriculture",
  building: "Building Materials",
  minerals: "Minerals & Metals",
  leather: "Leather & Footwear",
  electronics: "Electronics",
  chemicals: "Chemicals",
  furniture: "Furniture",
  other: "Other",
};

const regionKeys = [
  "tashkent", "samarkand", "bukhara", "fergana", "namangan",
  "andijan", "kashkadarya", "surkhandarya", "khorezm", "navoi",
  "jizzakh", "syrdarya", "karakalpakstan",
] as const;

const regionValues: Record<string, string> = {
  tashkent: "Tashkent",
  samarkand: "Samarkand",
  bukhara: "Bukhara",
  fergana: "Fergana",
  namangan: "Namangan",
  andijan: "Andijan",
  kashkadarya: "Kashkadarya",
  surkhandarya: "Surkhandarya",
  khorezm: "Khorezm",
  navoi: "Navoi",
  jizzakh: "Jizzakh",
  syrdarya: "Syrdarya",
  karakalpakstan: "Karakalpakstan",
};

export default function NewCompanyPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [logo, setLogo] = useState("");
  const [banner, setBanner] = useState("");
  const t = useTranslations("company");
  const ti = useTranslations("industries");
  const tr = useTranslations("regions");
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
      body: JSON.stringify({ ...data, logo, banner }),
    });

    if (!res.ok) {
      const body = await res.json();
      setError(body.error || t("failedToCreate"));
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-gray-900">{t("createTitle")}</h1>
      <p className="mt-1 text-sm text-gray-500">
        {t("createSubtitle")}
      </p>

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
          rows={4}
          error={errors.description?.message}
          {...register("description")}
        />

        <div>
          <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
            {t("industryLabel")}
          </label>
          <select
            id="industry"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            {...register("industry")}
          >
            <option value="">{t("selectIndustry")}</option>
            {industryKeys.map((key) => (
              <option key={key} value={industryValues[key]}>{ti(key)}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="region" className="block text-sm font-medium text-gray-700">
            {t("regionLabel")}
          </label>
          <select
            id="region"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            {...register("region")}
          >
            <option value="">{t("selectRegion")}</option>
            {regionKeys.map((key) => (
              <option key={key} value={regionValues[key]}>{tr(key)}</option>
            ))}
          </select>
        </div>

        <Input
          id="city"
          label={t("cityLabel")}
          placeholder={t("cityPlaceholder")}
          error={errors.city?.message}
          {...register("city")}
        />

        <Input
          id="website"
          label={t("websiteLabel")}
          placeholder="https://example.com"
          error={errors.website?.message}
          {...register("website")}
        />

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

        {/* Images */}
        <div className="space-y-4 rounded-md border p-4">
          <p className="text-sm font-medium text-gray-700">Images</p>
          <ImageUpload
            value={logo}
            onChange={setLogo}
            folder="logos"
            label="Company Logo"
            aspectRatio="square"
          />
          <ImageUpload
            value={banner}
            onChange={setBanner}
            folder="banners"
            label="Company Banner"
            aspectRatio="banner"
          />
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? t("creating") : t("createButton")}
        </Button>
      </form>
    </div>
  );
}

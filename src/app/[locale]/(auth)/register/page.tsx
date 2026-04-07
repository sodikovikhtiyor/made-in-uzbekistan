"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { useTranslations } from "next-intl";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const t = useTranslations("auth");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "BUYER" },
  });

  const selectedRole = watch("role");

  async function onSubmit(data: RegisterInput) {
    setError("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const body = await res.json();
      setError(body.error || t("registrationFailed"));
      return;
    }

    router.push("/login?registered=true");
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-gradient-to-br from-primary-light to-white px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">{t("registerTitle")}</h1>
          <p className="mt-2 text-sm text-gray-500">
            {t("hasAccount")}{" "}
            <Link href="/login" className="text-primary hover:text-primary-dark">
              {t("signIn")}
            </Link>
          </p>
        </div>

        <OAuthButtons />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs text-gray-400">
            <span className="bg-white px-3">{t("orContinueWith")}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="rounded-md bg-danger-light p-3 text-sm text-danger">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {t("iWantTo")}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex cursor-pointer items-center justify-center rounded-md border-2 p-3 text-sm font-medium transition ${
                  selectedRole === "BUYER"
                    ? "border-primary bg-primary-light text-primary"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                <input type="radio" value="BUYER" className="sr-only" {...register("role")} />
                {t("buyProducts")}
              </label>
              <label
                className={`flex cursor-pointer items-center justify-center rounded-md border-2 p-3 text-sm font-medium transition ${
                  selectedRole === "MANUFACTURER"
                    ? "border-primary bg-primary-light text-primary"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                <input type="radio" value="MANUFACTURER" className="sr-only" {...register("role")} />
                {t("sellProducts")}
              </label>
            </div>
          </div>

          <Input
            id="name"
            label={t("fullNameLabel")}
            placeholder={t("fullNamePlaceholder")}
            error={errors.name?.message}
            {...register("name")}
          />

          <Input
            id="email"
            type="email"
            label={t("emailLabel")}
            placeholder={t("emailPlaceholder")}
            error={errors.email?.message}
            {...register("email")}
          />

          <Input
            id="password"
            type="password"
            label={t("passwordLabel")}
            placeholder={t("passwordMinLength")}
            error={errors.password?.message}
            {...register("password")}
          />

          <Input
            id="confirmPassword"
            type="password"
            label={t("confirmPasswordLabel")}
            placeholder={t("confirmPasswordPlaceholder")}
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? t("creatingAccount") : t("createAccount")}
          </Button>
        </form>
      </div>
    </div>
  );
}

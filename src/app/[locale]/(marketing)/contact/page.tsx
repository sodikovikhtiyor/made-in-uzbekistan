"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const t = useTranslations("contact");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900">{t("title")}</h1>
      <p className="mt-2 text-gray-600">{t("subtitle")}</p>

      <div className="mt-12 grid gap-12 lg:grid-cols-2">
        <div>
          {submitted ? (
            <div className="rounded-lg bg-accent-light p-6 text-center">
              <h3 className="text-lg font-semibold text-accent-dark">{t("messageSent")}</h3>
              <p className="mt-2 text-sm text-accent">{t("messageResponse")}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input id="name" label={t("nameLabel")} placeholder={t("namePlaceholder")} required />
              <Input id="email" type="email" label={t("emailLabel")} placeholder={t("emailPlaceholder")} required />
              <Textarea id="message" label={t("messageLabel")} placeholder={t("messagePlaceholder")} rows={5} required />
              <Button type="submit" className="w-full">{t("sendMessage")}</Button>
            </form>
          )}
        </div>

        <div className="space-y-6">
          <div className="flex items-start gap-3">
            <Mail className="mt-1 h-5 w-5 text-primary" />
            <div>
              <h3 className="font-medium text-gray-900">{t("emailTitle")}</h3>
              <p className="mt-1 text-sm text-gray-500">info@madeinuzbekistan.com</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="mt-1 h-5 w-5 text-primary" />
            <div>
              <h3 className="font-medium text-gray-900">{t("locationTitle")}</h3>
              <p className="mt-1 text-sm text-gray-500">{t("location")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

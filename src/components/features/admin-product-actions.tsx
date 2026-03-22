"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export function AdminProductActions({
  productId,
  active,
}: {
  productId: string;
  active: boolean;
}) {
  const router = useRouter();
  const t = useTranslations("admin");

  async function toggleActive() {
    await fetch("/api/admin/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, active: !active }),
    });
    router.refresh();
  }

  return (
    <Button
      variant={active ? "danger" : "primary"}
      size="sm"
      onClick={toggleActive}
    >
      {active ? t("deactivate") : t("activate")}
    </Button>
  );
}

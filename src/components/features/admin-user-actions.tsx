"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export function AdminUserActions({
  userId,
  verified,
}: {
  userId: string;
  verified: boolean;
}) {
  const router = useRouter();
  const t = useTranslations("admin");

  async function toggleVerify() {
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, verified: !verified }),
    });
    router.refresh();
  }

  return (
    <Button
      variant={verified ? "outline" : "primary"}
      size="sm"
      onClick={toggleVerify}
    >
      {verified ? t("unverify") : t("verify")}
    </Button>
  );
}

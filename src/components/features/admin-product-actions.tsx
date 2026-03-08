"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function AdminProductActions({
  productId,
  active,
}: {
  productId: string;
  active: boolean;
}) {
  const router = useRouter();

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
      {active ? "Deactivate" : "Activate"}
    </Button>
  );
}

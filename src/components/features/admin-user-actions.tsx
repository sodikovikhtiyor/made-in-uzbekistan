"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function AdminUserActions({
  userId,
  verified,
}: {
  userId: string;
  verified: boolean;
}) {
  const router = useRouter();

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
      {verified ? "Unverify" : "Verify"}
    </Button>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, type ProductInput } from "@/lib/validations/product";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function NewProductPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<
    { id: string; name: string; slug: string }[]
  >([]);

  const {
    register,
    handleSubmit,
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

  async function onSubmit(data: ProductInput) {
    setError("");
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const body = await res.json();
      setError(body.error || "Failed to create product");
      return;
    }

    const product = await res.json();
    router.push(`/products/${product.id}`);
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
      <p className="mt-1 text-sm text-gray-500">
        Fill in the details for your product listing
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        {error && (
          <div className="rounded-md bg-danger-light p-3 text-sm text-danger">
            {error}
          </div>
        )}

        <Input
          id="name"
          label="Product Name"
          placeholder="Premium Cotton Fabric"
          error={errors.name?.message}
          {...register("name")}
        />

        <Textarea
          id="description"
          label="Description"
          placeholder="Describe your product, its features, and specifications..."
          rows={5}
          error={errors.description?.message}
          {...register("description")}
        />

        <div>
          <label
            htmlFor="categoryId"
            className="block text-sm font-medium text-gray-700"
          >
            Category
          </label>
          <select
            id="categoryId"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            {...register("categoryId")}
          >
            <option value="">Select category</option>
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
            label="Price (USD)"
            placeholder="0.00"
            error={errors.price?.message}
            {...register("price")}
          />
          <Input
            id="unit"
            label="Unit"
            placeholder="kg, m, piece..."
            error={errors.unit?.message}
            {...register("unit")}
          />
        </div>

        <Input
          id="minOrder"
          type="number"
          label="Minimum Order Quantity"
          placeholder="100"
          error={errors.minOrder?.message}
          {...register("minOrder")}
        />

        <Input
          id="hsCode"
          label="HS Code (optional)"
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
            This product is export ready
          </label>
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Product"}
        </Button>
      </form>
    </div>
  );
}

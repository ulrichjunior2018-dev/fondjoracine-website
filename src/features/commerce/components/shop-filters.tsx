"use client";

import type { Route } from "next";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Category, Collection } from "@/domain/commerce/types";

type ShopFiltersProps = {
  categories: Category[];
  collections: Collection[];
};

export function ShopFilters({ categories, collections }: ShopFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    params.delete("offset");
    startTransition(() => router.push(`/shop?${params.toString()}` as Route));
  }

  return (
    <form className="grid gap-3 rounded-lg border border-border bg-surface p-4 lg:grid-cols-[1fr_14rem_14rem_auto]">
      <label className="grid gap-1.5 text-sm font-medium">
        Search
        <Input
          defaultValue={searchParams.get("q") ?? ""}
          name="q"
          onChange={(event) => updateParam("q", event.target.value)}
          placeholder="Search rituals, oils, serums"
          type="search"
        />
      </label>
      <label className="grid gap-1.5 text-sm font-medium">
        Collection
        <select
          className="h-11 rounded-md border border-border bg-surface px-3 text-sm"
          defaultValue={searchParams.get("collection") ?? ""}
          onChange={(event) => updateParam("collection", event.target.value)}
        >
          <option value="">All collections</option>
          {collections.map((collection) => (
            <option key={collection.id} value={collection.slug}>
              {collection.name}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1.5 text-sm font-medium">
        Category
        <select
          className="h-11 rounded-md border border-border bg-surface px-3 text-sm"
          defaultValue={searchParams.get("category") ?? ""}
          onChange={(event) => updateParam("category", event.target.value)}
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
      </label>
      <Button
        disabled={isPending}
        onClick={() => router.push("/shop" as Route)}
        type="button"
        variant="secondary"
      >
        Reset
      </Button>
    </form>
  );
}

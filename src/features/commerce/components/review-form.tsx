"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";

type ReviewFormProps = {
  productId: string;
};

export function ReviewForm({ productId }: ReviewFormProps) {
  const [rating, setRating] = useState("5");
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const response = await fetch("/api/reviews", {
        body: JSON.stringify({
          body: String(formData.get("body") ?? ""),
          product_id: productId,
          rating: Number(rating),
          title: String(formData.get("title") ?? ""),
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });

      toast(
        response.ok
          ? {
              title: "Review submitted",
              description: "Thank you. Reviews publish after moderation.",
              tone: "success",
            }
          : {
              title: "Sign in required",
              description: "Please sign in to leave a verified FONDJO review.",
              tone: "warning",
            },
      );
    });
  }

  return (
    <form
      action={handleSubmit}
      className="grid gap-4 rounded-lg border border-border bg-surface p-5"
    >
      <Field label="Rating">
        <select
          className="h-11 rounded-md border border-border bg-surface px-3 text-sm"
          onChange={(event) => setRating(event.target.value)}
          value={rating}
        >
          <option value="5">5 stars</option>
          <option value="4">4 stars</option>
          <option value="3">3 stars</option>
          <option value="2">2 stars</option>
          <option value="1">1 star</option>
        </select>
      </Field>
      <Field label="Title">
        <Input name="title" placeholder="A few words about your ritual" />
      </Field>
      <Field label="Review" required>
        <Textarea name="body" placeholder="Share your experience" required />
      </Field>
      <Button isLoading={isPending} type="submit">
        Submit review
      </Button>
    </form>
  );
}

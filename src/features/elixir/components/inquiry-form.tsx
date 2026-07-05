"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { buildWaLink } from "@/lib/config";

const inquirySchema = z.object({
  city: z.string().min(2),
  name: z.string().min(2),
  phone: z.string().min(6),
});

type InquiryInput = z.infer<typeof inquirySchema>;

type InquiryFormProps = {
  locale: "en" | "fr";
  productName: string;
  whatsappPhone: string;
};

export function InquiryForm({ locale, productName, whatsappPhone }: InquiryFormProps) {
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<InquiryInput>({
    resolver: zodResolver(inquirySchema),
  });

  function submitInquiry(input: InquiryInput) {
    void input;
    void locale;
    void productName;
    void whatsappPhone;
    window.open(buildWaLink("order"), "_blank", "noopener,noreferrer");
  }

  return (
    <form className="grid gap-3" onSubmit={handleSubmit(submitInquiry)}>
      <label className="grid gap-1.5 text-sm font-medium">
        {locale === "fr" ? "Nom complet" : "Full name"}
        <Input autoComplete="name" {...register("name")} />
        {errors.name ? (
          <span className="text-xs text-destructive">{errors.name.message}</span>
        ) : null}
      </label>
      <label className="grid gap-1.5 text-sm font-medium">
        WhatsApp
        <Input autoComplete="tel" inputMode="tel" {...register("phone")} />
        {errors.phone ? (
          <span className="text-xs text-destructive">{errors.phone.message}</span>
        ) : null}
      </label>
      <label className="grid gap-1.5 text-sm font-medium">
        {locale === "fr" ? "Ville de livraison" : "Delivery city"}
        <Input autoComplete="address-level2" {...register("city")} />
        {errors.city ? (
          <span className="text-xs text-destructive">{errors.city.message}</span>
        ) : null}
      </label>
      <Button
        className="mt-2"
        disabled={isSubmitting}
        leadingIcon={<Send className="h-4 w-4" />}
        type="submit"
      >
        {locale === "fr" ? "Envoyer sur WhatsApp" : "Send on WhatsApp"}
      </Button>
    </form>
  );
}

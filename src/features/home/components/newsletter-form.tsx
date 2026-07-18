"use client";

import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type SubmissionState = "idle" | "submitting" | "success" | "error";

type NewsletterFormProps = {
  idleHint?: string;
  placeholder?: string;
  source?: string;
  submitLabel?: string;
};

export function NewsletterForm({
  idleHint = "Monthly rituals, ingredient notes, and private launch access.",
  placeholder = "Email address",
  source = "homepage",
  submitLabel = "Join",
}: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<SubmissionState>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");

    const response = await fetch("/api/newsletter", {
      body: JSON.stringify({ email, source }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });

    if (!response.ok) {
      setState("error");
      return;
    }

    setEmail("");
    setState("success");
  }

  return (
    <form className="grid gap-3 sm:grid-cols-[1fr_auto]" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor={`newsletter-email-${source}`}>
        {placeholder}
      </label>
      <Input
        autoComplete="email"
        className="border-[#B8935A]/20 bg-[#0B0B0B] text-[#F5EFE3] placeholder:text-[#F5EFE3]/40"
        id={`newsletter-email-${source}`}
        inputMode="email"
        onChange={(event) => setEmail(event.target.value)}
        placeholder={placeholder}
        required
        type="email"
        value={email}
      />
      <Button
        className="bg-[#B8935A] text-[#0B0B0B] hover:bg-[#B8935A]/90"
        isLoading={state === "submitting"}
        type="submit"
      >
        {submitLabel}
      </Button>
      {(idleHint || state !== "idle") && (
        <p className="text-xs leading-5 text-[#F5EFE3]/55 sm:col-span-2" role="status">
          {state === "success"
            ? "You are on the Maison Fondjo list."
            : state === "error"
              ? "We could not save that email. Please try again."
              : idleHint}
        </p>
      )}
    </form>
  );
}

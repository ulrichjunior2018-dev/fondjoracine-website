"use client";

import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type SubmissionState = "idle" | "submitting" | "success" | "error";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<SubmissionState>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");

    const response = await fetch("/api/newsletter", {
      body: JSON.stringify({ email, source: "homepage" }),
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
      <label className="sr-only" htmlFor="newsletter-email">
        Email address
      </label>
      <Input
        autoComplete="email"
        id="newsletter-email"
        inputMode="email"
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Email address"
        required
        type="email"
        value={email}
      />
      <Button isLoading={state === "submitting"} type="submit">
        Join
      </Button>
      <p className="text-xs leading-5 text-foreground/62 sm:col-span-2" role="status">
        {state === "success"
          ? "You are on the Maison Fondjo list."
          : state === "error"
            ? "We could not save that email. Please try again."
            : "Monthly rituals, ingredient notes, and private launch access."}
      </p>
    </form>
  );
}

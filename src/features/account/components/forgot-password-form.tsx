"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import {
  requestPasswordResetSchema,
  type RequestPasswordResetInput,
} from "@/domain/customer/schemas";
import { requestPasswordReset } from "@/features/account/lib/auth-client";

export function ForgotPasswordForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RequestPasswordResetInput>({ resolver: zodResolver(requestPasswordResetSchema) });

  async function onSubmit(values: RequestPasswordResetInput) {
    setIsSubmitting(true);

    try {
      const redirectTo = `${window.location.origin}/auth/callback?next=/reset-password`;
      await requestPasswordReset(values.email, redirectTo);
      setIsSent(true);
    } catch (error) {
      toast({
        title: "Couldn't send the reset link",
        description: error instanceof Error ? error.message : "Please try again.",
        tone: "danger",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSent) {
    return (
      <p className="text-sm leading-6 text-foreground/78">
        If an account exists for that email, a reset link is on its way.
      </p>
    );
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
      <Field error={errors.email?.message} label="Email" required>
        <Input autoComplete="email" type="email" {...register("email")} />
      </Field>
      <Button className="mt-2 w-full" isLoading={isSubmitting} type="submit">
        Send reset link
      </Button>
    </form>
  );
}

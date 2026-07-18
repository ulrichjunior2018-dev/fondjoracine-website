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
import { getDictionary } from "@/i18n/dictionaries";
import { useI18n } from "@/lib/i18n-context";

export function ForgotPasswordForm() {
  const { toast } = useToast();
  const { locale } = useI18n();
  const auth = getDictionary(locale).auth;
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
        title: auth.forgotErrorTitle,
        description: error instanceof Error ? error.message : auth.tryAgain,
        tone: "danger",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSent) {
    return <p className="text-sm leading-6 text-foreground/78">{auth.forgotSuccess}</p>;
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
      <Field error={errors.email?.message} label={auth.email} required>
        <Input autoComplete="email" type="email" {...register("email")} />
      </Field>
      <Button className="mt-2 w-full" isLoading={isSubmitting} type="submit">
        {auth.forgotSubmit}
      </Button>
    </form>
  );
}

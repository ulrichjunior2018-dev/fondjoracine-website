"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { useToast } from "@/components/ui/toast";
import { signUpSchema, type SignUpInput } from "@/domain/customer/schemas";
import { signUpWithPassword } from "@/features/account/lib/auth-client";
import { formatAuthErrorMessage } from "@/features/account/lib/auth-urls";
import { getDictionary } from "@/i18n/dictionaries";
import { useI18n } from "@/lib/i18n-context";

export function SignupForm() {
  const { toast } = useToast();
  const { locale } = useI18n();
  const auth = getDictionary(locale).auth;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpInput>({ resolver: zodResolver(signUpSchema) });

  async function onSubmit(values: SignUpInput) {
    setIsSubmitting(true);

    try {
      await signUpWithPassword(values);
      setIsDone(true);
    } catch (error) {
      toast({
        title: auth.signupErrorTitle,
        description:
          error instanceof Error
            ? formatAuthErrorMessage(error.message, auth.emailRateLimit)
            : auth.tryAgain,
        tone: "danger",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isDone) {
    return <p className="text-sm leading-6 text-foreground/78">{auth.signupConfirm}</p>;
  }

  return (
    <form className="grid min-w-0 gap-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid min-w-0 gap-4 sm:grid-cols-2">
        <Field error={errors.firstName?.message} label={auth.firstName} required>
          <Input autoComplete="given-name" {...register("firstName")} />
        </Field>
        <Field error={errors.lastName?.message} label={auth.lastName} required>
          <Input autoComplete="family-name" {...register("lastName")} />
        </Field>
      </div>
      <Field error={errors.email?.message} label={auth.email} required>
        <Input autoComplete="email" type="email" {...register("email")} />
      </Field>
      <Field
        description={auth.passwordHint}
        error={errors.password?.message}
        label={auth.password}
        required
      >
        <PasswordInput autoComplete="new-password" {...register("password")} />
      </Field>
      <Button className="mt-2 w-full" isLoading={isSubmitting} type="submit">
        {auth.signupSubmit}
      </Button>
    </form>
  );
}

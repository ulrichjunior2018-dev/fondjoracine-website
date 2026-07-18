"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { useToast } from "@/components/ui/toast";
import { loginSchema, type LoginInput } from "@/domain/customer/schemas";
import { signInWithPassword } from "@/features/account/lib/auth-client";
import { getDictionary } from "@/i18n/dictionaries";
import { useI18n } from "@/lib/i18n-context";

type LoginFormProps = {
  redirectTo: string;
};

export function LoginForm({ redirectTo }: LoginFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { locale } = useI18n();
  const auth = getDictionary(locale).auth;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginInput) {
    setIsSubmitting(true);

    try {
      await signInWithPassword(values);
      router.push(redirectTo as never);
      router.refresh();
    } catch (error) {
      setIsSubmitting(false);
      toast({
        title: auth.loginErrorTitle,
        description: error instanceof Error ? error.message : auth.tryAgain,
        tone: "danger",
      });
    }
  }

  return (
    <form className="grid min-w-0 gap-4" onSubmit={handleSubmit(onSubmit)}>
      <Field error={errors.email?.message} label={auth.email} required>
        <Input autoComplete="email" type="email" {...register("email")} />
      </Field>
      <Field error={errors.password?.message} label={auth.password} required>
        <PasswordInput autoComplete="current-password" {...register("password")} />
      </Field>
      <Button className="mt-2 w-full" isLoading={isSubmitting} type="submit">
        {auth.loginSubmit}
      </Button>
    </form>
  );
}

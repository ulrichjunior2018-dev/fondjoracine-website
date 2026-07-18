"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { useToast } from "@/components/ui/toast";
import { updatePasswordSchema, type UpdatePasswordInput } from "@/domain/customer/schemas";
import { updatePassword } from "@/features/account/lib/auth-client";
import { getDictionary } from "@/i18n/dictionaries";
import { useI18n } from "@/lib/i18n-context";

export function ChangePasswordForm() {
  const { toast } = useToast();
  const { locale } = useI18n();
  const auth = getDictionary(locale).auth;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdatePasswordInput>({ resolver: zodResolver(updatePasswordSchema) });

  async function onSubmit(values: UpdatePasswordInput) {
    setIsSubmitting(true);

    try {
      await updatePassword(values.password);
      toast({ title: auth.changePasswordSuccess, tone: "success" });
      reset();
    } catch (error) {
      toast({
        title: auth.changePasswordError,
        description: error instanceof Error ? error.message : auth.tryAgain,
        tone: "danger",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
      <Field
        description={auth.passwordHint}
        error={errors.password?.message}
        label={auth.newPassword}
        required
      >
        <PasswordInput autoComplete="new-password" {...register("password")} />
      </Field>
      <Button className="w-fit" isLoading={isSubmitting} type="submit">
        {auth.changePasswordSubmit}
      </Button>
    </form>
  );
}

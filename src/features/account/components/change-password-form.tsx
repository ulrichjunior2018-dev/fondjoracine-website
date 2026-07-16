"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { updatePasswordSchema, type UpdatePasswordInput } from "@/domain/customer/schemas";
import { updatePassword } from "@/features/account/lib/auth-client";

export function ChangePasswordForm() {
  const { toast } = useToast();
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
      toast({ title: "Password updated", tone: "success" });
      reset();
    } catch (error) {
      toast({
        title: "Couldn't update your password",
        description: error instanceof Error ? error.message : "Please try again.",
        tone: "danger",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
      <Field
        description="At least 8 characters."
        error={errors.password?.message}
        label="New password"
        required
      >
        <Input autoComplete="new-password" type="password" {...register("password")} />
      </Field>
      <Button className="w-fit" isLoading={isSubmitting} type="submit">
        Update password
      </Button>
    </form>
  );
}

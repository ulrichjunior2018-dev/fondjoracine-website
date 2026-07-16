"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { loginSchema, type LoginInput } from "@/domain/customer/schemas";
import { signInWithPassword } from "@/features/account/lib/auth-client";

type LoginFormProps = {
  redirectTo: string;
};

export function LoginForm({ redirectTo }: LoginFormProps) {
  const router = useRouter();
  const { toast } = useToast();
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
        title: "Couldn't sign in",
        description: error instanceof Error ? error.message : "Please try again.",
        tone: "danger",
      });
    }
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
      <Field error={errors.email?.message} label="Email" required>
        <Input autoComplete="email" type="email" {...register("email")} />
      </Field>
      <Field error={errors.password?.message} label="Password" required>
        <Input autoComplete="current-password" type="password" {...register("password")} />
      </Field>
      <Button className="mt-2 w-full" isLoading={isSubmitting} type="submit">
        Sign in
      </Button>
    </form>
  );
}

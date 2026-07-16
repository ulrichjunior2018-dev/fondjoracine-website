"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { signUpSchema, type SignUpInput } from "@/domain/customer/schemas";
import { signUpWithPassword } from "@/features/account/lib/auth-client";

export function SignupForm() {
  const { toast } = useToast();
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
        title: "Couldn't create your account",
        description: error instanceof Error ? error.message : "Please try again.",
        tone: "danger",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isDone) {
    return (
      <p className="text-sm leading-6 text-foreground/78">
        Check your inbox to confirm your email, then sign in to set up your account.
      </p>
    );
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field error={errors.firstName?.message} label="First name" required>
          <Input autoComplete="given-name" {...register("firstName")} />
        </Field>
        <Field error={errors.lastName?.message} label="Last name" required>
          <Input autoComplete="family-name" {...register("lastName")} />
        </Field>
      </div>
      <Field error={errors.email?.message} label="Email" required>
        <Input autoComplete="email" type="email" {...register("email")} />
      </Field>
      <Field
        description="At least 8 characters."
        error={errors.password?.message}
        label="Password"
        required
      >
        <Input autoComplete="new-password" type="password" {...register("password")} />
      </Field>
      <Button className="mt-2 w-full" isLoading={isSubmitting} type="submit">
        Create account
      </Button>
    </form>
  );
}

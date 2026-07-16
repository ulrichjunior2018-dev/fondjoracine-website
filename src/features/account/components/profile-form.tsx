"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { updateProfileSchema, type UpdateProfileInput } from "@/domain/customer/schemas";
import { updateAccountProfile } from "@/lib/api-client/resources/account";
import { getApiClient } from "@/lib/api-client/instance";

type ProfileFormProps = {
  email: string;
  defaultValues: UpdateProfileInput;
};

export function ProfileForm({ defaultValues, email }: ProfileFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateProfileInput>({ defaultValues, resolver: zodResolver(updateProfileSchema) });

  async function onSubmit(values: UpdateProfileInput) {
    setIsSubmitting(true);

    try {
      await updateAccountProfile(getApiClient(), values);
      toast({ title: "Profile updated", tone: "success" });
      router.refresh();
    } catch (error) {
      toast({
        title: "Couldn't update your profile",
        description: error instanceof Error ? error.message : "Please try again.",
        tone: "danger",
      });
    } finally {
      setIsSubmitting(false);
    }
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
      <Field description="Contact support to change your email." label="Email">
        <Input disabled value={email} />
      </Field>
      <Field error={errors.phone?.message} label="Phone number">
        <Input autoComplete="tel" placeholder="+237 6XX XXX XXX" {...register("phone")} />
      </Field>
      <Button className="mt-2 w-fit" isLoading={isSubmitting} type="submit">
        Save changes
      </Button>
    </form>
  );
}

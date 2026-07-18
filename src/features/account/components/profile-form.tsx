"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { updateProfileSchema, type UpdateProfileInput } from "@/domain/customer/schemas";
import { getDictionary } from "@/i18n/dictionaries";
import { updateAccountProfile } from "@/lib/api-client/resources/account";
import { getApiClient } from "@/lib/api-client/instance";
import { useI18n } from "@/lib/i18n-context";

type ProfileFormProps = {
  email: string;
  defaultValues: UpdateProfileInput;
};

export function ProfileForm({ defaultValues, email }: ProfileFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { locale } = useI18n();
  const auth = getDictionary(locale).auth;
  const profile = getDictionary(locale).account.profile;
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
      toast({ title: profile.saved, tone: "success" });
      router.refresh();
    } catch (error) {
      toast({
        title: profile.error,
        description: error instanceof Error ? error.message : auth.tryAgain,
        tone: "danger",
      });
    } finally {
      setIsSubmitting(false);
    }
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
      <Field description={profile.emailChangeHint} label={auth.email}>
        <Input disabled value={email} />
      </Field>
      <Field error={errors.phone?.message} label={profile.phone}>
        <Input autoComplete="tel" placeholder="+237 6XX XXX XXX" {...register("phone")} />
      </Field>
      <Button className="mt-2 w-fit" isLoading={isSubmitting} type="submit">
        {profile.save}
      </Button>
    </form>
  );
}

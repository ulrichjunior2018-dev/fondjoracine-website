"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, Input } from "@/components/ui/input";
import { ModalFooter } from "@/components/ui/modal";
import { addressSchema, type AddressInput } from "@/domain/customer/schemas";
import type { Address } from "@/domain/customer/types";
import { getDictionary } from "@/i18n/dictionaries";
import { useI18n } from "@/lib/i18n-context";

type AddressFormValues = z.input<typeof addressSchema>;

type AddressFormProps = {
  address?: Address | undefined;
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: (values: AddressInput) => void;
};

export function AddressForm({ address, isSubmitting, onCancel, onSubmit }: AddressFormProps) {
  const { locale } = useI18n();
  const a = getDictionary(locale).account.addresses;
  const auth = getDictionary(locale).auth;
  const profile = getDictionary(locale).account.profile;
  const orderFlow = getDictionary(locale).orderFlow;

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormValues>({
    defaultValues: {
      label: address?.label ?? "",
      firstName: address?.firstName ?? "",
      lastName: address?.lastName ?? "",
      company: address?.company ?? "",
      line1: address?.line1 ?? "",
      line2: address?.line2 ?? "",
      city: address?.city ?? "",
      region: address?.region ?? "",
      postalCode: address?.postalCode ?? "",
      countryCode: address?.countryCode ?? "CM",
      phone: address?.phone ?? "",
      isDefaultShipping: address?.isDefaultShipping ?? false,
      isDefaultBilling: address?.isDefaultBilling ?? false,
    },
    resolver: zodResolver(addressSchema),
  });

  function handleValidSubmit(values: AddressFormValues) {
    onSubmit(addressSchema.parse(values));
  }

  return (
    <form className="grid min-w-0 gap-4" onSubmit={handleSubmit(handleValidSubmit)}>
      <Field description={a.labelHint} label={a.label}>
        <Input {...register("label")} />
      </Field>
      <div className="grid min-w-0 gap-4 sm:grid-cols-2">
        <Field error={errors.firstName?.message} label={auth.firstName} required>
          <Input {...register("firstName")} />
        </Field>
        <Field error={errors.lastName?.message} label={auth.lastName} required>
          <Input {...register("lastName")} />
        </Field>
      </div>
      <Field error={errors.line1?.message} label={a.line1} required>
        <Input {...register("line1")} />
      </Field>
      <Field error={errors.line2?.message} label={a.line2Hint}>
        <Input {...register("line2")} />
      </Field>
      <div className="grid min-w-0 gap-4 sm:grid-cols-3">
        <Field error={errors.city?.message} label={orderFlow.city} required>
          <Input {...register("city")} />
        </Field>
        <Field error={errors.region?.message} label={a.region} required>
          <Input {...register("region")} />
        </Field>
        <Field error={errors.postalCode?.message} label={a.postalCode} required>
          <Input {...register("postalCode")} />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field error={errors.countryCode?.message} label={a.countryCode} required>
          <Input maxLength={2} {...register("countryCode")} />
        </Field>
        <Field error={errors.phone?.message} label={profile.phone}>
          <Input {...register("phone")} />
        </Field>
      </div>
      <div className="grid gap-2">
        <Controller
          control={control}
          name="isDefaultShipping"
          render={({ field }) => (
            <Checkbox
              checked={field.value ?? false}
              label={a.defaultShippingAddress}
              onCheckedChange={(checked) => field.onChange(checked === true)}
            />
          )}
        />
        <Controller
          control={control}
          name="isDefaultBilling"
          render={({ field }) => (
            <Checkbox
              checked={field.value ?? false}
              label={a.defaultBillingAddress}
              onCheckedChange={(checked) => field.onChange(checked === true)}
            />
          )}
        />
      </div>
      <ModalFooter>
        <Button onClick={onCancel} type="button" variant="secondary">
          {a.cancel}
        </Button>
        <Button isLoading={isSubmitting} type="submit">
          {a.save}
        </Button>
      </ModalFooter>
    </form>
  );
}

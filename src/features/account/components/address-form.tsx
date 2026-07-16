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

// `z.input<>` (not `z.infer`/`z.output<>`) so the defaulted boolean fields stay
// optional at the form-values level, matching zodResolver's expectations under
// `exactOptionalPropertyTypes` (see src/features/elixir/components/order-flow.tsx
// for the same pattern).
type AddressFormValues = z.input<typeof addressSchema>;

type AddressFormProps = {
  address?: Address | undefined;
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: (values: AddressInput) => void;
};

export function AddressForm({ address, isSubmitting, onCancel, onSubmit }: AddressFormProps) {
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
    <form className="grid gap-4" onSubmit={handleSubmit(handleValidSubmit)}>
      <Field description='e.g. "Home", "Office"' label="Label">
        <Input {...register("label")} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field error={errors.firstName?.message} label="First name" required>
          <Input {...register("firstName")} />
        </Field>
        <Field error={errors.lastName?.message} label="Last name" required>
          <Input {...register("lastName")} />
        </Field>
      </div>
      <Field error={errors.line1?.message} label="Address" required>
        <Input {...register("line1")} />
      </Field>
      <Field error={errors.line2?.message} label="Apartment, suite, etc.">
        <Input {...register("line2")} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field error={errors.city?.message} label="City" required>
          <Input {...register("city")} />
        </Field>
        <Field error={errors.region?.message} label="Region" required>
          <Input {...register("region")} />
        </Field>
        <Field error={errors.postalCode?.message} label="Postal code" required>
          <Input {...register("postalCode")} />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field error={errors.countryCode?.message} label="Country code" required>
          <Input maxLength={2} {...register("countryCode")} />
        </Field>
        <Field error={errors.phone?.message} label="Phone">
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
              label="Default shipping address"
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
              label="Default billing address"
              onCheckedChange={(checked) => field.onChange(checked === true)}
            />
          )}
        />
      </div>
      <ModalFooter>
        <Button onClick={onCancel} type="button" variant="secondary">
          Cancel
        </Button>
        <Button isLoading={isSubmitting} type="submit">
          Save address
        </Button>
      </ModalFooter>
    </form>
  );
}

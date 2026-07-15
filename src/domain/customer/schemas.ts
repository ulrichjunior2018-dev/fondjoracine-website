import { z } from "zod";

/**
 * Validation for the customer account surface (auth + account/* pages & API).
 * Keep field names camelCase here; services translate to/from DB snake_case.
 */

export const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(72),
  firstName: z.string().min(1).max(80),
  lastName: z.string().min(1).max(80),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1).max(72),
});

export const requestPasswordResetSchema = z.object({
  email: z.string().email(),
});

export const updatePasswordSchema = z.object({
  password: z.string().min(8).max(72),
});

export const updateProfileSchema = z.object({
  firstName: z.string().min(1).max(80),
  lastName: z.string().min(1).max(80),
  phone: z.string().min(8).max(24).optional().or(z.literal("")),
});

export const addressSchema = z.object({
  label: z.string().min(1).max(60).optional().or(z.literal("")),
  firstName: z.string().min(1).max(80),
  lastName: z.string().min(1).max(80),
  company: z.string().max(120).optional().or(z.literal("")),
  line1: z.string().min(2).max(200),
  line2: z.string().max(200).optional().or(z.literal("")),
  city: z.string().min(1).max(120),
  region: z.string().min(1).max(120),
  postalCode: z.string().min(1).max(20),
  countryCode: z.string().length(2),
  phone: z.string().min(8).max(24).optional().or(z.literal("")),
  isDefaultShipping: z.boolean().default(false),
  isDefaultBilling: z.boolean().default(false),
});

export const updateAddressSchema = addressSchema.partial();

export const notificationPreferencesSchema = z.object({
  orderUpdates: z.boolean(),
  promotions: z.boolean(),
  productLaunches: z.boolean(),
  hairCareTips: z.boolean(),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RequestPasswordResetInput = z.infer<typeof requestPasswordResetSchema>;
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
export type UpdateAddressInput = z.infer<typeof updateAddressSchema>;
export type NotificationPreferencesInput = z.infer<typeof notificationPreferencesSchema>;

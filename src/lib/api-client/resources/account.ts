import type {
  AddressInput,
  NotificationPreferencesInput,
  UpdateAddressInput,
  UpdateProfileInput,
} from "@/domain/customer/schemas";
import type {
  AccountOrderDetail,
  AccountOrderSummary,
  AccountOverview,
  Address,
  CustomerAccount,
  NotificationPreferences,
  SubscriptionSummary,
} from "@/domain/customer/types";

import type { ApiClient } from "../client";

export type {
  AccountOrderDetail,
  AccountOrderSummary,
  AccountOverview,
  Address,
  CustomerAccount,
  NotificationPreferences,
  SubscriptionSummary,
} from "@/domain/customer/types";

/** Dashboard "Home" summary for the signed-in customer. */
export function getAccountOverview(client: ApiClient): Promise<AccountOverview> {
  return client.get<AccountOverview>("/account/overview");
}

export function getAccountProfile(client: ApiClient): Promise<CustomerAccount> {
  return client.get<CustomerAccount>("/account/profile");
}

export function updateAccountProfile(
  client: ApiClient,
  input: UpdateProfileInput,
): Promise<CustomerAccount> {
  return client.patch<CustomerAccount>("/account/profile", input);
}

export function listAccountAddresses(client: ApiClient): Promise<Address[]> {
  return client.get<Address[]>("/account/addresses");
}

export function createAccountAddress(client: ApiClient, input: AddressInput): Promise<Address> {
  return client.post<Address>("/account/addresses", input);
}

export function updateAccountAddress(
  client: ApiClient,
  addressId: string,
  input: UpdateAddressInput,
): Promise<Address> {
  return client.patch<Address>(`/account/addresses/${encodeURIComponent(addressId)}`, input);
}

export function deleteAccountAddress(
  client: ApiClient,
  addressId: string,
): Promise<{ deleted: boolean }> {
  return client.delete<{ deleted: boolean }>(`/account/addresses/${encodeURIComponent(addressId)}`);
}

export function listAccountOrders(client: ApiClient): Promise<AccountOrderSummary[]> {
  return client.get<AccountOrderSummary[]>("/account/orders");
}

export function getAccountOrder(client: ApiClient, orderId: string): Promise<AccountOrderDetail> {
  return client.get<AccountOrderDetail>(`/account/orders/${encodeURIComponent(orderId)}`);
}

export function getAccountNotificationPreferences(
  client: ApiClient,
): Promise<NotificationPreferences> {
  return client
    .get<{ preferences: NotificationPreferences } | NotificationPreferences>(
      "/account/notifications",
    )
    .then((payload) =>
      payload && typeof payload === "object" && "preferences" in payload
        ? payload.preferences
        : (payload as NotificationPreferences),
    );
}

export function updateAccountNotificationPreferences(
  client: ApiClient,
  input: NotificationPreferencesInput,
): Promise<NotificationPreferences> {
  return client.patch<NotificationPreferences>("/account/notifications", input);
}

/** The signed-in customer's current subscription, or `null` if they've never subscribed. */
export function getAccountSubscription(client: ApiClient): Promise<SubscriptionSummary | null> {
  return client
    .get<{ subscription: SubscriptionSummary | null }>("/account/subscription")
    .then((payload) => payload.subscription);
}

export function cancelAccountSubscription(
  client: ApiClient,
  subscriptionId: string,
): Promise<SubscriptionSummary> {
  return client
    .delete<{ subscription: SubscriptionSummary }>(
      `/account/subscription/${encodeURIComponent(subscriptionId)}`,
    )
    .then((payload) => payload.subscription);
}

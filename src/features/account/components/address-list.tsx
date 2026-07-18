"use client";

import { useState } from "react";

import { Icons } from "@/components/icons/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Modal, ModalContent } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import type { AddressInput } from "@/domain/customer/schemas";
import type { Address } from "@/domain/customer/types";
import { AddressForm } from "@/features/account/components/address-form";
import { getDictionary } from "@/i18n/dictionaries";
import { getApiClient } from "@/lib/api-client/instance";
import {
  createAccountAddress,
  deleteAccountAddress,
  updateAccountAddress,
} from "@/lib/api-client/resources/account";
import { useI18n } from "@/lib/i18n-context";

type AddressListProps = {
  initialAddresses: Address[];
};

export function AddressList({ initialAddresses }: AddressListProps) {
  const { toast } = useToast();
  const { locale } = useI18n();
  const a = getDictionary(locale).account.addresses;
  const auth = getDictionary(locale).auth;
  const [addresses, setAddresses] = useState(initialAddresses);
  const [editing, setEditing] = useState<Address | "new" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleSubmit(values: AddressInput) {
    setIsSubmitting(true);
    const client = getApiClient();

    try {
      if (editing && editing !== "new") {
        const updated = await updateAccountAddress(client, editing.id, values);
        setAddresses((current) => current.map((row) => (row.id === updated.id ? updated : row)));
      } else {
        const created = await createAccountAddress(client, values);
        setAddresses((current) => [created, ...current]);
      }

      toast({ title: a.saved, tone: "success" });
      setEditing(null);
    } catch (error) {
      toast({
        title: a.error,
        description: error instanceof Error ? error.message : auth.tryAgain,
        tone: "danger",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(address: Address) {
    setDeletingId(address.id);

    try {
      await deleteAccountAddress(getApiClient(), address.id);
      setAddresses((current) => current.filter((row) => row.id !== address.id));
      toast({ title: a.removed, tone: "success" });
    } catch (error) {
      toast({
        title: a.error,
        description: error instanceof Error ? error.message : auth.tryAgain,
        tone: "danger",
      });
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="grid gap-4">
      <div className="flex justify-end">
        <Button
          leadingIcon={<Icons.plus aria-hidden="true" className="h-4 w-4" />}
          onClick={() => setEditing("new")}
        >
          {a.add}
        </Button>
      </div>

      {addresses.length === 0 ? (
        <Card>
          <p className="text-sm text-foreground/68">{a.empty}</p>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {addresses.map((address) => (
            <Card key={address.id}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{address.label || a.addressFallback}</p>
                    {address.isDefaultShipping ? (
                      <Badge tone="accent">{a.defaultShipping}</Badge>
                    ) : null}
                    {address.isDefaultBilling ? (
                      <Badge tone="accent">{a.defaultBilling}</Badge>
                    ) : null}
                  </div>
                  <p className="mt-2 text-sm text-foreground/78">
                    {address.firstName} {address.lastName}
                  </p>
                  <p className="text-sm text-foreground/68">
                    {address.line1}
                    {address.line2 ? `, ${address.line2}` : ""}
                  </p>
                  <p className="text-sm text-foreground/68">
                    {address.city}, {address.region} {address.postalCode}
                  </p>
                  <p className="text-sm text-foreground/68">{address.countryCode}</p>
                  {address.phone ? (
                    <p className="mt-1 text-sm text-foreground/58">{address.phone}</p>
                  ) : null}
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button
                    aria-label={a.edit}
                    onClick={() => setEditing(address)}
                    size="icon"
                    variant="ghost"
                  >
                    <Icons.edit aria-hidden="true" className="h-4 w-4" />
                  </Button>
                  <Button
                    aria-label={a.remove}
                    isLoading={deletingId === address.id}
                    onClick={() => handleDelete(address)}
                    size="icon"
                    variant="ghost"
                  >
                    <Icons.trash aria-hidden="true" className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal onOpenChange={(open) => !open && setEditing(null)} open={editing !== null}>
        <ModalContent title={editing === "new" ? a.add : a.edit}>
          <AddressForm
            address={editing !== "new" ? (editing ?? undefined) : undefined}
            isSubmitting={isSubmitting}
            onCancel={() => setEditing(null)}
            onSubmit={handleSubmit}
          />
        </ModalContent>
      </Modal>
    </div>
  );
}

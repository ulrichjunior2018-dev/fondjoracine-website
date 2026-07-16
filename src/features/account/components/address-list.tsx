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
import { getApiClient } from "@/lib/api-client/instance";
import {
  createAccountAddress,
  deleteAccountAddress,
  updateAccountAddress,
} from "@/lib/api-client/resources/account";

type AddressListProps = {
  initialAddresses: Address[];
};

export function AddressList({ initialAddresses }: AddressListProps) {
  const { toast } = useToast();
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
        setAddresses((current) => current.map((a) => (a.id === updated.id ? updated : a)));
      } else {
        const created = await createAccountAddress(client, values);
        setAddresses((current) => [created, ...current]);
      }

      toast({ title: "Address saved", tone: "success" });
      setEditing(null);
    } catch (error) {
      toast({
        title: "Couldn't save address",
        description: error instanceof Error ? error.message : "Please try again.",
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
      setAddresses((current) => current.filter((a) => a.id !== address.id));
      toast({ title: "Address removed", tone: "success" });
    } catch (error) {
      toast({
        title: "Couldn't remove address",
        description: error instanceof Error ? error.message : "Please try again.",
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
          Add address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <Card>
          <p className="text-sm text-foreground/68">No saved addresses yet.</p>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {addresses.map((address) => (
            <Card key={address.id}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{address.label || "Address"}</p>
                    {address.isDefaultShipping ? (
                      <Badge tone="accent">Default shipping</Badge>
                    ) : null}
                    {address.isDefaultBilling ? <Badge tone="accent">Default billing</Badge> : null}
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
                    aria-label="Edit address"
                    onClick={() => setEditing(address)}
                    size="icon"
                    variant="ghost"
                  >
                    <Icons.edit aria-hidden="true" className="h-4 w-4" />
                  </Button>
                  <Button
                    aria-label="Delete address"
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
        <ModalContent title={editing === "new" ? "Add address" : "Edit address"}>
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

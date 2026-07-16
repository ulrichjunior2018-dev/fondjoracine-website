"use client";

import { useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/toast";
import type { NotificationPreferences } from "@/domain/customer/types";
import { getApiClient } from "@/lib/api-client/instance";
import { updateAccountNotificationPreferences } from "@/lib/api-client/resources/account";

type NotificationPreferencesFormProps = {
  initialPreferences: NotificationPreferences;
};

type PreferenceKey = keyof NotificationPreferences;

const rows: Array<{ description: string; key: PreferenceKey; label: string }> = [
  {
    key: "orderUpdates",
    label: "Order updates",
    description: "Confirmations, shipping, and delivery status.",
  },
  {
    key: "promotions",
    label: "Promotions",
    description: "Discounts and limited-time offers.",
  },
  {
    key: "productLaunches",
    label: "Product launches",
    description: "New products from Maison Fondjo.",
  },
  {
    key: "hairCareTips",
    label: "Hair care tips",
    description: "Guidance on getting the most from Sève Racine.",
  },
];

export function NotificationPreferencesForm({
  initialPreferences,
}: NotificationPreferencesFormProps) {
  const { toast } = useToast();
  const [preferences, setPreferences] = useState(initialPreferences);
  const [savingKey, setSavingKey] = useState<PreferenceKey | null>(null);

  async function handleToggle(key: PreferenceKey, checked: boolean) {
    const next = { ...preferences, [key]: checked };
    setPreferences(next);
    setSavingKey(key);

    try {
      await updateAccountNotificationPreferences(getApiClient(), next);
    } catch (error) {
      setPreferences(preferences);
      toast({
        title: "Couldn't update preference",
        description: error instanceof Error ? error.message : "Please try again.",
        tone: "danger",
      });
    } finally {
      setSavingKey(null);
    }
  }

  return (
    <div className="grid gap-4">
      {rows.map((row) => (
        <div
          className="flex items-start justify-between gap-4 rounded-md border border-border p-4"
          key={row.key}
        >
          <div>
            <p className="text-sm font-medium">{row.label}</p>
            <p className="mt-1 text-xs text-foreground/58">{row.description}</p>
          </div>
          <Checkbox
            aria-label={row.label}
            checked={preferences[row.key]}
            disabled={savingKey === row.key}
            onCheckedChange={(checked) => handleToggle(row.key, checked === true)}
          />
        </div>
      ))}
      <p className="text-xs text-foreground/50">
        Delivered by email today. SMS and push notifications are planned for the mobile app.
      </p>
    </div>
  );
}

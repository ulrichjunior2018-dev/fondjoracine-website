"use client";

import { useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/toast";
import type { NotificationPreferences } from "@/domain/customer/types";
import { getDictionary } from "@/i18n/dictionaries";
import { getApiClient } from "@/lib/api-client/instance";
import { updateAccountNotificationPreferences } from "@/lib/api-client/resources/account";
import { useI18n } from "@/lib/i18n-context";

type NotificationPreferencesFormProps = {
  initialPreferences: NotificationPreferences;
};

type PreferenceKey = keyof NotificationPreferences;

export function NotificationPreferencesForm({
  initialPreferences,
}: NotificationPreferencesFormProps) {
  const { toast } = useToast();
  const { locale } = useI18n();
  const n = getDictionary(locale).account.notifications;
  const auth = getDictionary(locale).auth;
  const [preferences, setPreferences] = useState(initialPreferences);
  const [savingKey, setSavingKey] = useState<PreferenceKey | null>(null);

  const rows: Array<{ description: string; key: PreferenceKey; label: string }> = [
    { key: "orderUpdates", label: n.orderUpdates, description: n.orderUpdatesDesc },
    { key: "promotions", label: n.promotions, description: n.promotionsDesc },
    { key: "productLaunches", label: n.productLaunches, description: n.productLaunchesDesc },
    { key: "hairCareTips", label: n.hairCareTips, description: n.hairCareTipsDesc },
  ];

  async function handleToggle(key: PreferenceKey, checked: boolean) {
    const next = { ...preferences, [key]: checked };
    setPreferences(next);
    setSavingKey(key);

    try {
      await updateAccountNotificationPreferences(getApiClient(), next);
    } catch (error) {
      setPreferences(preferences);
      toast({
        title: n.error,
        description: error instanceof Error ? error.message : auth.tryAgain,
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
      <p className="text-xs text-foreground/50">{n.channelNote}</p>
    </div>
  );
}

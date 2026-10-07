"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heading, Text } from "@/components/ui/typography";
import { useToast } from "@/components/ui/toast";
import type { SubscriptionSummary } from "@/domain/customer/types";
import { getDictionary } from "@/i18n/dictionaries";
import { getApiClient } from "@/lib/api-client/instance";
import { cancelAccountSubscription } from "@/lib/api-client/resources/account";
import { useI18n } from "@/lib/i18n-context";
import { formatMoney } from "@/lib/utils/currency";

type SubscriptionCardProps = {
  initialSubscription: SubscriptionSummary | null;
};

function formatDate(value: string | null, locale: string) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function SubscriptionCard({ initialSubscription }: SubscriptionCardProps) {
  const { toast } = useToast();
  const { locale } = useI18n();
  const b = getDictionary(locale).account.billing;
  const auth = getDictionary(locale).auth;
  const [subscription, setSubscription] = useState(initialSubscription);
  const [isCancelling, setIsCancelling] = useState(false);

  if (!subscription) {
    return null;
  }

  const toneByStatus = {
    active: "sage",
    past_due: "warning",
    paused: "neutral",
    cancelled: "neutral",
  } as const;

  const labelByStatus: Record<SubscriptionSummary["status"], string> = {
    active: b.subscriptionStatusActive,
    past_due: b.subscriptionStatusPastDue,
    paused: b.subscriptionStatusPaused,
    cancelled: b.subscriptionStatusCancelled,
  };

  const methodLabel =
    subscription.paymentMethod === "card"
      ? b.subscriptionMethodCard
      : subscription.paymentMethod === "orange_money"
        ? b.subscriptionMethodOrange
        : b.subscriptionMethodMtn;

  const nextDate =
    subscription.billingProvider === "stripe"
      ? subscription.currentPeriodEnd
      : subscription.nextBillingAt;

  async function handleCancel() {
    if (!subscription) return;
    const confirmed = window.confirm(b.subscriptionCancelConfirm);
    if (!confirmed) return;

    setIsCancelling(true);
    try {
      const updated = await cancelAccountSubscription(getApiClient(), subscription.id);
      setSubscription(updated);
      toast({ title: b.subscriptionCancelled, tone: "default" });
    } catch (error) {
      toast({
        title: b.subscriptionCancelError,
        description: error instanceof Error ? error.message : auth.tryAgain,
        tone: "danger",
      });
    } finally {
      setIsCancelling(false);
    }
  }

  return (
    <Card>
      <CardContent className="grid gap-4 pt-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Heading as="h2" level="h3">
            {b.subscriptionTitle}
          </Heading>
          <Badge tone={toneByStatus[subscription.status]}>
            {labelByStatus[subscription.status]}
          </Badge>
        </div>

        <div className="grid gap-1 text-sm text-foreground/78">
          <p>
            {b.subscriptionMethod}: {methodLabel}
          </p>
          {subscription.amountCents !== null && subscription.currency ? (
            <p>
              {b.subscriptionAmount}: {formatMoney(subscription.amountCents, subscription.currency)}{" "}
              / {b.subscriptionMonth}
            </p>
          ) : null}
          {subscription.status !== "cancelled" ? (
            <p>
              {b.subscriptionNextBilling}: {formatDate(nextDate, locale)}
            </p>
          ) : null}
        </div>

        {subscription.billingProvider === "mobile_money" && subscription.status === "active" ? (
          <Text className="text-xs" tone="muted">
            {b.subscriptionMobileMoneyHint}
          </Text>
        ) : null}

        {subscription.status !== "cancelled" ? (
          <div>
            <Button
              disabled={isCancelling}
              isLoading={isCancelling}
              onClick={handleCancel}
              size="sm"
              variant="danger"
            >
              {b.subscriptionCancel}
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

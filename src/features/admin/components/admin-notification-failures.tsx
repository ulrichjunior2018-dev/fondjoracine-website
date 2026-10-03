import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { NotificationFailure } from "@/services/commerce/notification-log-service";

const CHANNEL_LABEL: Record<string, string> = {
  admin_email: "Admin email",
  customer_email: "Customer email",
  customer_sms: "Customer SMS",
};

/**
 * Recent failed/undelivered notifications (email rejected by Resend, SMS
 * rejected or undelivered per Twilio's status webhook). Empty by design
 * when nothing has failed — this panel only needs to earn attention when
 * there's something to see.
 */
export function AdminNotificationFailures({ failures }: { failures: NotificationFailure[] }) {
  if (failures.length === 0) return null;

  return (
    <Card className="border-destructive/30 bg-destructive-muted/40">
      <CardHeader>
        <CardTitle className="text-destructive">
          Notification failures ({failures.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Channel</TableHead>
              <TableHead>Event</TableHead>
              <TableHead>Recipient</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Error</TableHead>
              <TableHead>When</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {failures.map((f) => (
              <TableRow key={f.id}>
                <TableCell className="font-mono text-xs">{f.orderNumber ?? "—"}</TableCell>
                <TableCell>{CHANNEL_LABEL[f.channel] ?? f.channel}</TableCell>
                <TableCell>{f.kind}</TableCell>
                <TableCell className="max-w-[160px] truncate">{f.recipient ?? "—"}</TableCell>
                <TableCell>
                  <Badge tone="danger">{f.status}</Badge>
                </TableCell>
                <TableCell className="max-w-[240px] truncate text-xs text-foreground/68">
                  {f.error ?? "—"}
                </TableCell>
                <TableCell className="text-xs text-foreground/58">
                  {new Date(f.createdAt).toLocaleString("en-US")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

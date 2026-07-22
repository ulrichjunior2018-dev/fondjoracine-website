import { PageLoader } from "@/components/ui/page-loader";

export default function CheckoutLoading() {
  return (
    <div className="min-h-svh lg:grid lg:grid-cols-2">
      <PageLoader className="min-h-[45svh] lg:min-h-svh" label="Checkout" tone="dark" />
      <PageLoader className="min-h-[45svh] lg:min-h-svh" label="Payment" tone="light" />
    </div>
  );
}

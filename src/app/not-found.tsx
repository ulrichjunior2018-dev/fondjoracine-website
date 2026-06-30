import { EmptyState } from "@/components/feedback/empty-state";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-6 py-12">
      <EmptyState
        title="Page not found"
        description="The requested FONDJO experience is not available."
      />
    </main>
  );
}

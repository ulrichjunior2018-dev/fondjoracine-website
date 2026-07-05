import { EmptyState } from "@/components/feedback/empty-state";
import { publicCopy } from "@/content/copy";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-6 py-12">
      <EmptyState
        title={publicCopy.errors.notFoundTitle}
        description={publicCopy.errors.notFoundBody}
      />
    </main>
  );
}

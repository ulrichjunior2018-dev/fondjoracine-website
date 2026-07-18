import { EmptyState } from "@/components/feedback/empty-state";
import { resolvePublicCopy } from "@/lib/seo/public-route-metadata";

export default async function NotFound() {
  const { publicCopy } = await resolvePublicCopy();

  return (
    <main className="flex min-h-dvh items-center justify-center px-6 py-12">
      <EmptyState
        title={publicCopy.errors.notFoundTitle}
        description={publicCopy.errors.notFoundBody}
      />
    </main>
  );
}

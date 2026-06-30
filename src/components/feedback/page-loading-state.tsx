import { Loader } from "@/components/ui/loader";

type PageLoadingStateProps = {
  label: string;
};

export function PageLoadingState({ label }: PageLoadingStateProps) {
  return (
    <main className="flex min-h-dvh items-center justify-center px-6 py-12" aria-busy="true">
      <Loader label={label} />
    </main>
  );
}

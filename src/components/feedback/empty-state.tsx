type EmptyStateProps = {
  title: string;
  description?: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <section className="w-full max-w-md text-center" aria-live="polite">
      <h1 className="text-2xl font-semibold tracking-normal text-foreground">{title}</h1>
      {description ? (
        <p className="mt-3 text-sm leading-6 text-foreground/70">{description}</p>
      ) : null}
    </section>
  );
}

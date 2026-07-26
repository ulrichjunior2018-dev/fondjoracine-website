"use client";

type PrintReceiptButtonProps = {
  label: string;
};

export function PrintReceiptButton({ label }: PrintReceiptButtonProps) {
  return (
    <button
      className="inline-flex h-10 items-center justify-center rounded-md bg-foreground px-4 text-sm font-semibold text-background"
      onClick={() => window.print()}
      type="button"
    >
      {label}
    </button>
  );
}

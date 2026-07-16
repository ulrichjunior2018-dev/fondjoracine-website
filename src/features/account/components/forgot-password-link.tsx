import Link from "next/link";

export function ForgotPasswordLink() {
  return (
    <Link className="text-center text-sm font-semibold text-accent" href="/forgot-password">
      Forgot your password?
    </Link>
  );
}

import { redirect } from "next/navigation";

/** One-product path: cart consolidates into checkout until multi-SKU cart UI ships. */
export default function CartPage() {
  redirect("/checkout" as never);
}

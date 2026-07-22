import { redirect } from "next/navigation";

export default function SearchPage() {
  redirect("/shop" as never);
}

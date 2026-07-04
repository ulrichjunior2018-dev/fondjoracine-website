import { redirect } from "next/navigation";

export default function HairConsultationPage() {
  redirect("/diagnostic" as never);
}

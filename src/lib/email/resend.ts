import { Resend } from "resend";

import { env } from "@/config/env";
import { AppError } from "@/lib/errors/app-error";

let resend: Resend | null = null;

export function getResendClient() {
  if (!env.RESEND_API_KEY) {
    throw new AppError("INTERNAL", "Resend API key is not configured.", { expose: false });
  }

  resend ??= new Resend(env.RESEND_API_KEY);

  return resend;
}

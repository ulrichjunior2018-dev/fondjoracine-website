import { NextResponse } from "next/server";

import { namesFromAuthMetadata } from "@/lib/identity/user-identities";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function safeNextPath(next: string | null): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return "/account";
  }
  return next;
}

/**
 * Shared auth callback for every identity method (OAuth, email confirm, reset).
 * Provider-agnostic: does not branch on Google/Apple/etc.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = safeNextPath(url.searchParams.get("next"));
  const oauthError = url.searchParams.get("error_description") ?? url.searchParams.get("error");

  if (oauthError) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(oauthError)}`, url.origin),
    );
  }

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(error.message)}`, url.origin),
      );
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { firstName, lastName } = namesFromAuthMetadata(
        user.user_metadata as Record<string, unknown>,
      );

      if (firstName || lastName) {
        await supabase
          .from("profiles")
          .update({
            ...(firstName ? { first_name: firstName } : {}),
            ...(lastName ? { last_name: lastName } : {}),
          })
          .eq("id", user.id)
          .is("first_name", null);
      }
    }
  }

  return NextResponse.redirect(new URL(next, url.origin));
}

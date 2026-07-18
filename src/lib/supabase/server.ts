import { createServerClient, type CookieMethodsServer } from "@supabase/ssr";
import { cookies } from "next/headers";

import { env } from "@/config/env";
import { AppError } from "@/lib/errors/app-error";

function getSupabasePublicEnv() {
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new AppError("INTERNAL", "Supabase public environment variables are not configured.", {
      expose: false,
    });
  }

  return {
    url: env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };
}

export async function createSupabaseServerClient() {
  const { url, anonKey } = getSupabasePublicEnv();
  const cookieStore = await cookies();
  const cookieMethods: CookieMethodsServer = {
    getAll() {
      return cookieStore.getAll();
    },
    setAll(cookiesToSet) {
      try {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options);
        });
      } catch {
        // `setAll` is called from a Server Component render, where cookies are
        // read-only. This is safe to ignore: the session is refreshed and its
        // cookies are persisted from a Route Handler / Server Action instead
        // (see /auth/callback and the browser auth client). Without this guard
        // Next.js throws "Cookies can only be modified in a Server Action or
        // Route Handler" during account page renders.
      }
    },
  };

  return createServerClient(url, anonKey, {
    cookies: cookieMethods,
  });
}

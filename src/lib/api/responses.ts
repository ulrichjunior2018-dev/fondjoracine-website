import { NextResponse } from "next/server";

import { normalizeError } from "@/lib/errors/app-error";

export type ApiSuccess<T> = {
  data: T;
};

export type ApiFailure = {
  error: {
    code: string;
    message: string;
  };
};

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json<ApiSuccess<T>>({ data }, init);
}

export function fail(error: unknown) {
  const appError = normalizeError(error);

  return NextResponse.json<ApiFailure>(
    {
      error: {
        code: appError.code,
        message: appError.expose ? appError.message : "Internal server error.",
      },
    },
    { status: appError.status },
  );
}

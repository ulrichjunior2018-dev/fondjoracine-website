"use client";

import { forwardRef, useState, type InputHTMLAttributes } from "react";

import { Icons } from "@/components/icons/icons";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";

type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  isInvalid?: boolean;
};

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput({ className, isInvalid = false, ...props }, ref) {
    const [visible, setVisible] = useState(false);

    return (
      <div className="relative min-w-0 w-full max-w-full">
        <Input
          className={cn("pr-11", className)}
          isInvalid={isInvalid}
          ref={ref}
          type={visible ? "text" : "password"}
          {...props}
        />
        <button
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className="absolute inset-y-0 right-0 grid w-11 shrink-0 place-items-center text-foreground/55 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
          onClick={() => setVisible((current) => !current)}
          type="button"
        >
          {visible ? (
            <Icons.eyeOff aria-hidden="true" className="h-4 w-4" />
          ) : (
            <Icons.eye aria-hidden="true" className="h-4 w-4" />
          )}
        </button>
      </div>
    );
  },
);

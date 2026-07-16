"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons/icons";
import { useToast } from "@/components/ui/toast";
import { signOut } from "@/features/account/lib/auth-client";

type SignOutButtonProps = {
  className?: string;
  everywhere?: boolean;
  label?: string;
};

export function SignOutButton({
  className,
  everywhere = false,
  label = "Sign out",
}: SignOutButtonProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  async function handleClick() {
    setIsLoading(true);

    try {
      await signOut({ everywhere });
      router.push("/login");
      router.refresh();
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Couldn't sign out",
        description: error instanceof Error ? error.message : "Please try again.",
        tone: "danger",
      });
    }
  }

  return (
    <Button
      className={className}
      isLoading={isLoading}
      leadingIcon={<Icons.logOut aria-hidden="true" className="h-4 w-4" />}
      onClick={handleClick}
      type="button"
      variant={everywhere ? "danger" : "secondary"}
    >
      {label}
    </Button>
  );
}

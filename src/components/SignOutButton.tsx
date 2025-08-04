"use client";

import { signOut } from "next-auth/react";
import { Button } from "./Button";

interface SignOutButtonProps {
  className?: string;
}

export default function SignOutButton({ className }: SignOutButtonProps) {
  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <Button onClick={handleSignOut} variant="outline" className={className}>
      Sign Out
    </Button>
  );
}

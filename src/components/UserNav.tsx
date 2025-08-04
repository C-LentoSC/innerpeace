"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "./Button";
import SignOutButton from "./SignOutButton";

export default function UserNav() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="animate-pulse h-10 w-20 bg-gray-200 rounded"></div>;
  }

  if (!session) {
    return (
      <div className="flex items-center space-x-4">
        <Link href="/signin">
          <Button variant="outline">Sign In</Button>
        </Link>
        <Link href="/signup">
          <Button>Sign Up</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <div className="text-sm">
          <p className="font-medium text-foreground">
            Welcome, {session.user?.firstName || session.user?.name}
          </p>
          <p className="text-foreground/60 text-xs">
            {session.user?.role === "SUPERADMIN"
              ? "Super Admin"
              : session.user?.role === "ADMIN"
              ? "Admin"
              : "User"}
          </p>
        </div>
      </div>
      <SignOutButton />
    </div>
  );
}

"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { Button } from "./Button";
import SignOutButton from "./SignOutButton";
import UserProfileModal from "./UserProfileModal";

interface UserData {
  id: string;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  mobileNumber: string | null;
  role: string;
}

export default function UserNav() {
  const { data: session, status } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

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

  const handleUserUpdate = (updatedUser: UserData) => {
    setUserData(updatedUser);
  };

  const displayName = userData?.firstName || userData?.name || session.user?.firstName || session.user?.name;

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <div className="text-sm">
          <p 
            className="font-medium modern-gradient-text cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setIsModalOpen(true)}
            title="Click to edit profile"
          >
            Welcome, {displayName}
          </p>
          <p className="text-slate-300 text-xs">
            {session.user?.role === "SUPERADMIN"
              ? "Super Admin"
              : session.user?.role === "ADMIN"
              ? "Admin"
              : "User"}
          </p>
        </div>
      </div>
      <SignOutButton />
      
      <UserProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdate={handleUserUpdate}
      />
    </div>
  );
}

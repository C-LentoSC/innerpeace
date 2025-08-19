import { ReactNode } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

type Role = "USER" | "ADMIN" | "SUPERADMIN";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: Role[];
  redirectTo?: string;
  fallback?: ReactNode;
}

export async function RoleGuard({
  children,
  allowedRoles,
  redirectTo = "/",
  fallback = null,
}: RoleGuardProps) {
  const session = await auth();

  // Check if user is authenticated
  if (!session?.user) {
    redirect("/signin");
  }

  const userRole = session.user.role as Role;

  // Check if user has required role
  if (!allowedRoles.includes(userRole)) {
    if (fallback) {
      return <>{fallback}</>;
    }
    redirect(redirectTo);
  }

  return <>{children}</>;
}

// Client-side role guard for conditional rendering
export function useRoleAccess(requiredRoles: Role[], userRole?: string): boolean {
  if (!userRole) return false;
  return requiredRoles.includes(userRole as Role);
}
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Check if user is authenticated
  if (!session?.user) {
    redirect("/signin?callbackUrl=/account");
  }

  return <>{children}</>;
}
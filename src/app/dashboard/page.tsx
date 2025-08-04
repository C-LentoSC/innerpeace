import { auth } from "@/auth";
import { redirect } from "next/navigation";
import SignOutButton from "@/components/SignOutButton";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/signin");
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-card rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Dashboard
              </h1>
              <p className="text-foreground/70">
                Welcome to your protected dashboard
              </p>
            </div>
            <SignOutButton />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-background rounded-lg p-6 border">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                User Information
              </h2>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-foreground/80">Name:</span>
                  <span className="ml-2 text-foreground">
                    {session.user?.firstName} {session.user?.lastName}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-foreground/80">Email:</span>
                  <span className="ml-2 text-foreground">
                    {session.user?.email}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-foreground/80">Role:</span>
                  <span className="ml-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        session.user?.role === "SUPERADMIN"
                          ? "bg-red-100 text-red-800"
                          : session.user?.role === "ADMIN"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {session.user?.role === "SUPERADMIN"
                        ? "Super Admin"
                        : session.user?.role === "ADMIN"
                        ? "Admin"
                        : "User"}
                    </span>
                  </span>
                </div>
                <div>
                  <span className="font-medium text-foreground/80">
                    User ID:
                  </span>
                  <span className="ml-2 text-foreground font-mono text-sm">
                    {session.user?.id}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-background rounded-lg p-6 border">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Session Information
              </h2>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-foreground/80">
                    Session Active:
                  </span>
                  <span className="ml-2 text-green-600">✓ Yes</span>
                </div>
                <div>
                  <span className="font-medium text-foreground/80">
                    Authentication Method:
                  </span>
                  <span className="ml-2 text-foreground">Credentials</span>
                </div>
              </div>
            </div>
          </div>

          {session.user?.role === "SUPERADMIN" && (
            <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-red-800 mb-4">
                🔑 Super Admin Panel
              </h2>
              <p className="text-red-700">
                You have super admin privileges. This section would contain
                admin-only functionality.
              </p>
            </div>
          )}

          {session.user?.role === "ADMIN" && (
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-blue-800 mb-4">
                👑 Admin Panel
              </h2>
              <p className="text-blue-700">
                You have admin privileges. This section would contain admin
                functionality.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

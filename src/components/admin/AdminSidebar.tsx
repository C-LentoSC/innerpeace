"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Settings,
  Package,
  MessageSquare,
  BarChart3,
  Image,
  X,
  FolderOpen,
  Percent,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Bookings", href: "/admin/bookings", icon: Calendar },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Therapists", href: "/admin/therapists", icon: Users },
  { name: "Packages", href: "/admin/packages", icon: Package },
  { name: "Categories", href: "/admin/category", icon: FolderOpen },
  { name: "Gallery", href: "/admin/gallery", icon: Image },
  { name: "Reviews", href: "/admin/reviews", icon: MessageSquare },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Taxes", href: "/admin/taxes", icon: Percent },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 sidebar-glass transform transition-transform duration-300 ease-in-out lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-white-border">
            <div className="flex items-center">
              <div className="text-xl font-bold modern-gradient-text">
                InnerPeace Admin
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-glass-card"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group relative",
                    isActive
                      ? "glossy-golden text-white shadow-lg"
                      : "text-slate-300 hover:text-white hover:bg-glass-card glass-card-hover border border-transparent hover:border-white-border"
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                  {isActive && (
                    <div className="absolute inset-0 rounded-xl bg-warm-gold opacity-10 animate-pulse" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col sidebar-glass">
          {/* Header */}
          <div className="flex h-16 items-center px-6 border-b border-white-border">
            <div className="text-xl font-bold modern-gradient-text">
              InnerPeace Admin
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group relative",
                    isActive
                      ? "glossy-golden text-white shadow-lg"
                      : "text-slate-300 hover:text-white hover:bg-glass-card glass-card-hover border border-transparent hover:border-white-border"
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                  {isActive && (
                    <div className="absolute inset-0 rounded-xl bg-warm-gold opacity-10 animate-pulse" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}

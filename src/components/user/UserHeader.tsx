"use client";

import { Menu, Bell, Search, Home } from "lucide-react";
import { Button } from "@/components/Button";
import UserNav from "@/components/UserNav";
import Link from "next/link";

interface UserHeaderProps {
  onMenuClick: () => void;
}

export default function UserHeader({ onMenuClick }: UserHeaderProps) {
  return (
    <header className="header-glass">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left side */}
        <div className="flex items-center">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden mr-3 border border-white-border hover:border-white-border-hover"
          >
            <Menu className="h-6 w-6" />
          </Button>

          {/* Search bar */}
          <div className="hidden sm:block">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search services, appointments..."
                className="block w-full rounded-xl border border-white-border bg-glass-card py-2 pl-10 pr-3 text-sm placeholder:text-slate-400 focus:border-white-border-hover focus:outline-none focus:ring-1 focus:ring-warm-gold sm:w-64 backdrop-blur-sm"
              />
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Home button */}
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="border border-white-border hover:border-white-border-hover hover:bg-glass-card flex items-center space-x-2"
            >
              <Home className="h-5 w-5" />
              <span className="hidden sm:inline">Home</span>
            </Button>
          </Link>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="sm"
            className="relative border border-white-border hover:border-white-border-hover hover:bg-glass-card"
          >
            <Bell className="h-5 w-5" />
            {/* Notification badge */}
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-warm-gold text-xs text-white flex items-center justify-center font-medium shadow-lg">
              2
            </span>
          </Button>

          {/* User navigation */}
          <UserNav />
        </div>
      </div>
    </header>
  );
}

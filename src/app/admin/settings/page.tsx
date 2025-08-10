"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Settings as SettingsIcon,
  Bell,
  Shield,
  Palette,
  Clock,
  Mail,
  Phone,
  MapPin,
  Save,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/Button";

interface Settings {
  adminName: string;
  adminEmail: string;
  timezone: string;
  salonName: string;
  phone: string;
  email: string;
  address: string;
  openingTime: string;
  closingTime: string;
  notifications: {
    newBookings: boolean;
    paymentConfirmations: boolean;
    customerReviews: boolean;
    weeklyReports: boolean;
  };
}

export default function SettingsPage() {
  const router = useRouter();
  const { data: session, update, status } = useSession();
  const userId = (session?.user as { id?: string | null } | undefined)?.id ?? undefined;
  const [settings, setSettings] = useState<Settings>({
    adminName: "John Doe",
    adminEmail: "admin@innerpeace.com",
    timezone: "Asia/Kolkata",
    salonName: "InnerPeace Wellness Spa",
    phone: "+91 98765 43210",
    email: "info@innerpeace.com",
    address: "123 Wellness Street, Spa District, Mumbai, Maharashtra 400001",
    openingTime: "09:00",
    closingTime: "21:00",
    notifications: {
      newBookings: true,
      paymentConfirmations: true,
      customerReviews: false,
      weeklyReports: true,
    },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const fetchSettings = useCallback(async () => {
    try {
      const response = await fetch(userId ? `/api/settings?userId=${encodeURIComponent(userId)}` : "/api/settings");
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (err) {
      console.error("Error fetching settings:", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    // Fetch when session is ready so we can include userId
    if (status !== "loading") {
      fetchSettings();
    }
  }, [status, fetchSettings]);

  // Prefill admin fields from the logged-in user's session
  useEffect(() => {
    if (session?.user) {
      setSettings((prev) => ({
        ...prev,
        // Only prefill if values are not already fetched from server
        adminName: prev.adminName && prev.adminName !== "John Doe" ? prev.adminName : (session.user.name ?? prev.adminName),
        adminEmail: prev.adminEmail && prev.adminEmail !== "admin@innerpeace.com" ? prev.adminEmail : (session.user.email ?? prev.adminEmail),
      }));
    }
  }, [session]);

  

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    
    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...settings,
          userId,
        }),
      });

      if (response.ok) {
        const saved = await response.json();
        // Sync any server-confirmed values back into local state
        setSettings((prev) => ({
          ...prev,
          adminName: saved.adminName ?? prev.adminName,
          adminEmail: saved.adminEmail ?? prev.adminEmail,
          phone: saved.phone ?? prev.phone,
          address: saved.address ?? prev.address,
        }));
        setMessage("Settings saved successfully!");
        // Update session so header reflects new name/email immediately
        try {
          await update?.({
            name: settings.adminName,
            email: settings.adminEmail,
          });
        } catch {}
        // Refresh any server components reading session
        router.refresh();
        // Re-fetch to ensure UI reflects DB
        await fetchSettings();
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("Failed to save settings");
      }
    } catch {
      setMessage("Error saving settings");
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (key: keyof Settings["notifications"], value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: value },
    }));
  };

  if (loading) return <div className="p-6 text-center">Loading settings...</div>;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold gradient-text1">Settings</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your salon settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings navigation */}
        <div className="lg:col-span-1">
          <nav className="space-y-2">
            <a
              href="#general"
              className="flex items-center px-3 py-2 text-sm font-medium rounded-lg bg-primary/20 text-primary border-l-4 border-primary"
            >
              <SettingsIcon className="mr-3 h-5 w-5" />
              General
            </a>
            <a
              href="#business"
              className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50"
            >
              <MapPin className="mr-3 h-5 w-5" />
              Business Info
            </a>
            <a
              href="#notifications"
              className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50"
            >
              <Bell className="mr-3 h-5 w-5" />
              Notifications
            </a>
            <a
              href="#security"
              className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50"
            >
              <Shield className="mr-3 h-5 w-5" />
              Security
            </a>
            <a
              href="#appearance"
              className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50"
            >
              <Palette className="mr-3 h-5 w-5" />
              Appearance
            </a>
          </nav>
        </div>

        {/* Settings content */}
        <div className="lg:col-span-3 space-y-6">
          {/* General Settings */}
          <div
            id="general"
            className="bg-card rounded-lg border border-border p-6"
          >
            <h2 className="text-xl font-semibold text-foreground mb-6">
              General Settings
            </h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Admin Name
                  </label>
                  <input
                    type="text"
                    value={settings.adminName}
                    onChange={(e) => handleInputChange("adminName", e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Admin Email
                  </label>
                  <input
                    type="email"
                    value={settings.adminEmail}
                    onChange={(e) => handleInputChange("adminEmail", e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Time Zone
                </label>
                <select 
                  value={settings.timezone}
                  onChange={(e) => handleInputChange("timezone", e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Asia/Kolkata">Asia/Kolkata (GMT+5:30)</option>
                  <option value="Asia/Dubai">Asia/Dubai (GMT+4:00)</option>
                  <option value="Europe/London">Europe/London (GMT+0:00)</option>
                  <option value="America/New_York">America/New_York (GMT-5:00)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div
            id="business"
            className="bg-card rounded-lg border border-border p-6"
          >
            <h2 className="text-xl font-semibold text-foreground mb-6">
              Business Information
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Salon Name
                </label>
                <input
                  type="text"
                  value={settings.salonName}
                  onChange={(e) => handleInputChange("salonName", e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="tel"
                      value={settings.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="w-full pl-10 pr-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="email"
                      value={settings.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="w-full pl-10 pr-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Address
                </label>
                <textarea
                  rows={3}
                  value={settings.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Opening Time
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="time"
                      value={settings.openingTime}
                      onChange={(e) => handleInputChange("openingTime", e.target.value)}
                      className="w-full pl-10 pr-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Closing Time
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="time"
                      value={settings.closingTime}
                      onChange={(e) => handleInputChange("closingTime", e.target.value)}
                      className="w-full pl-10 pr-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div
            id="notifications"
            className="bg-card rounded-lg border border-border p-6"
          >
            <h2 className="text-xl font-semibold text-foreground mb-6">
              Notification Preferences
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-foreground">
                    New Booking Notifications
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Get notified when customers make new bookings
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings.notifications.newBookings}
                    onChange={(e) => handleNotificationChange("newBookings", e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-foreground">
                    Payment Confirmations
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Get notified when payments are received
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings.notifications.paymentConfirmations}
                    onChange={(e) => handleNotificationChange("paymentConfirmations", e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-foreground">
                    Customer Reviews
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Get notified when customers leave reviews
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={settings.notifications.customerReviews}
                    onChange={(e) => handleNotificationChange("customerReviews", e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-foreground">
                    Weekly Reports
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Receive weekly business performance reports
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings.notifications.weeklyReports}
                    onChange={(e) => handleNotificationChange("weeklyReports", e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div
            id="security"
            className="bg-card rounded-lg border border-border p-6"
          >
            <h2 className="text-xl font-semibold text-foreground mb-6">
              Security Settings
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-foreground mb-4">
                  Change Password
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div>
                  <h3 className="text-sm font-medium text-foreground">
                    Two-Factor Authentication
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Enable 2FA
                </Button>
              </div>
            </div>
          </div>

          {/* Success message */}
          {message && (
            <div className={`p-4 rounded-lg text-sm ${
              message.includes("success") 
                ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" 
                : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
            }`}>
              {message}
            </div>
          )}

          {/* Save button */}
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save All Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

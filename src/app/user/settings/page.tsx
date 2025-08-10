"use client";

import { useState } from "react";
import {
  Bell,
  Shield,
  Palette,
  Clock,
  Mail,
  Save,
  User,
  CreditCard,
  Calendar,
  Heart,
  Smartphone,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/Button";
import { useSession } from "next-auth/react";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [activeSection, setActiveSection] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);

  type Settings = {
    // Profile Settings
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    dateOfBirth: string;

    // Notification Settings
    emailNotifications: boolean;
    smsReminders: boolean;
    promotionalEmails: boolean;
    appointmentReminders: boolean;
    reviewRequests: boolean;

    // Privacy Settings
    profileVisibility: "private" | "public" | "friends";
    shareData: boolean;
    analytics: boolean;

    // Preferences
    preferredLanguage: string;
    timezone: string;
    currency: string;
    theme: "light" | "dark" | "auto";

    // Booking Preferences
    defaultDuration: number;
    preferredTimeSlot: "morning" | "afternoon" | "evening";
    autoRebook: boolean;
    favoriteTherapists: number[] | string[];
  };

  const [settings, setSettings] = useState<Settings>({
    // Profile Settings
    firstName: session?.user?.firstName || "",
    lastName: session?.user?.lastName || "",
    email: session?.user?.email || "",
    phone: "",
    address: "",
    dateOfBirth: "",

    // Notification Settings
    emailNotifications: true,
    smsReminders: true,
    promotionalEmails: false,
    appointmentReminders: true,
    reviewRequests: true,

    // Privacy Settings
    profileVisibility: "private",
    shareData: false,
    analytics: true,

    // Preferences
    preferredLanguage: "en",
    timezone: "Asia/Kolkata",
    currency: "INR",
    theme: "dark",

    // Booking Preferences
    defaultDuration: 60,
    preferredTimeSlot: "afternoon",
    autoRebook: false,
    favoriteTherapists: [],
  });

  const handleInputChange = <K extends keyof Settings>(
    field: K,
    value: Settings[K]
  ) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    // TODO: Implement settings save API call
    console.log("Saving settings:", settings);
  };

  const sidebarItems = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy & Security", icon: Shield },
    { id: "preferences", label: "Preferences", icon: Palette },
    { id: "booking", label: "Booking Settings", icon: Calendar },
    { id: "payment", label: "Payment Methods", icon: CreditCard },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-card rounded-xl p-6 border border-white-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold modern-gradient-text">
              Account Settings
            </h1>
            <p className="mt-2 text-slate-400">
              Manage your account preferences and privacy settings
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button
              onClick={handleSave}
              variant="default"
              className="flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="glass-card rounded-xl p-4 border border-white-border sticky top-6">
            <nav className="space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                      activeSection === item.id
                        ? "bg-warm-gold text-white shadow-lg"
                        : "text-slate-300 hover:text-white hover:bg-glass-card glass-card-hover"
                    }`}
                  >
                    <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="glass-card rounded-xl p-6 border border-white-border">
            {/* Profile Section */}
            {activeSection === "profile" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold modern-gradient-text mb-2">
                    Profile Information
                  </h2>
                  <p className="text-slate-400">
                    Update your personal information and contact details.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={settings.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      className="w-full px-4 py-3 bg-glass-card border border-white-border rounded-xl text-foreground placeholder-slate-400 focus:border-warm-gold focus:ring-1 focus:ring-warm-gold"
                      placeholder="Enter your first name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={settings.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      className="w-full px-4 py-3 bg-glass-card border border-white-border rounded-xl text-foreground placeholder-slate-400 focus:border-warm-gold focus:ring-1 focus:ring-warm-gold"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full px-4 py-3 bg-glass-card border border-white-border rounded-xl text-foreground placeholder-slate-400 focus:border-warm-gold focus:ring-1 focus:ring-warm-gold"
                    placeholder="Enter your email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={settings.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="w-full px-4 py-3 bg-glass-card border border-white-border rounded-xl text-foreground placeholder-slate-400 focus:border-warm-gold focus:ring-1 focus:ring-warm-gold"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Address
                  </label>
                  <textarea
                    value={settings.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    rows={3}
                    className="w-full px-4 py-3 bg-glass-card border border-white-border rounded-xl text-foreground placeholder-slate-400 focus:border-warm-gold focus:ring-1 focus:ring-warm-gold resize-none"
                    placeholder="Enter your address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={settings.dateOfBirth}
                    onChange={(e) =>
                      handleInputChange("dateOfBirth", e.target.value)
                    }
                    className="w-full px-4 py-3 bg-glass-card border border-white-border rounded-xl text-foreground placeholder-slate-400 focus:border-warm-gold focus:ring-1 focus:ring-warm-gold"
                  />
                </div>
              </div>
            )}

            {/* Notifications Section */}
            {activeSection === "notifications" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold modern-gradient-text mb-2">
                    Notification Preferences
                  </h2>
                  <p className="text-slate-400">
                    Choose how you want to receive notifications and updates.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-glass-card rounded-xl border border-white-border">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-slate-400" />
                      <div>
                        <h3 className="text-sm font-medium text-foreground">
                          Email Notifications
                        </h3>
                        <p className="text-xs text-slate-400">
                          Receive booking confirmations and updates via email
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.emailNotifications}
                        onChange={(e) =>
                          handleInputChange(
                            "emailNotifications",
                            e.target.checked
                          )
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-warm-gold/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-warm-gold"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-glass-card rounded-xl border border-white-border">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="h-5 w-5 text-slate-400" />
                      <div>
                        <h3 className="text-sm font-medium text-foreground">
                          SMS Reminders
                        </h3>
                        <p className="text-xs text-slate-400">
                          Get SMS reminders for upcoming appointments
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.smsReminders}
                        onChange={(e) =>
                          handleInputChange("smsReminders", e.target.checked)
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-warm-gold/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-warm-gold"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-glass-card rounded-xl border border-white-border">
                    <div className="flex items-center space-x-3">
                      <Heart className="h-5 w-5 text-slate-400" />
                      <div>
                        <h3 className="text-sm font-medium text-foreground">
                          Promotional Offers
                        </h3>
                        <p className="text-xs text-slate-400">
                          Receive special offers and promotional updates
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.promotionalEmails}
                        onChange={(e) =>
                          handleInputChange(
                            "promotionalEmails",
                            e.target.checked
                          )
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-warm-gold/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-warm-gold"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-glass-card rounded-xl border border-white-border">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-slate-400" />
                      <div>
                        <h3 className="text-sm font-medium text-foreground">
                          Appointment Reminders
                        </h3>
                        <p className="text-xs text-slate-400">
                          Get reminders 24 hours before appointments
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.appointmentReminders}
                        onChange={(e) =>
                          handleInputChange(
                            "appointmentReminders",
                            e.target.checked
                          )
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-warm-gold/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-warm-gold"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Section */}
            {activeSection === "privacy" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold modern-gradient-text mb-2">
                    Privacy & Security
                  </h2>
                  <p className="text-slate-400">
                    Manage your privacy settings and account security.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="w-full px-4 py-3 bg-glass-card border border-white-border rounded-xl text-foreground placeholder-slate-400 focus:border-warm-gold focus:ring-1 focus:ring-warm-gold pr-12"
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-foreground"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 bg-glass-card border border-white-border rounded-xl text-foreground placeholder-slate-400 focus:border-warm-gold focus:ring-1 focus:ring-warm-gold"
                      placeholder="Enter new password"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 bg-glass-card border border-white-border rounded-xl text-foreground placeholder-slate-400 focus:border-warm-gold focus:ring-1 focus:ring-warm-gold"
                      placeholder="Confirm new password"
                    />
                  </div>

                  <div className="pt-4 border-t border-white-border">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Profile Visibility
                        </label>
                        <select
                          value={settings.profileVisibility}
                          onChange={(e) =>
                            handleInputChange(
                              "profileVisibility",
                              e.target.value as Settings["profileVisibility"]
                            )
                          }
                          className="w-full px-4 py-3 bg-glass-card border border-white-border rounded-xl text-foreground focus:border-warm-gold focus:ring-1 focus:ring-warm-gold"
                        >
                          <option value="private">Private</option>
                          <option value="public">Public</option>
                          <option value="friends">Friends Only</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-glass-card rounded-xl border border-white-border">
                        <div>
                          <h3 className="text-sm font-medium text-foreground">
                            Share Usage Data
                          </h3>
                          <p className="text-xs text-slate-400">
                            Help improve our services by sharing anonymous usage data
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.shareData}
                            onChange={(e) =>
                              handleInputChange("shareData", e.target.checked)
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-warm-gold/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-warm-gold"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Methods */}
            {activeSection === "payment" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold modern-gradient-text mb-2">
                    Payment Methods
                  </h2>
                  <p className="text-slate-400">
                    Manage your saved payment methods and billing preferences.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-glass-card rounded-xl border border-white-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <CreditCard className="h-5 w-5 text-slate-400" />
                        <div>
                          <h3 className="text-sm font-medium text-foreground">
                            •••• •••• •••• 1234
                          </h3>
                          <p className="text-xs text-slate-400">
                            Visa ending in 1234 • Expires 12/25
                          </p>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-success/20 text-success text-xs font-medium rounded-full border border-success/40">
                        Default
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center space-x-2"
                  >
                    <CreditCard className="h-4 w-4" />
                    <span>Add Payment Method</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

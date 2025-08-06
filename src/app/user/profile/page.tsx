"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Camera,
  Edit3,
  Save,
  X,
} from "lucide-react";
import { Button } from "@/components/Button";
import Image from "next/image";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: session?.user?.firstName || "",
    lastName: session?.user?.lastName || "",
    email: session?.user?.email || "",
    phone: "",
    address: "",
    dateOfBirth: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // TODO: Implement profile update API call
    console.log("Saving profile data:", formData);
    setIsEditing(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-card rounded-xl p-6 border border-white-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold modern-gradient-text">
              My Profile
            </h1>
            <p className="mt-2 text-slate-400">
              Manage your account information and preferences
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <Edit3 className="h-4 w-4" />
                <span>Edit Profile</span>
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button
                  onClick={handleSave}
                  variant="default"
                  className="flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </Button>
                <Button
                  onClick={() => setIsEditing(false)}
                  variant="ghost"
                  className="flex items-center space-x-2"
                >
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture & Basic Info */}
        <div className="glass-card rounded-xl p-6 border border-white-border">
          <div className="text-center">
            <div className="relative inline-block">
              <div className="w-32 h-32 rounded-full bg-warm-gold/20 border-2 border-warm-gold/40 flex items-center justify-center mx-auto mb-4 overflow-hidden">
                {session?.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt="Profile"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-16 w-16 text-warm-gold" />
                )}
              </div>
              <button className="absolute -bottom-2 right-1/2 translate-x-1/2 bg-warm-gold hover:bg-warm-gold/80 text-white p-2 rounded-full shadow-lg transition-colors">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <h3 className="text-xl font-semibold text-foreground">
              {session?.user?.firstName} {session?.user?.lastName}
            </h3>
            <p className="text-slate-400">{session?.user?.email}</p>
            <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-warm-gold/20 text-warm-gold border border-warm-gold/40">
              VIP Member
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between p-3 bg-glass-card rounded-lg border border-white-border">
              <span className="text-slate-400">Member Since</span>
              <span className="text-foreground font-medium">Jan 2024</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-glass-card rounded-lg border border-white-border">
              <span className="text-slate-400">Total Visits</span>
              <span className="text-foreground font-medium">12</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-glass-card rounded-lg border border-white-border">
              <span className="text-slate-400">Points Balance</span>
              <span className="text-warm-gold font-medium">2,450 pts</span>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="lg:col-span-2 glass-card rounded-xl p-6 border border-white-border">
          <div className="mb-6">
            <h3 className="text-xl font-semibold modern-gradient-text">
              Personal Information
            </h3>
            <p className="text-slate-400 mt-1">
              Update your personal details and contact information
            </p>
          </div>

          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-4 py-3 bg-glass-card border border-white-border rounded-xl text-foreground placeholder-slate-400 focus:border-warm-gold focus:ring-1 focus:ring-warm-gold disabled:opacity-60 disabled:cursor-not-allowed"
                    placeholder="Enter your first name"
                  />
                </div>
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Last Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-4 py-3 bg-glass-card border border-white-border rounded-xl text-foreground placeholder-slate-400 focus:border-warm-gold focus:ring-1 focus:ring-warm-gold disabled:opacity-60 disabled:cursor-not-allowed"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full pl-10 pr-4 py-3 bg-glass-card border border-white-border rounded-xl text-foreground placeholder-slate-400 focus:border-warm-gold focus:ring-1 focus:ring-warm-gold disabled:opacity-60 disabled:cursor-not-allowed"
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full pl-10 pr-4 py-3 bg-glass-card border border-white-border rounded-xl text-foreground placeholder-slate-400 focus:border-warm-gold focus:ring-1 focus:ring-warm-gold disabled:opacity-60 disabled:cursor-not-allowed"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Date of Birth
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full pl-10 pr-4 py-3 bg-glass-card border border-white-border rounded-xl text-foreground placeholder-slate-400 focus:border-warm-gold focus:ring-1 focus:ring-warm-gold disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows={3}
                  className="w-full pl-10 pr-4 py-3 bg-glass-card border border-white-border rounded-xl text-foreground placeholder-slate-400 focus:border-warm-gold focus:ring-1 focus:ring-warm-gold disabled:opacity-60 disabled:cursor-not-allowed resize-none"
                  placeholder="Enter your full address"
                />
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Preferences Section */}
      <div className="glass-card rounded-xl p-6 border border-white-border">
        <div className="mb-6">
          <h3 className="text-xl font-semibold modern-gradient-text">
            Preferences
          </h3>
          <p className="text-slate-400 mt-1">
            Customize your spa experience preferences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-3">
            <h4 className="font-medium text-foreground">Preferred Services</h4>
            <div className="space-y-2">
              {[
                "Massage Therapy",
                "Facial Treatments",
                "Aromatherapy",
                "Body Treatments",
              ].map((service) => (
                <label key={service} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    className="rounded border-white-border text-warm-gold focus:ring-warm-gold focus:ring-2"
                  />
                  <span className="text-slate-300">{service}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-foreground">Preferred Time</h4>
            <div className="space-y-2">
              {[
                "Morning (9-12 PM)",
                "Afternoon (12-4 PM)",
                "Evening (4-8 PM)",
                "Weekend Only",
              ].map((time) => (
                <label key={time} className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="preferredTime"
                    className="border-white-border text-warm-gold focus:ring-warm-gold focus:ring-2"
                  />
                  <span className="text-slate-300">{time}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-foreground">Communication</h4>
            <div className="space-y-2">
              {[
                "Email Notifications",
                "SMS Reminders",
                "Special Offers",
                "Birthday Rewards",
              ].map((option) => (
                <label key={option} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    className="rounded border-white-border text-warm-gold focus:ring-warm-gold focus:ring-2"
                  />
                  <span className="text-slate-300">{option}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

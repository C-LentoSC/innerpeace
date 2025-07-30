"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  MapPin,
} from "lucide-react";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    mobileNumber: "",
    password: "",
    confirmPassword: "",
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

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Navigation Bar */}
      <div className="absolute top-0 left-0 right-0 p-4">
        <div className="flex justify-start items-center text-sm text-foreground/70">
          <Link
            href={"/"}
            className="hover:text-warm-gold transition-colors flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-4xl mx-auto">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-32 h-32 mb-4">
            <Image
              src={"/assets/white-logo.svg"}
              alt="InnerPeace Logo"
              width={150}
              height={150}
              className="w-full h-full object-contain object-center"
            />
          </div>
        </div>

        {/* Signup Form */}
        <div className="space-y-6">
          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-light text-center text-foreground mb-8">
            Create Your Account
          </h1>

          {/* Form */}
          <form className="space-y-5">
            {/* Two Column Layout for Large Screens */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-5">
                {/* First Name Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground/80">
                    First Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="w-5 h-5 text-warm-gold" />
                    </div>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Enter First Name"
                      className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-md text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-warm-gold focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground/80">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="w-5 h-5 text-warm-gold" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter Your Email"
                      className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-md text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-warm-gold focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Address Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground/80">
                    Address
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
                      <MapPin className="w-5 h-5 text-warm-gold" />
                    </div>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Enter Your Address"
                      rows={4}
                      className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-md text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-warm-gold focus:border-transparent transition-all resize-none"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground/80">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="w-5 h-5 text-warm-gold" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter Your Password"
                      className="w-full pl-10 pr-12 py-3 bg-background border border-border rounded-md text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-warm-gold focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 text-warm-gold hover:text-accent transition-colors" />
                      ) : (
                        <Eye className="w-5 h-5 text-warm-gold hover:text-accent transition-colors" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-5">
                {/* Last Name Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground/80">
                    Last Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="w-5 h-5 text-warm-gold" />
                    </div>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Enter Last Name"
                      className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-md text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-warm-gold focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Mobile Number Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground/80">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="w-5 h-5 text-warm-gold" />
                    </div>
                    <input
                      type="tel"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleInputChange}
                      placeholder="Enter Your Mobile Number"
                      className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-md text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-warm-gold focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground/80">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="w-5 h-5 text-warm-gold" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm Your Password"
                      className="w-full pl-10 pr-12 py-3 bg-background border border-border rounded-md text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-warm-gold focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5 text-warm-gold hover:text-accent transition-colors" />
                      ) : (
                        <Eye className="w-5 h-5 text-warm-gold hover:text-accent transition-colors" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Empty space to balance the layout */}
                <div className="hidden lg:block lg:h-[120px]"></div>
              </div>
            </div>

            {/* Signup Button - Full width across both columns */}
            <div className="pt-6 lg:col-span-2">
              <div className="max-w-md mx-auto">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-b from-warm-gray to-soft-yellow text-background font-medium py-3 px-4 rounded-md transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 cursor-pointer"
                >
                  Create Account
                </button>
              </div>
            </div>
          </form>

          {/* Sign In Link */}
          <div className="text-center pt-4">
            <p className="text-foreground/70">
              Already Have an Account?{" "}
              <Link
                href={"/signin"}
                className="text-warm-gold hover:text-accent font-medium transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

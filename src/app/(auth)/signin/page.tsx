"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from "lucide-react";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
      <div className="w-full max-w-md mx-auto">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-32 h-32 mb-4">
            {/* Lotus/Leaf Icon */}
            <Image
              src={"/assets/white-logo.svg"}
              alt="InnerPeace Logo"
              width={150}
              height={150}
              className="w-full h-full object-contain object-center"
            />
          </div>
        </div>

        {/* Login Form */}
        <div className="space-y-8">
          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-light text-center text-foreground mb-10">
            Login to Your Account
          </h1>

          {/* Form */}
          <form className="space-y-6">
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Your Email"
                  className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-md text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-warm-gold focus:border-transparent transition-all"
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              <div className="text-right">
                <button
                  type="button"
                  className="text-sm text-foreground/60 hover:text-warm-gold transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            {/* Login Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-warm-gold hover:bg-accent text-background font-medium py-3 px-4 rounded-md transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Login
              </button>
            </div>
          </form>

          {/* Sign Up Link */}
          <div className="text-center pt-6">
            <p className="text-foreground/70">
              Don't Have a Account?{" "}
              <Link
                href={"/signup"}
                className="text-warm-gold hover:text-accent font-medium transition-colors"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

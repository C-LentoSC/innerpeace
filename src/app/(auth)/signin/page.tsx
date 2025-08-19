"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/Button";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

// Loading fallback component
const LoadingFallback = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      Loading...
    </div>
  );
};

// Main component with search params access
const SignInContent = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const message = searchParams.get("message");
    if (message) {
      setSuccessMessage(message);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        // Redirect to home page or dashboard
        router.push("/");
        router.refresh();
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      await signIn("google", {
        callbackUrl: "/",
      });
    } catch {
      setError("Failed to sign in with Google");
    } finally {
      setIsLoading(false);
    }
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
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Success Message */}
            {successMessage && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md text-sm">
                {successMessage}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}
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
              <Button type="submit" fullWidth disabled={isLoading}>
                {isLoading ? "Signing In..." : "Login"}
              </Button>
            </div>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background text-foreground/70">Or continue with</span>
            </div>
          </div>

          {/* Google Sign-in Button */}
          <div>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full flex items-center justify-center px-4 py-3 border border-border rounded-md shadow-sm bg-background text-foreground hover:bg-background/80 focus:outline-none focus:ring-2 focus:ring-warm-gold focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {isLoading ? "Signing In..." : "Sign in with Google"}
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="text-center pt-6">
            <p className="text-foreground/70">
              Don&apos;t Have a Account?{" "}
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

// Wrap the component with Suspense boundary
const SignIn = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SignInContent />
    </Suspense>
  );
};

export default SignIn;

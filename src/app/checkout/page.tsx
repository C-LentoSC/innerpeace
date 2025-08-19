"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/Button";
import { CURRENCY } from "@/constants/data";
import { 
  User, 
  Mail, 
  Phone, 
  MessageSquare, 
  CreditCard, 
  Clock,
  Calendar,
  Shield,
  CheckCircle
} from "lucide-react";

type Package = {
  id: string | number;
  name: string;
  description?: string;
  price: number;
  durationInMinutes?: number;
};

type Tax = {
  id: string;
  name: string;
  percentage: number;
  isActive: boolean;
};

function CheckoutContent() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();

  const [pkg, setPackage] = useState<Package | null>(null);
  const [taxes, setTaxes] = useState<Tax[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [preferredGender, setPreferredGender] = useState<"any" | "male" | "female">("any");
  const [specialRequests, setSpecialRequests] = useState("");

  const [paymentMethod, setPaymentMethod] = useState<"pay_now" | "pay_half">("pay_now");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const packageId = searchParams.get("packageId");
  const date = searchParams.get("date");
  const time = searchParams.get("time");
  const start = searchParams.get("start");
  const end = searchParams.get("end");
  const duration = searchParams.get("duration");

  // Redirect to signin if not authenticated
  useEffect(() => {
    if (status === "loading") return; // Still loading
    if (!session) {
      const currentUrl = window.location.pathname + window.location.search;
      router.push(`/signin?callbackUrl=${encodeURIComponent(currentUrl)}`);
      return;
    }
  }, [session, status, router]);

  useEffect(() => {
    if (session?.user?.email) {
      setUserName(session.user.name || "");
      setUserEmail(session.user.email);
    }
  }, [session]);

  // Fetch taxes
  useEffect(() => {
    const fetchTaxes = async () => {
      try {
        const response = await fetch("/api/taxes");
        if (response.ok) {
          const taxData = await response.json();
          setTaxes(taxData.filter((tax: Tax) => tax.isActive));
        }
      } catch (error) {
        console.error("Error fetching taxes:", error);
      }
    };

    fetchTaxes();
  }, []);

  // Calculate tax amounts
  const calculateTaxes = () => {
    if (!pkg || !taxes || taxes.length === 0) return { taxAmount: 0, totalWithTax: pkg?.price || 0, taxes: [] };
    
    const basePrice = Number(pkg.price);
    let totalTaxAmount = 0;
    const taxBreakdown: { name: string; percentage: number; amount: number }[] = [];
    
    taxes.forEach((tax) => {
      const taxAmount = Math.round((basePrice * Number(tax.percentage)) / 100);
      totalTaxAmount += taxAmount;
      taxBreakdown.push({
        name: tax.name,
        percentage: Number(tax.percentage),
        amount: taxAmount
      });
    });
    
    const totalWithTax = basePrice + totalTaxAmount;
    
    return {
      taxAmount: totalTaxAmount,
      totalWithTax,
      taxes: taxBreakdown
    };
  };

  const { taxAmount, totalWithTax, taxes: taxBreakdown } = calculateTaxes();
  const finalAmount = paymentMethod === "pay_half" ? Math.round(totalWithTax / 2) : totalWithTax;

  useEffect(() => {
    async function load() {
      if (!packageId) {
        setError("Missing package");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await fetch(`/api/packages/${packageId}`);
        if (!res.ok) throw new Error("Package not found");
        const data = await res.json();
        setPackage(data);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Failed to load package";
        setError(msg);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [packageId]);

  const submitBooking = async () => {
    const when = start || time;
    if (!packageId || !date || !when || !userName || !userEmail || !pkg) return;
    try {
      setIsSubmitting(true);
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageId,
          date,
          time: when,
          start: start || undefined,
          end: end || undefined,
          duration: duration ? Number(duration) : undefined,
          userName,
          userEmail,
          userPhone,
          notes: `${notes}${specialRequests ? `\n\nSpecial Requests: ${specialRequests}` : ''}${preferredGender !== 'any' ? `\nPreferred Gender: ${preferredGender}` : ''}`,
          paymentMethod,
        }),
      });
      if (!res.ok) {
        const errJson = (await res.json().catch(() => ({} as Record<string, unknown>))) as Record<string, unknown>;
        const message = typeof errJson.error === "string" ? errJson.error : "Failed to create booking";
        throw new Error(message);
      }
      const json = await res.json();
      const next = json?.next as string | undefined;
      const bookingId = json?.booking?.id || json?.id;
      if (next) {
        router.push(next);
      } else {
        router.push(`/booking-confirmation/${bookingId}`);
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to submit booking";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary mx-auto" />
          <p className="text-muted-foreground">
            {status === "loading" ? "Checking authentication..." : "Loading your booking details..."}
          </p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (user will be redirected)
  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary mx-auto" />
          <p className="text-muted-foreground">Redirecting to sign in...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md mx-auto p-6">
          <div className="h-16 w-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
            <Shield className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="text-xl font-semibold">Booking Error</h2>
          <p className="text-destructive">{error}</p>
          <Button onClick={() => router.back()} variant="outline">Go Back</Button>
        </div>
      </div>
    );
  }

  if (!pkg) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="my-container py-8 lg:py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold gradient-text1 mb-2">Complete Your Booking</h1>
          <p className="text-muted-foreground">Just a few more details to secure your wellness experience</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="xl:col-span-2 space-y-6">
            {/* Contact Information */}
            <div className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Contact Information</h3>
                  <p className="text-sm text-muted-foreground">Your booking details</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Full Name
                    </label>
                    <input
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    placeholder="+91 98765 43210"
                    required
                    minLength={4}
                  />
                  {userPhone && userPhone.length < 4 && (
                    <p className="text-sm text-red-500 mt-1">Phone number must be at least 4 digits</p>
                  )}
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 bg-accent/10 rounded-full flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Preferences & Notes</h3>
                  <p className="text-sm text-muted-foreground">Help us personalize your experience</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Preferred Therapist Gender</label>
                  <div className="flex gap-3">
                    {[
                      { value: "any", label: "No Preference" },
                      { value: "male", label: "Male" },
                      { value: "female", label: "Female" }
                    ].map((option) => (
                      <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          value={option.value}
                          checked={preferredGender === option.value}
                          onChange={(e) => setPreferredGender(e.target.value as "any" | "male" | "female")}
                          className="text-primary focus:ring-primary"
                        />
                        <span className="text-sm">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Additional Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
                    rows={3}
                    placeholder="Any specific requirements or health conditions we should know about?"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Special Requests</label>
                  <textarea
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
                    rows={2}
                    placeholder="Room temperature, music preferences, aromatherapy oils, etc."
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 bg-green-500/10 rounded-full flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Payment Method</h3>
                  <p className="text-sm text-muted-foreground">Choose your preferred payment option</p>
                </div>
              </div>

              <div className="space-y-3">
                <label className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  paymentMethod === "pay_now" ? 'border-primary bg-primary/5' : 'border-border/50 bg-background/30'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="pay_now"
                    checked={paymentMethod === "pay_now"}
                    onChange={() => setPaymentMethod("pay_now")}
                    className="sr-only"
                  />
                  <div className="flex items-center gap-3 w-full">
                    <CreditCard className="h-6 w-6 text-primary" />
                    <div className="flex-1">
                      <h4 className="font-medium">Pay Now</h4>
                      <p className="text-sm text-muted-foreground">Pay online now</p>
                    </div>
                    {paymentMethod === "pay_now" && <CheckCircle className="h-5 w-5 text-primary" />}
                  </div>
                </label>

                <label className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  paymentMethod === "pay_half" ? 'border-primary bg-primary/5' : 'border-border/50 bg-background/30'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="pay_half"
                    checked={paymentMethod === "pay_half"}
                    onChange={() => setPaymentMethod("pay_half")}
                    className="sr-only"
                  />
                  <div className="flex items-center gap-3 w-full">
                    <CreditCard className="h-6 w-6 text-primary" />
                    <div className="flex-1">
                      <h4 className="font-medium">Pay Half</h4>
                      <p className="text-sm text-muted-foreground">Pay 50% now, 50% later</p>
                    </div>
                    {paymentMethod === "pay_half" && <CheckCircle className="h-5 w-5 text-primary" />}
                  </div>
                </label>

                {paymentMethod === "pay_half" && (
                  <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div className="text-sm text-blue-800 dark:text-blue-200">
                        <p className="font-medium mb-1">Pay Half Now</p>
                        <p>Pay 50% of the amount now to secure your booking. The remaining 50% can be paid during your visit.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Booking Summary Sidebar */}
          <div className="xl:col-span-1">
            <div className="sticky top-8">
              <div className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Booking Summary</h3>
                    <p className="text-sm text-muted-foreground">Review your selection</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl">
                    <h4 className="font-semibold text-lg mb-2">{pkg.name}</h4>
                    {pkg.description && (
                      <p className="text-sm text-muted-foreground mb-3">{pkg.description}</p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Date</span>
                      </div>
                      <span className="font-medium">{date || "—"}</span>
                    </div>
                    
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Time</span>
                      </div>
                      <span className="font-medium">{start ? (end ? `${start} - ${end}` : start) : (time || "—")}</span>
                    </div>

                    {pkg.durationInMinutes && (
                      <div className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>Duration</span>
                        </div>
                        <span className="font-medium">{pkg.durationInMinutes} mins</span>
                      </div>
                    )}
                  </div>

                  <hr className="border-border/50" />
                  
                  {/* Price Breakdown */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between py-1">
                      <span className="text-muted-foreground">Base Price</span>
                      <span className="font-medium">{CURRENCY.symbol}{Number(pkg.price).toLocaleString()}</span>
                    </div>
                    
                    {taxBreakdown.map((tax) => (
                      <div key={tax.name} className="flex items-center justify-between py-1">
                        <span className="text-muted-foreground text-sm">
                          {tax.name} ({tax.percentage}%)
                        </span>
                        <span className="text-sm">+{CURRENCY.symbol}{Number(tax.amount).toLocaleString()}</span>
                      </div>
                    ))}
                    
                    {taxAmount > 0 && (
                      <div className="flex items-center justify-between py-1 border-t border-border/30 pt-2">
                        <span className="font-medium">Subtotal (incl. taxes)</span>
                        <span className="font-medium">{CURRENCY.symbol}{Number(totalWithTax).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                  
                  <hr className="border-border/50" />
                  
                  <div className="flex items-center justify-between py-2">
                    <span className="text-lg font-semibold">
                      {paymentMethod === "pay_half" ? "Pay Now (50%)" : "Total Amount"}
                    </span>
                    <span className="text-2xl font-bold text-primary">
                      {CURRENCY.symbol}{Number(finalAmount).toLocaleString()}
                    </span>
                  </div>
                  
                  {paymentMethod === "pay_half" && (
                    <div className="text-sm text-muted-foreground">
                      Remaining {CURRENCY.symbol}{Number(totalWithTax - finalAmount).toLocaleString()} to be paid at the salon
                    </div>
                  )}

                  <Button 
                    className="w-full py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all" 
                    disabled={isSubmitting || !date || !(time || start) || !userName || !userEmail || !userPhone || userPhone.length < 4} 
                    onClick={submitBooking}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                        <span>Processing...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        <span>Confirm Booking</span>
                      </div>
                    )}
                  </Button>

                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">
                      By confirming, you agree to our terms and conditions
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="my-container py-16">Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
